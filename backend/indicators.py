import pandas as pd
import numpy as np
from ta.momentum import RSIIndicator
from ta.trend import MACD, SMAIndicator, EMAIndicator
from ta.volatility import AverageTrueRange

def calculate_indicators(df: pd.DataFrame):
    if df.empty or len(df) < 30:
        return df

    # Make copy to avoid fragmentation
    df = df.copy()

    # RSI
    rsi = RSIIndicator(close=pd.Series(df['Close']), window=14)
    df['RSI'] = rsi.rsi()

    # MACD
    macd = MACD(close=pd.Series(df['Close']))
    df['MACD'] = macd.macd()
    df['MACD_Signal'] = macd.macd_signal()
    df['MACD_Diff'] = macd.macd_diff()

    # SMA (20 and 50 period)
    df['SMA_20'] = SMAIndicator(close=pd.Series(df['Close']), window=20).sma_indicator()
    df['SMA_50'] = SMAIndicator(close=pd.Series(df['Close']), window=50).sma_indicator()

    # EMA
    df['EMA_20'] = EMAIndicator(close=pd.Series(df['Close']), window=20).ema_indicator()

    # ATR
    atr = AverageTrueRange(high=pd.Series(df['High']), low=pd.Series(df['Low']), close=pd.Series(df['Close']), window=14)
    df['ATR'] = atr.average_true_range()

    # Momentum (Rate of Change)
    df['Momentum'] = df['Close'].pct_change(periods=5) * 100

    # Price Trend Setup (target variable proxy for training if needed)
    df['Price_Trend'] = np.where(df['Close'].shift(-5) > df['Close'] * 1.0005, 1, 
                          np.where(df['Close'].shift(-5) < df['Close'] * 0.9995, -1, 0))

    df.dropna(inplace=True)
    return df

def extract_latest_features(df: pd.DataFrame):
    if df.empty:
        return {}
    latest = df.iloc[-1]
    return {
        "RSI": float(latest.get("RSI", 50)),
        "MACD": float(latest.get("MACD", 0)),
        "MACD_Signal": float(latest.get("MACD_Signal", 0)),
        "SMA_20": float(latest.get("SMA_20", latest["Close"])),
        "EMA_20": float(latest.get("EMA_20", latest["Close"])),
        "ATR": float(latest.get("ATR", 0)),
        "Momentum": float(latest.get("Momentum", 0)),
        "Close": float(latest["Close"])
    }
