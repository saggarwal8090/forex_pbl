import yfinance as yf
import pandas as pd
import numpy as np
import time
import asyncio
from datetime import datetime
import os
from dotenv import load_dotenv
import requests

load_dotenv()

class DataManager:
    def __init__(self):
        self.cache = {}
        self.simulated_prices = {}
        # Mapping frontend symbols to yfinance symbols
        self.symbol_mapping = {
            "USDINR": "USDINR=X",
            "EURINR": "EURINR=X",
            "GBPINR": "GBPINR=X",
            "JPYINR": "JPYINR=X"
        }
        self.twelvedata_api_key = os.getenv("TWELVEDATA_API_KEY", "")
    
    def fetch_historical_data(self, pair: str, timeframe: str="5m", limit: int=500) -> pd.DataFrame:
        yf_symbol = self.symbol_mapping.get(pair, f"{pair}=X")
        
        # Mapping timeframe
        yf_interval = {
            "1m": "1m",
            "5m": "5m",
            "15m": "15m",
            "1h": "1h",
            "1d": "1d"
        }.get(timeframe, "5m")
        
        period = "5d"
        if yf_interval == "15m": period = "1mo"
        elif yf_interval == "1h": period = "3mo"
        elif yf_interval == "1d": period = "1y"
            
        data = yf.download(yf_symbol, interval=yf_interval, period=period)
        if not isinstance(data, pd.DataFrame):
            return pd.DataFrame()
        if data.empty:
            return pd.DataFrame()
            
        # Clean dataframe structure (Yfinance sometimes returns MultiIndex columns)
        if isinstance(data.columns, pd.MultiIndex):
            data.columns = data.columns.droplevel(1)
            
        df = data[["Open", "High", "Low", "Close", "Volume"]].copy()
        df.dropna(inplace=True)
        return df.tail(limit) # type: ignore

    def get_latest_price(self, pair):
        now = time.time()
        # Return cached price if fetched within the last 60 seconds
        if pair in self.cache and now - self.cache[pair].get("timestamp", 0) < 60:
            return self.cache[pair]["price"]

        price = None
        if self.twelvedata_api_key:
            try:
                # Poll TwelveData
                td_pair = f"{pair[:3]}/{pair[3:]}" # USDINR -> USD/INR
                url = f"https://api.twelvedata.com/price?symbol={td_pair}&apikey={self.twelvedata_api_key}"
                res = requests.get(url, timeout=3).json()
                if "price" in res:
                    price = float(res["price"])
            except Exception as e:
                print("Error polling TwelveData:", e)

        if price is None:
            try:
                yf_symbol = self.symbol_mapping.get(pair, f"{pair}=X")
                ticker = yf.Ticker(yf_symbol)
                history = ticker.history(period="1d", interval="1m")
                if not history.empty:
                    price = float(history["Close"].iloc[-1])
            except Exception as e:
                print("Error polling yfinance:", e)
                
        if price is not None:
            self.cache[pair] = {"price": price, "timestamp": now}
            
        return price

    def get_next_tick(self, pair):
        if not hasattr(self, 'simulated_prices'):
            self.simulated_prices = {}
            
        real_p = self.get_latest_price(pair)
        
        if pair not in self.simulated_prices:
            self.simulated_prices[pair] = real_p or 80.0
            
        current_price = self.simulated_prices[pair]
        
        # Add small noise to simulate ticks
        noise = np.random.normal(0, 0.005)
        current_price += noise
        
        # sync with real price gradually if available to prevent drift
        if real_p:
            current_price = current_price * 0.95 + real_p * 0.05
            
        self.simulated_prices[pair] = current_price
        
        timestamp = int(time.time() * 1000)
        return {
            "pair": pair,
            "price": round(float(current_price), 4),
            "timestamp": timestamp
        }
