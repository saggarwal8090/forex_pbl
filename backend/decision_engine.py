import typing

def generate_decision(probabilities, indicators, risk_preference):
    buy_prob = probabilities.get("buy", 0) * 100
    avoid_prob = probabilities.get("avoid", 0) * 100
    
    # Base Thresholds based on risk
    thresholds = {
        "low": 70.0,
        "medium": 60.0,
        "high": 50.0
    }
    
    buy_threshold = thresholds.get(risk_preference.lower(), 60.0) - 15.0 # Relaxed threshold
    
    rsi = indicators.get("RSI", 50)
    macd = indicators.get("MACD", 0)
    macd_signal = indicators.get("MACD_Signal", 0)
    atr = indicators.get("ATR", 0)
    price = indicators.get("Close", 1)
    
    # Compute Risk Score
    # Higher ATR relative to price = higher volatility = higher risk score
    volatility = (atr / price) * 10000 if price > 0 else 0
    risk_score = min(max((volatility * 2) + (100 - min(buy_prob, avoid_prob)), 0), 100)
    
    # Logical check
    # Buy: high prob, and RSI isn't completely exhausted (>80)
    if buy_prob >= buy_threshold and rsi < 80 and macd > -0.5:
        recommendation = "BUY"
        confidence = buy_prob
    elif avoid_prob >= buy_threshold and rsi > 20 and macd < 0.5:
        recommendation = "AVOID"
        confidence = avoid_prob
    else:
        recommendation = "HOLD"
        confidence = probabilities.get("hold", 0) * 100
        
    trend = "Bullish" if macd > 0 and rsi > 50 else "Bearish" if macd < 0 and rsi < 50 else "Neutral"
    
    # Generate Explanation
    explanation_lines: typing.List[str] = []
    
    # RSI EXPLANATION
    if rsi > 70:
        explanation_lines.append(f"RSI is {rsi:.1f} (Overbought > 70), indicating a potential price pullback.")
    elif rsi < 30:
        explanation_lines.append(f"RSI is {rsi:.1f} (Oversold < 30), suggesting upward price pressure.")
    else:
        explanation_lines.append(f"RSI is neutral at {rsi:.1f}.")

    # MACD EXPLANATION
    if macd > macd_signal:
        explanation_lines.append("MACD is crossed above its signal line, creating bullish momentum.")
    else:
        explanation_lines.append("MACD is tracking below its signal line, exhibiting bearish pressure.")

    # VOLATILITY
    if volatility > 50:
        explanation_lines.append("Volatility is currently high, increasing potential risk exposure.")
    elif volatility < 10:
        explanation_lines.append("Volatility is low, meaning sideways or slow price movement is expected.")
        
    explanation = " ".join(explanation_lines)
    
    # Calculate Targets based on ATR
    # For a risk-reward ratio of ~ 1:2
    target_distance = atr * 2
    sl_distance = atr * 1.5
    
    # Provide targets even for HOLD to show breakout levels
    if recommendation == "BUY":
        entry = price
        tp = price + target_distance
        sl = price - sl_distance
    elif recommendation == "AVOID":
        entry = price
        tp = price - target_distance
        sl = price + sl_distance
    else:
        # HOLD targets are breakout zones
        entry = price
        tp = price + atr
        sl = price - atr

    return {
        "recommendation": recommendation,
        "confidence_score": round(confidence, 1),
        "risk_score": round(risk_score, 1),
        "trend": trend,
        "explanation": explanation,
        "suggested_entry": round(entry, 4),
        "stop_loss": round(sl, 4),
        "take_profit": round(tp, 4),
        "indicator_summary": {
            "RSI": "Overbought" if rsi > 70 else "Oversold" if rsi < 30 else "Neutral",
            "MACD": "Bullish crossover" if macd > 0 else "Bearish crossover" if macd < 0 else "Neutral",
            "Volatility": "High" if volatility > 50 else "Low" if volatility < 10 else "Moderate"
        }
    }
