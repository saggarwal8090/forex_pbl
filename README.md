# INRForexSense — Real-Time AI Forex Prediction Dashboard 💱📈

A fully integrated **live forecasting application** powered by React, FastAPI, real-time WebSockets, and Machine Learning. Predict BUY / HOLD / AVOID signals for INR-based currency pairs with technical indicator analysis and an ML probability engine.

![Tech Stack](https://img.shields.io/badge/React-19-blue?logo=react) ![FastAPI](https://img.shields.io/badge/FastAPI-latest-teal?logo=fastapi) ![Python](https://img.shields.io/badge/Python-3.10+-yellow?logo=python) ![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Live Currency Feed** | Predictive tick engine built around `yfinance` with 5-second WebSocket streaming |
| **ML Insights** | Balanced Logistic Regression continuously predicting BUY / HOLD / AVOID probabilities against extracted technical indicators |
| **Indicator Suite** | Live MACD crossovers, RSI margins, ATR volatility, SMA/EMA moving averages |
| **Prediction Tracker** | Automatic accuracy tracking with configurable resolution windows |
| **Premium Dark UI** | Sleek glassmorphism dashboard with responsive design, smooth animations, and gradient accents |

---

## 🏗️ Architecture

```
┌──────────────────────────────┐      WebSocket (5s ticks)     ┌─────────────────────────────┐
│       React Frontend         │ ◄══════════════════════════► │       FastAPI Backend        │
│  (Vite + TailwindCSS v4)     │                               │                             │
│  • Lightweight-Charts        │      REST POST /predict       │  • yfinance data pipeline   │
│  • Real-time Indicators      │ ◄────────────────────────────►│  • scikit-learn ML model    │
│  • Prediction History        │                               │  • Technical Analysis (ta)  │
└──────────────────────────────┘                               └─────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **Docker** (optional, for containerized deployment)

### Using Docker (Recommended)

Spin up both services with a single command:

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

### Local Development (Manual)

#### 1. Backend

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

> Backend starts at `http://127.0.0.1:8000`

#### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

> Frontend starts at `http://localhost:5173`

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `backend/.env` file (see `backend/.env.example`):

| Variable | Description | Default |
|---|---|---|
| `TWELVEDATA_API_KEY` | Optional — TwelveData API key for real-time price polling | *(empty)* |
| `CORS_ORIGINS` | Comma-separated allowed origins | `*` |

### Frontend Environment Variables

Create a `frontend/.env` file (see `frontend/.env.example`):

| Variable | Description | Default |
|---|---|---|
| `VITE_WS_URL` | WebSocket endpoint URL | `ws://localhost:8000/ws/dashboard1` |

---

## 🧠 How the ML Engine Works

1. **Data Ingestion** — Historical OHLCV data fetched via `yfinance` for the selected currency pair and timeframe.
2. **Technical Indicators** — RSI, MACD, SMA, EMA, ATR, and Momentum are computed using the `ta` library.
3. **Model Training** — A **balanced Logistic Regression** model is trained on the extracted features with `Price_Trend` as the target (BUY=1, HOLD=0, AVOID=-1).
4. **Real-time Prediction** — Every 5 seconds, the latest tick data is enriched with indicators and fed through the model to generate probability spreads.
5. **Decision Engine** — Combines ML probabilities with rule-based threshold logic (configurable risk levels) to output BUY / HOLD / AVOID recommendations.
6. **Accuracy Tracking** — Predictions are logged and automatically resolved after a configurable time window to track real accuracy.

---

## 📂 Project Structure

```
forex_pbl/
├── backend/
│   ├── main.py                 # FastAPI app, WebSocket endpoint, REST API
│   ├── data_manager.py         # yfinance data fetching, tick simulation
│   ├── indicators.py           # Technical indicator calculations (RSI, MACD, etc.)
│   ├── ml_model.py             # Logistic Regression ML model
│   ├── decision_engine.py      # Rule-based decision logic + explanation generator
│   ├── prediction_tracker.py   # Prediction accuracy tracking & persistence
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Backend container config
│   └── .env.example            # Example environment variables
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Root application component
│   │   ├── main.jsx            # React entry point
│   │   ├── components/
│   │   │   ├── Dashboard.jsx       # Main dashboard orchestrator + WebSocket
│   │   │   ├── ChartPanel.jsx      # Live price chart (lightweight-charts)
│   │   │   ├── Controls.jsx        # Pair / timeframe / risk controls
│   │   │   ├── PredictionCard.jsx  # AI recommendation display
│   │   │   ├── IndicatorsPanel.jsx # Technical indicators display
│   │   │   ├── ExplanationPanel.jsx# AI reasoning explanation
│   │   │   └── PredictionHistory.jsx # Accuracy tracker table
│   │   └── index.css           # Global styles + Tailwind import
│   ├── index.html              # HTML entry point with SEO meta tags
│   ├── vite.config.js          # Vite configuration
│   ├── package.json            # Node dependencies
│   ├── Dockerfile              # Multi-stage frontend build (Nginx)
│   └── .env.example            # Example environment variables
├── docker-compose.yml          # Orchestrate both services
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 7, TailwindCSS v4, Lightweight-Charts, Lucide Icons, react-use-websocket |
| **Backend** | FastAPI, Uvicorn, WebSockets |
| **ML & Data** | scikit-learn, pandas, numpy, ta (Technical Analysis), yfinance |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
