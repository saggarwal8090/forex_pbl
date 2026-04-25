import asyncio
import json
import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd

from data_manager import DataManager
from indicators import calculate_indicators, extract_latest_features
from ml_model import MLModel
from decision_engine import generate_decision
from prediction_tracker import PredictionTracker

import uvicorn

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("inrforexsense")

data_manager = DataManager()
ml_model = MLModel()
tracker = PredictionTracker()

@asynccontextmanager
async def lifespan(app):
    logger.info("Pre-fetching initial data to train model if not present...")
    df = data_manager.fetch_historical_data("USDINR", "1h", limit=500)
    if not df.empty:
        df = calculate_indicators(df)
        success = ml_model.train_initial_model(df)
        logger.info("Model training initial status: %s", success)
    else:
        logger.warning("Could not fetch initial data — model will use fallback probabilities.")
    yield
    logger.info("Shutting down INRForexSense API.")

app = FastAPI(title="INRForexSense API", lifespan=lifespan)

cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache historical data across requests to keep it fast
# pair -> { df, last_update }
history_cache = {}

class PredictRequest(BaseModel):
    currency_pair: str
    timeframe: str
    risk_preference: str


@app.post("/predict")
async def predict(req: PredictRequest):
    pair = req.currency_pair.replace("/", "")
    
    df = data_manager.fetch_historical_data(pair, req.timeframe, 100)
    if df.empty:
        return {"error": "Could not fetch data"}
        
    df = calculate_indicators(df)
    latest_features = extract_latest_features(df)
    
    probs = ml_model.predict(latest_features)
    
    decision = generate_decision(probs, latest_features, req.risk_preference)
    
    return {
        "price": latest_features.get("Close"),
        "recommendation": decision["recommendation"],
        "confidence_score": decision["confidence_score"],
        "risk_score": decision["risk_score"],
        "trend": decision["trend"],
        "explanation": decision["explanation"],
        "indicator_summary": decision["indicator_summary"],
        "probabilities": probs,
        "indicators": latest_features
    }

@app.get("/accuracy")
async def get_accuracy():
    return tracker.get_stats()

# Active connections for websocket
active_connections = {}

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    active_connections[client_id] = websocket
    
    # Defaults
    current_pair = "USDINR"
    current_timeframe = "5m"
    current_risk = "medium"
    
    # Task to listen for configuration changes
    async def receive_config():
        nonlocal current_pair, current_timeframe, current_risk
        try:
            while True:
                data = await websocket.receive_text()
                config = json.loads(data)
                if "pair" in config: current_pair = config["pair"]
                if "timeframe" in config: current_timeframe = config["timeframe"]
                if "risk" in config: current_risk = config["risk"]
        except WebSocketDisconnect:
            pass

    config_task = asyncio.create_task(receive_config())
    
    try:
        import time  # noqa: E402
        # Stream loop
        while True:
            pair = current_pair.replace("/", "")
            
            # Using asyncio.to_thread to prevent blocking the async event loop during sync polling
            tick = await asyncio.to_thread(data_manager.get_next_tick, pair)
            
            # Update tracker accuracy periodically
            tracker.update_accuracy(pair, tick['price'], minutes_to_resolve=5)
            
            # Use cached historical data if recently fetched (within 1 min)
            now = time.time()
            cache_key = f"{pair}_{current_timeframe}"
            df = None
            
            if cache_key in history_cache and now - history_cache[cache_key]['last_update'] < 60:
                df = history_cache[cache_key]['df'].copy()
            else:
                try:
                    df = await asyncio.to_thread(data_manager.fetch_historical_data, pair, current_timeframe, 50)
                    if not df.empty:
                        history_cache[cache_key] = {'df': df.copy(), 'last_update': now}
                except Exception as e:
                    logger.error("Error fetching historical: %s", e)
                    # Use old cache if available as fallback
                    if cache_key in history_cache:
                        df = history_cache[cache_key]['df'].copy()
                    else:
                        df = pd.DataFrame()
            
            if df is not None and not df.empty:
                # Override last price with high frequency tick
                df.iloc[-1, df.columns.get_loc('Close')] = tick['price']
                
                df_calc = calculate_indicators(df)
                latest_features = extract_latest_features(df_calc)
                
                probs = ml_model.predict(latest_features)
                decision = generate_decision(probs, latest_features, current_risk)
                
                # Log this prediction
                tracker.log_prediction(pair, current_timeframe, decision["recommendation"], tick['price'])
                
                response_payload = {
                    "type": "tick",
                    "pair": current_pair,
                    "timestamp": tick['timestamp'],
                    "price": tick['price'],
                    "recommendation": decision["recommendation"],
                    "confidence_score": decision["confidence_score"],
                    "risk_score": decision["risk_score"],
                    "trend": decision["trend"],
                    "explanation": decision.get("explanation", ""),
                    "indicator_summary": decision["indicator_summary"],
                    "probabilities": probs,
                    "indicators": latest_features,
                    "tracker_stats": tracker.get_stats(),
                    "suggested_entry": decision.get("suggested_entry"),
                    "stop_loss": decision.get("stop_loss"),
                    "take_profit": decision.get("take_profit")
                }
                
                await websocket.send_json(response_payload)
                
            await asyncio.sleep(5)
    except Exception as e:
        logger.info("WebSocket client %s disconnected: %s", client_id, e)
    finally:
        config_task.cancel()
        if client_id in active_connections:
            active_connections.pop(client_id, None)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
