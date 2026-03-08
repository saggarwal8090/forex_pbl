# INRForexSense — Real-Time AI Forex Prediction Dashboard 💱📈

[![Tech Stack](https://img.shields.io/badge/React-19-blue?logo=react) ![FastAPI](https://img.shields.io/badge/FastAPI-latest-teal?logo=fastapi) ![Python](https://img.shields.io/badge/Python-3.10+-yellow?logo=python) ![License](https://img.shields.io/badge/License-MIT-green)](https://github.com/saggarwal8090/forex_pbl)

A fully integrated, real-time forecasting application developed as a comprehensive Software Engineering Project. It integrates modern Web Development (React, FastAPI), real-time bidirectional communication (WebSockets), and Machine Learning (Logistic Regression) to predict market movements in INR-based currency pairs.

---

## 📑 Table of Contents

1. [Abstract & Problem Statement](#-abstract--problem-statement)
2. [System Architecture](#-system-architecture)
3. [Technology Stack](#-technology-stack)
4. [Machine Learning Pipeline](#-machine-learning-pipeline)
5. [Core Modules & Data Flow](#-core-modules--data-flow)
6. [Trading Logic & Decision Engine](#-trading-logic--decision-engine)
7. [API Documentation](#-api-documentation)
8. [Setup & Installation](#-setup--installation)
9. [Project Structure](#-project-structure)
10. [Future Scope](#-future-scope)

---

## 🎯 Abstract & Problem Statement

### Problem
Forex trading, particularly involving the Indian Rupee (INR), is highly volatile. Retail traders often lack access to expensive institutional-grade real-time analytical tools. Furthermore, raw market data is noisy, making it difficult for an average trader to interpret moving averages, momentum, and volatility simultaneously in real-time.

### Solution
**INRForexSense** bridges this gap by providing a sleek, low-latency dashboard that ingests live market data, computes complex technical indicators (RSI, MACD, ATR, SMA, EMA) on the fly, and feeds them into a mathematically balanced Machine Learning model. The system outputs an actionable **BUY**, **SELL/AVOID**, or **HOLD** signal alongside exact calculated trade targets (Entry, Stop Loss, Take Profit), ensuring traders make data-backed decisions.

---

## 🏗️ System Architecture

The application follows a decoupled **Client-Server Architecture** utilizing a publish-subscribe pattern via WebSockets for high-frequency data streaming.

```text
┌──────────────────────────────┐                           ┌─────────────────────────────┐
│       React Frontend         │    WebSocket (5s ticks)   │       FastAPI Backend        │
│                              │ ◄═══════════════════════► │                             │
│  [ UI Components ]           │                           │  [ Core Microservices ]     │
│  • Lightweight-Charts        │                           │  • yfinance Data Ingestion  │
│  • Indicators Panel          │      REST POST /predict   │  • Technical Analysis (TA)  │
│  • AI Prediction Engine UI   │ ◄───────────────────────► │  • Scikit-Learn Model       │
│  • Accuracy Tracker          │                           │  • Decision & Rules Engine  │
└──────────────────────────────┘                           └─────────────────────────────┘
```

---

## 💻 Technology Stack

### Frontend (Client-Side)
* **Framework:** React 19 + Vite 7 (for lightning-fast HMR and optimized production builds)
* **Styling:** TailwindCSS v4 (Utility-first CSS, Custom Glassmorphism UI)
* **Charting:** Lightweight-Charts by TradingView (Canvas-based high-performance rendering)
* **Icons & UI:** Lucide-React
* **Networking:** `react-use-websocket` (Robust reconnect logic), Axios

### Backend (Server-Side)
* **Framework:** FastAPI (Asynchronous, high-performance Python web framework)
* **Server:** Uvicorn (ASGI web server implementation)
* **Concurrency:** Python `asyncio` for non-blocking WebSocket I/O and synchronous model inferences

### Machine Learning & Data Layer
* **Data Sources:** `yfinance` (Yahoo Finance API), TwelveData (Fallback polling)
* **Technical Analysis:** `ta` library (Momentum, Volatility, Trend indicators)
* **Model:** `scikit-learn` (Logistic Regression with balanced class weights)
* **Data Manipulation:** `pandas`, `numpy`
* **Persistence:** `joblib` (Model serialization), JSON (Accuracy tracking state)

### DevOps & Deployment
* **Containerization:** Docker, Docker Compose
* **Web Server:** Nginx (Frontend serving and fast static routing)

---

## 🧠 Machine Learning Pipeline

The prediction capabilities of INRForexSense rely on a robust pipeline that dynamically trains and infers data.

1. **Feature Engineering:** We extract the following features from OHLCV (Open, High, Low, Close, Volume) data:
   * **RSI (14)**: Relative Strength Index for momentum.
   * **MACD**: Moving Average Convergence Divergence (Trend proxy).
   * **ATR (14)**: Average True Range (Absolute volatility proxy).
   * **SMA (20) & EMA (20)**: Simple and Exponential Moving Averages.
2. **Target Variable Proxy:** The model attempts to predict a `Price_Trend` proxy over a localized moving window (e.g., will the price be > 1.0005x higher in the next 5 intervals?). Label mapping: `[1 = BUY, 0 = HOLD, -1 = SELL]`.
3. **Training Phase:**
   * Handled automatically via FastAPI's `lifespan` context manager upon server boot.
   * Historical data is fetched, features calculated, and `StandardScaler` is fitted to normalize the distribution.
   * A **Logistic Regression** model is trained utilizing `class_weight='balanced'` to prevent bias toward the majority class (typically 'HOLD').
4. **Inference Phase:** Live ticks are fed through the saved `scaler` and into `.predict_proba()` to yield percentage-based confidence scores across the 3 classes.

---

## 🔄 Core Modules & Data Flow

### 1. `data_manager.py` (Data Ingestion Engine)
Handles pulling massive historical datasets from Yahoo Finance and simulating high-frequency live ticks. Included a Gaussian noise generator (`np.random.normal`) over the real baseline price to simulate intense 5-second tick volatility circumventing API rate-limits for localized testing.

### 2. `indicators.py` (Mathematics Module)
Vectorized operations using Pandas to instantly map incoming OHLC data into the required ML feature space (RSI, MACD_Signal, etc.) without blocking the event loop.

### 3. `decision_engine.py` (The Brain)
Combines the raw mathematical probability output from the ML model with strict logical risk-management guardrails. E.g., The model might recommend "BUY", but if the RSI is > 80 (Severely Overbought), the Decision Engine vetoes the signal to prevent a massive loss on an impending pullback.

### 4. `prediction_tracker.py` (Real-Time Auditing)
Logs every unique prediction into system memory to audit AI performance. It constantly checks older predictions against the *current* market price to evaluate if the AI's call was mathematically correct, returning a live "Total Accuracy %" output.

---

## 📈 Trading Logic & Decision Engine

The platform operates on a configurable **Risk Preference Model** (Low, Medium, High). 

* **Take Profit (TP) / Stop Loss (SL) Generation:**
  Instead of static target distances, the AI dynamically calculates ranges based on live volatility using the **Average True Range (ATR)**.
  * *Reward Ratio:* TP = Entry ± (ATR × 2)
  * *Risk Ratio:* SL = Entry ∓ (ATR × 1.5)
* **Response Labels:** Dynamically updates. E.g., if a Short (SELL) position is recommended, the UI explicitly states `Take Profit (Short)` and calculates the profit target mathematically lower than the Entry price to prevent user confusion.

---

## 🔌 API Documentation

### REST Endpoints

#### `POST /predict`
Generates a one-off prediction based on historical look-backs.
* **Payload:** `{"currency_pair": "USDINR", "timeframe": "5m", "risk_preference": "medium"}`
* **Response:** JSON containing ML probabilities, calculated indicators, dynamic TP/SL targets, and natural language explanations.

#### `GET /accuracy`
Retrieves the historical performance metrics of the AI engine.

### WebSocket Endpoint
#### `ws://<host>:8000/ws/{client_id}`
Establishes a bi-directional streaming connection. 
* **Client sends:** Configuration changes (e.g., `{"timeframe": "15m"}`).
* **Server streams (every 5s):**
  ```json
  {
    "type": "tick",
    "timestamp": 1709904212,
    "price": 82.9104,
    "recommendation": "BUY",
    "confidence_score": 75.4,
    "suggested_entry": 82.9104,
    "take_profit": 82.9550,
    "stop_loss": 82.8800,
    "tracker_stats": {...}
  }
  ```

---

## 🚀 Setup & Installation

### Option 1: Docker (Containerized Production Build)
The easiest way to run the software engineering project.
```bash
git clone https://github.com/saggarwal8090/forex_pbl.git
cd forex_pbl

# Build and start the entire isolated stack
docker-compose up --build
```
* **Frontend Dashboard:** `http://localhost:5173`
* **Backend API & Swagger Docs:** `http://localhost:8000/docs`

### Option 2: Local Development Environment

#### Backend (FastAPI / Machine Learning)
```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate | Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python main.py
```

#### Frontend (React / Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```text
forex_pbl/
├── backend/
│   ├── main.py                 # Core ASGI interface & WS router
│   ├── data_manager.py         # YFinance pipeline & tick simulation
│   ├── indicators.py           # Vectorized technical analysis
│   ├── ml_model.py             # Scikit-learn Logistic Regression wrapper
│   ├── decision_engine.py      # Threshold logic & ATR Target generation
│   ├── prediction_tracker.py   # AI Auditing and performance persistence
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/         # Modular React codebase
│   │   │   ├── Dashboard.jsx        # Main orchestrator
│   │   │   ├── ChartPanel.jsx       # Canvas-based lightweight-chart
│   │   │   ├── PredictionCard.jsx   # UI displaying predictions & TP/SL
│   │   │   ├── IndicatorsPanel.jsx  # Live dynamic dials for MA/RSI
│   │   │   └── DisclaimerModal.jsx  # Startup warning gate
│   │   ├── index.css           # Tailwind injection & Keyframes
│   │   └── App.jsx             # React entry wrapper
│   └── package.json            # Node dependencies
└── docker-compose.yml          # Network & Orchestration config
```

---

## 🔭 Future Scope

1. **Deep Learning Integration:** Replace the Logistic Regression model with an LSTM (Long Short-Term Memory) Recurrent Neural Network for superior time-series forecasting.
2. **Order Execution Interfacing:** Connect the suggested Take Profit and Stop Loss triggers directly to a brokerage API (e.g., Zerodha Kite Connect, Interactive Brokers) for automated paper trading.
3. **Multi-Asset Scaling:** Expand beyond INR pairs into Crypto (BTC/ETH), Commodities (XAU/USD), and global equities via websocket aggregators.

---

> **Disclaimer:** This software is an educational engineering project. The ML engine predictions are simulated probabilities and should absolutely not be utilized for live financial capital allocation. 
