import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import joblib
import os
import typing

class MLModel:
    def __init__(self, model_path="model.joblib", scaler_path="scaler.joblib"):
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.model: typing.Any = None
        self.scaler: typing.Any = None
        
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
            self.model = joblib.load(self.model_path)
            self.scaler = joblib.load(self.scaler_path)
            
    def train_initial_model(self, df):
        # We need historical data with indicators calculated and 'Price_Trend' target
        features = ["RSI", "MACD", "SMA_20", "EMA_20", "ATR", "Momentum"]
        
        # 0: HOLD, 1: BUY, -1: AVOID/SELL
        if len(df) < 50:
            return False
            
        X = df[features].values
        y = df['Price_Trend'].values  
        
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        self.model = LogisticRegression(class_weight='balanced', max_iter=1000)
        self.model.fit(X_scaled, y)
        
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, self.scaler_path)
        return True

    def predict(self, features_dict):
        if not self.model or not self.scaler:
            # Fallback random probability for robustness if model not yet trained
            return {
                "buy": 0.33,
                "hold": 0.34,
                "avoid": 0.33
            }
            
        feature_order = ["RSI", "MACD", "SMA_20", "EMA_20", "ATR", "Momentum"]
        X = np.array([[features_dict.get(f, 0) for f in feature_order]])
        
        X_scaled = self.scaler.transform(X)
        proba = self.model.predict_proba(X_scaled)[0]
        
        classes = self.model.classes_ # typically [-1, 0, 1]
        
        # Map classes to buy/hold/avoid probabilities
        prob_dict = {"buy": 0.0, "hold": 0.0, "avoid": 0.0}
        for cls, p in zip(classes, proba):
            if cls == 1:
                prob_dict["buy"] = float(p)
            elif cls == 0:
                prob_dict["hold"] = float(p)
            elif cls == -1:
                prob_dict["avoid"] = float(p)
                
        return prob_dict
