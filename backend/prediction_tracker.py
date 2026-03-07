import time
import json
import os
import typing

class PredictionTracker:
    def __init__(self, persistence_file="predictions.json"):
        self.persistence_file = persistence_file
        self.predictions: typing.Any = [] # List of dicts
        self.load()

    def load(self):
        if os.path.exists(self.persistence_file):
            try:
                with open(self.persistence_file, "r") as f:
                    self.predictions = json.load(f)
            except Exception:
                self.predictions = []

    def save(self):
        try:
            with open(self.persistence_file, "w") as f:
                json.dump(self.predictions, f)
        except Exception as e:
            print("Error saving predictions:", e)

    def log_prediction(self, pair, timeframe, predicted_signal, price_at_prediction):
        # We store when it happened, and checking interval (e.g. 15 mins = 900 seconds)
        record = {
            "id": int(time.time() * 1000),
            "timestamp": time.time(),
            "pair": pair,
            "timeframe": timeframe,
            "predicted_signal": predicted_signal, # BUY, SELL, HOLD, AVOID
            "price_at_prediction": price_at_prediction,
            "status": "pending", # 'pending', 'correct', 'incorrect'
            "resolution_price": None,
            "resolved_at": None
        }
        self.predictions.append(record)
        # Keep last 500
        if len(self.predictions) > 500:
            self.predictions = self.predictions[-500:]
        self.save()
        return record

    def update_accuracy(self, current_pair, current_price, minutes_to_resolve=5):
        # For demo purposes, we resolve fast (e.g., 1 minute or 5 minutes later)
        now = time.time()
        updated = False
        for p in self.predictions:
            if p["status"] == "pending" and p["pair"] == current_pair:
                # If X minutes have passed
                unresolved_time = now - p.get("timestamp", now)
                if unresolved_time >= (minutes_to_resolve * 60):
                    # Check if correct
                    # BUY is correct if price went up
                    # AVOID/SELL is correct if price went down
                    pred_price = p.get("price_at_prediction", current_price)
                    diff = current_price - pred_price
                    
                    if p["predicted_signal"] == "BUY" and diff > 0:
                        p["status"] = "correct"
                    elif (p["predicted_signal"] == "AVOID" or p["predicted_signal"] == "SELL") and diff < 0:
                        p["status"] = "correct"
                    elif p["predicted_signal"] == "HOLD":
                        # HOLD is correct if price stayed approx same (within 0.05%)
                        if pred_price > 0 and abs(diff) / pred_price < 0.0005:
                            p["status"] = "correct"
                        else:
                            p["status"] = "incorrect"
                    else:
                        p["status"] = "incorrect"

                    p["resolution_price"] = current_price
                    p["resolved_at"] = now
                    updated = True
        
        if updated:
            self.save()

    def get_stats(self):
        total = [p for p in self.predictions if p["status"] != "pending"]
        correct = [p for p in self.predictions if p["status"] == "correct"]
        return {
            "total_resolved": len(total),
            "correct": len(correct),
            "accuracy_percent": round(float((len(correct) / len(total)) * 100), 1) if total else 0,
            "history": list(reversed(self.predictions[-50:])) # last 50, newest first
        }
