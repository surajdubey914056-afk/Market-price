# Market Price Prediction for Agricultural Products (AgriPrice AI)

> **"Forecasts future prices of crops and vegetables using historical market data and seasonal trends."**

A complete, production-grade, full-stack Agricultural Market Intelligence & Price Forecasting Platform built with **HTML5, CSS3, Bootstrap 5, JavaScript, React 18, Chart.js**, and a **Python FastAPI Machine Learning backend**.

---

## 🌾 Features & Capabilities

1. **AI & Machine Learning Price Forecasting Engine**:
   - Multi-step recursive price forecasting for **16+ agricultural commodities** across **12 Indian agricultural states** and **60+ APMC mandis**.
   - Combines **Scikit-Learn Random Forest Regression** with **Time-Series Harmonic Decomposition** to capture seasonal crop harvest cycles and supply spikes.
   - Outputs:
     - Predicted Price (₹/Quintal & ₹/Kg)
     - Expected Percentage Change (% gain/loss)
     - 95% Expanding Confidence Bounds (Upper and Lower intervals)
     - Model Confidence Score (80% - 95%)
     - Trend Direction: **Bullish (Rising)**, **Bearish (Falling)**, or **Stable**
     - Actionable Advisory tailored for farmers and traders (e.g. optimal selling window)
     - Key Influential Factors breakdown (Seasonality, Rainfall anomalies, Mandi arrival shocks, Fuel transport index).

2. **Interactive Chart.js Time-Series Visualization**:
   - Smooth continuous dual-series charts showing the past 60 days of actual historical prices seamlessly transitioning into the future projected trajectory.
   - Shaded 95% confidence intervals band.
   - Tooltips with localized currency formatting and unit prices.

3. **Live APMC Mandi Market Explorer**:
   - 120+ real-time mandi benchmark quotes.
   - Live search by crop, state, or mandi name.
   - Category filtering (Vegetables, Cereals & Grains, Pulses, Commercial/Cash Crops, Fruits).
   - "Forecast This" quick-action shortcut that syncs directly into the prediction form.

4. **Farmer Cold Storage & Timing ROI Calculator**:
   - Simulates whether a farmer or trader should sell immediately at today's mandi auction price or store produce in cold storage / dry warehouse.
   - Factors in quantity (quintals), duration (days), storage rent, and natural moisture shrinkage.
   - Computes net ROI difference and provides automated strategic recommendations.

5. **Crop Cultivation & Market Demand Synergy Advisory**:
   - Links agro-climatic conditions (soil type, rainfall, temperature) to forecasted high-margin crops to guide planting decisions.

6. **Interactive REST API & Swagger UI**:
   - Complete FastAPI backend with automated documentation at `http://127.0.0.1:8000/docs`.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend Framework** | React 18 (Component Tree, State Hooks, Dynamic Filters) |
| **Styling & UI** | HTML5, CSS3 (Custom Glassmorphism & Agricultural Design), Bootstrap 5.3.3 |
| **Icons & Fonts** | FontAwesome 6.5.2, Google Fonts (Inter) |
| **Data Visualization** | Chart.js 4.4.2 (Time-series forecast curves & confidence bands) |
| **Backend & REST API** | Python 3.13, FastAPI 0.162, Uvicorn, Pydantic |
| **Machine Learning** | Scikit-Learn (Random Forest Regressor, Ridge Regression), NumPy, Pandas |

---

## 🚀 How to Run the Website

### Method 1: One-Click Windows Launch (Recommended)
Simply double-click the included batch script:
```bat
run.bat
```
This automatically starts the Python backend and launches the website in your default browser at `http://127.0.0.1:8000`.

---

### Method 2: Manual Terminal Launch
1. Ensure dependencies are installed:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the FastAPI server:
   ```bash
   python start_server.py
   ```
3. Open your browser and go to:
   - **Website**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - **Interactive API Documentation (Swagger)**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Method 3: Standalone Offline Mode
You can also directly double-click `index.html` in the root folder to view the application in any web browser without running a server. The frontend includes built-in client-side forecasting algorithms and pre-populated datasets as an automatic fallback.

---

## 📡 REST API Reference

### 1. `POST /api/predict`
Predict future market prices using ML models.

**Request Body:**
```json
{
  "commodity": "tomato",
  "state": "Maharashtra",
  "market": "Lasalgaon Mandi",
  "forecast_days": 30,
  "rainfall_condition": "Normal",
  "supply_arrival_trend": "Normal Arrival",
  "fuel_transport_index": 100.0
}
```

**Response:**
```json
{
  "commodity": "Tomato (Tamatar)",
  "state": "Maharashtra",
  "market": "Lasalgaon Mandi",
  "forecast_days": 30,
  "current_price": 1749.88,
  "predicted_price": 1329.73,
  "price_change": -420.15,
  "price_change_percentage": -24.01,
  "confidence_score": 82.5,
  "upper_bound": 1780.4,
  "lower_bound": 879.06,
  "trend_direction": "Bearish (Falling)",
  "risk_level": "High",
  "factors": [...],
  "daily_forecast": [...]
}
```

### 2. `GET /api/storage-roi`
Calculates net profit/loss for cold storage vs selling immediately.
```
GET /api/storage-roi?commodity_id=onion&quantity_quintals=150&storage_days=45&cold_storage_rate_per_month=40
```

### 3. `GET /api/mandi-prices`
Retrieves live benchmark prices across 60+ APMC mandis.

### 4. `GET /api/commodities`
Lists metadata for all 16 supported agricultural commodities.

---

## 📂 Project Directory Structure

```
market price/
│
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI server, CORS, routing & static mounts
│   ├── models.py            # Pydantic data schemas
│   ├── data_generator.py    # Mandi dataset engine & seasonal cycles
│   └── ml_engine.py         # Scikit-Learn Random Forest & Time-Series Regressor
│
├── static/
│   ├── css/
│   │   └── style.css        # Custom agricultural styling & animations
│   └── js/
│       └── react-app.js     # React 18 frontend component tree & Chart.js integration
│
├── templates/
│   └── index.html           # Server-rendered Single Page Application
│
├── index.html               # Direct browser-openable entrypoint
├── start_server.py          # Server launcher script
├── run.bat                  # One-click Windows starter script
├── requirements.txt         # Python package dependencies
└── README.md                # Project documentation
```
