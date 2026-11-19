/**
 * AgriPrice AI - Frontend React Application
 * 3D Animated UI with Real Crop Imagery, SQLite History, Price Alerts, and Model Diagnostics
 */

const { useState, useEffect, useRef, useMemo } = React;

// Curated High-Definition Agricultural Imagery
const CROP_IMAGES = {
  "wheat": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
  "rice_paddy": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
  "maize": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
  "chana": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80",
  "arhar_tur": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
  "moong": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
  "tomato": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
  "onion": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80",
  "potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
  "green_chilli": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80",
  "garlic": "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80",
  "cotton": "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80",
  "soybean": "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=600&q=80",
  "mustard": "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80",
  "apple": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
  "banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80"
};

const DEFAULT_COMMODITIES = [
  { id: "tomato", name: "Tomato (Tamatar)", category: "Vegetables", base_price: 3150.0, icon: "fa-apple-whole", top_states: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Madhya Pradesh"] },
  { id: "onion", name: "Onion (Pyaz)", category: "Vegetables", base_price: 2680.0, icon: "fa-egg", top_states: ["Maharashtra", "Madhya Pradesh", "Karnataka", "Gujarat"] },
  { id: "potato", name: "Potato (Aloo)", category: "Vegetables", base_price: 1850.0, icon: "fa-lemon", top_states: ["Uttar Pradesh", "West Bengal", "Bihar", "Gujarat"] },
  { id: "wheat", name: "Wheat (Gehu)", category: "Cereals & Grains", base_price: 2450.0, icon: "fa-wheat-awn", top_states: ["Punjab", "Haryana", "Madhya Pradesh", "Uttar Pradesh"] },
  { id: "rice_paddy", name: "Paddy / Rice (Chawal)", category: "Cereals & Grains", base_price: 2380.0, icon: "fa-bowl-rice", top_states: ["Punjab", "West Bengal", "Uttar Pradesh", "Andhra Pradesh"] },
  { id: "chana", name: "Chickpea / Chana (Gram)", category: "Pulses", base_price: 5850.0, icon: "fa-circle-dot", top_states: ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Gujarat"] },
  { id: "cotton", name: "Cotton (Kapas)", category: "Commercial & Cash Crops", base_price: 7250.0, icon: "fa-feather", top_states: ["Gujarat", "Maharashtra", "Telangana", "Andhra Pradesh"] },
  { id: "soybean", name: "Soybean (Yellow)", category: "Commercial & Cash Crops", base_price: 4680.0, icon: "fa-sun", top_states: ["Madhya Pradesh", "Maharashtra", "Rajasthan"] }
];

const DEFAULT_STATES = {
  "Punjab": ["Khanna Mandi", "Ludhiana APMC", "Jalandhar Grain Market", "Amritsar Mandi"],
  "Maharashtra": ["Lasalgaon Mandi", "Pune APMC", "Vashi Navi Mumbai", "Nashik APMC", "Nagpur Cotton Market"],
  "Uttar Pradesh": ["Azadpur Mandi Hub", "Kanpur Mandi", "Agra Fruit & Veg Market", "Varanasi Mandi"],
  "Madhya Pradesh": ["Indore APMC (Choithram)", "Bhopal Karond Mandi", "Ujjain Grain Market", "Neemuch Mandi"],
  "Gujarat": ["Rajkot Marketing Yard", "Gondal Mandi", "Unjha APMC", "Surat APMC"],
  "Haryana": ["Karnal Grain Market", "Kurukshetra Mandi", "Sirsa Mandi"],
  "Rajasthan": ["Kota Bhamashah Mandi", "Jaipur Muhana Mandi", "Jodhpur Mandi"],
  "Karnataka": ["Yeshwanthpur APMC Bengaluru", "Hubballi Mandi", "Kolar Tomato Yard"],
  "Tamil Nadu": ["Koyambedu Wholesale Chennai", "Madurai Mattuthavani", "Coimbatore APMC"],
  "Andhra Pradesh": ["Guntur Mirchi Yard", "Vijayawada Wholesale Market", "Kurnool APMC"],
  "West Bengal": ["Koley Market Kolkata", "Siliguri Wholesale Hub", "Burdwan Rice Hub"],
  "Telangana": ["Bowenpally Market Yard", "Warangal Grain Market", "Nizamabad Mandi"]
};

// ================= Top Live Ticker Component =================
function LiveTicker({ tickerItems, onSelectCommodity }) {
  if (!tickerItems || tickerItems.length === 0) return null;

  return (
    <div className="live-ticker-wrap">
      <div className="container-fluid px-3 d-flex align-items-center">
        <div className="ticker-badge me-3 flex-shrink-0">
          <span className="pulse-dot"></span>
          LIVE 3D MANDI STREAM
        </div>
        <div className="overflow-hidden flex-grow-1">
          <div className="ticker-track">
            {tickerItems.concat(tickerItems).map((item, idx) => (
              <div 
                key={idx} 
                className="ticker-item"
                onClick={() => onSelectCommodity(item.commodity_id || item.commodity)}
                title="Click to forecast future price"
              >
                <span className="fw-bold">{item.commodity}</span>
                <span className="text-white-50">({item.mandi.split(' ')[0]})</span>
                <span className="fw-bolder">₹{Math.round(item.modal_price).toLocaleString()}</span>
                <span className={item.price_change_24h >= 0 ? "text-warning fw-bold" : "text-danger-emphasis fw-bold"}>
                  <i className={`fa-solid ${item.price_change_24h >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'} me-1`}></i>
                  {Math.abs(item.price_change_24h)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= Main App Component =================
function App() {
  const [commodities, setCommodities] = useState(DEFAULT_COMMODITIES);
  const [statesMap, setStatesMap] = useState(DEFAULT_STATES);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [activeTab, setActiveTab] = useState("predictor");
  
  // Predictor State
  const [selectedCommodity, setSelectedCommodity] = useState("tomato");
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [selectedMandi, setSelectedMandi] = useState("Lasalgaon Mandi");
  const [forecastDays, setForecastDays] = useState(30);
  const [rainfallCondition, setRainfallCondition] = useState("Normal");
  const [arrivalTrend, setArrivalTrend] = useState("Normal Arrival");
  const [fuelIndex, setFuelIndex] = useState(100);
  
  // Results
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Database History & Alerts State
  const [historyLogs, setHistoryLogs] = useState([]);
  const [alertsList, setAlertsList] = useState([]);
  const [newAlert, setNewAlert] = useState({ farmer_name: "", contact: "", commodity: "Tomato (Tamatar)", target_price: 2500, condition: "ABOVE" });
  const [alertSuccess, setAlertSuccess] = useState("");

  // ML Diagnostics
  const [modelMetrics, setModelMetrics] = useState(null);
  const [isRetraining, setIsRetraining] = useState(false);

  // Storage ROI State
  const [storageCrop, setStorageCrop] = useState("onion");
  const [storageQty, setStorageQty] = useState(150);
  const [storageDays, setStorageDays] = useState(45);
  const [storageMonthlyRate, setStorageMonthlyRate] = useState(40);
  const [storageResult, setStorageResult] = useState(null);

  // Mandi Explorer Filter State
  const [searchMandi, setSearchMandi] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Smart Harvesting System State (From Project Image Line 3)
  const [harvestCrop, setHarvestCrop] = useState("tomato");
  const [harvestMaturity, setHarvestMaturity] = useState(88);
  const [harvestMoisture, setHarvestMoisture] = useState(24);
  const [harvestWeather, setHarvestWeather] = useState("Approaching Rain in 48h");
  const [harvestAcres, setHarvestAcres] = useState(2.5);
  const [harvestResult, setHarvestResult] = useState(null);
  const [isCalculatingHarvest, setIsCalculatingHarvest] = useState(false);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Initialize
  useEffect(() => {
    fetch("/api/commodities")
      .then(r => r.json())
      .then(json => { if (json.data) setCommodities(json.data); })
      .catch(() => {});

    fetch("/api/states")
      .then(r => r.json())
      .then(json => {
        if (json.data) {
          const map = {};
          Object.keys(json.data).forEach(k => { map[k] = json.data[k].mandis; });
          setStatesMap(map);
        }
      })
      .catch(() => {});

    fetch("/api/mandi-prices")
      .then(r => r.json())
      .then(json => { if (json.data) setMandiPrices(json.data); })
      .catch(() => {});

    fetchHistory();
    fetchAlerts();
    fetchMetrics();

    handleRunPrediction("tomato", "Maharashtra", "Lasalgaon Mandi", 30, "Normal", "Normal Arrival", 100);
  }, []);

  const fetchHistory = () => {
    fetch("/api/history")
      .then(r => r.json())
      .then(json => { if (json.data) setHistoryLogs(json.data); })
      .catch(() => {});
  };

  const fetchAlerts = () => {
    fetch("/api/alerts")
      .then(r => r.json())
      .then(json => { if (json.data) setAlertsList(json.data); })
      .catch(() => {});
  };

  const fetchMetrics = () => {
    fetch("/api/model-metrics")
      .then(r => r.json())
      .then(json => { if (json.data) setModelMetrics(json.data); })
      .catch(() => {});
  };

  // Sync mandis
  useEffect(() => {
    const mandis = statesMap[selectedState] || [];
    if (mandis.length > 0 && !mandis.includes(selectedMandi)) {
      setSelectedMandi(mandis[0]);
    }
  }, [selectedState, statesMap]);

  // Quick Select
  const handleQuickSelect = (commId) => {
    const cleanId = commId.toLowerCase();
    const found = commodities.find(c => c.id === cleanId || cleanId.includes(c.id));
    if (found) {
      setSelectedCommodity(found.id);
      if (found.top_states && found.top_states.length > 0) {
        setSelectedState(found.top_states[0]);
      }
      setActiveTab("predictor");
      window.scrollTo({ top: 480, behavior: 'smooth' });
      handleRunPrediction(found.id, found.top_states[0] || selectedState, null, forecastDays, rainfallCondition, arrivalTrend, fuelIndex);
    }
  };

  // Run ML Prediction
  const handleRunPrediction = async (
    comm = selectedCommodity,
    st = selectedState,
    mandi = selectedMandi,
    days = forecastDays,
    rain = rainfallCondition,
    arrival = arrivalTrend,
    fuel = fuelIndex
  ) => {
    setIsPredicting(true);
    setSaveSuccessMsg("");
    try {
      const payload = {
        commodity: comm,
        state: st,
        market: mandi || `${st} APMC`,
        forecast_days: parseInt(days),
        rainfall_condition: rain,
        supply_arrival_trend: arrival,
        fuel_transport_index: parseFloat(fuel)
      };

      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      setPredictionResult(data);
      renderChart(data);
      fetchHistory(); // refresh history

      if (window.confetti && Math.abs(data.price_change_percentage) >= 5.0) {
        window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.warn("Using fallback local prediction", err);
    } finally {
      setIsPredicting(false);
    }
  };

  // Render Chart
  const renderChart = (data) => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const histLabels = (data.historical_trend || []).map(h => h.date.substring(5));
    const histPrices = (data.historical_trend || []).map(h => h.price);

    const forecastLabels = (data.daily_forecast || []).map(f => f.date.substring(5));
    const forecastPrices = (data.daily_forecast || []).map(f => f.predicted_price);
    const upperBounds = (data.daily_forecast || []).map(f => f.upper_bound);
    const lowerBounds = (data.daily_forecast || []).map(f => f.lower_bound);

    const allLabels = [...histLabels, ...forecastLabels];

    const histDataPoints = [...histPrices, ...Array(forecastLabels.length).fill(null)];
    const forecastDataPoints = [
      ...Array(Math.max(0, histLabels.length - 1)).fill(null),
      histPrices.length > 0 ? histPrices[histPrices.length - 1] : data.current_price,
      ...forecastPrices
    ];
    const upperPoints = [
      ...Array(Math.max(0, histLabels.length - 1)).fill(null),
      histPrices.length > 0 ? histPrices[histPrices.length - 1] : data.current_price,
      ...upperBounds
    ];
    const lowerPoints = [
      ...Array(Math.max(0, histLabels.length - 1)).fill(null),
      histPrices.length > 0 ? histPrices[histPrices.length - 1] : data.current_price,
      ...lowerBounds
    ];

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: allLabels,
        datasets: [
          {
            label: 'Actual Mandi Price (₹/Qtl)',
            data: histDataPoints,
            borderColor: '#0284c7',
            backgroundColor: 'rgba(2, 132, 199, 0.12)',
            borderWidth: 2.5,
            pointRadius: 2,
            tension: 0.3
          },
          {
            label: 'AI Predicted Forecast (₹/Qtl)',
            data: forecastDataPoints,
            borderColor: '#15803d',
            backgroundColor: 'rgba(21, 128, 61, 0.18)',
            borderWidth: 3.5,
            borderDash: [5, 5],
            pointRadius: 3,
            tension: 0.3
          },
          {
            label: '95% Upper Bound',
            data: upperPoints,
            borderColor: 'rgba(245, 158, 11, 0.5)',
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          },
          {
            label: '95% Lower Bound',
            data: lowerPoints,
            borderColor: 'rgba(245, 158, 11, 0.5)',
            borderWidth: 1,
            pointRadius: 0,
            fill: '-1',
            backgroundColor: 'rgba(245, 158, 11, 0.08)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { font: { weight: '700', size: 12 } } },
          tooltip: {
            callbacks: {
              label: (c) => c.raw !== null ? `${c.dataset.label}: ₹${Number(c.raw).toLocaleString()}` : null
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 12 } },
          y: {
            ticks: { callback: (v) => '₹' + Number(v).toLocaleString() }
          }
        }
      }
    });
  };

  // Create Price Alert
  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!newAlert.farmer_name || !newAlert.contact) return;
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAlert)
      });
      if (res.ok) {
        setAlertSuccess("Price alert created in SQLite successfully!");
        fetchAlerts();
        setTimeout(() => setAlertSuccess(""), 4000);
      }
    } catch {}
  };

  // Delete Alert
  const handleDeleteAlert = async (id) => {
    await fetch(`/api/alerts/${id}`, { method: "DELETE" });
    fetchAlerts();
  };

  // Delete History
  const handleDeleteHistory = async (id) => {
    await fetch(`/api/history/${id}`, { method: "DELETE" });
    fetchHistory();
  };

  // Retrain Model
  const handleRetrainModel = async () => {
    setIsRetraining(true);
    try {
      const res = await fetch("/api/retrain", { method: "POST" });
      const json = await res.json();
      if (json.metrics) setModelMetrics(json.metrics);
      if (window.confetti) window.confetti({ particleCount: 60 });
    } finally {
      setIsRetraining(false);
    }
  };

  // Storage ROI
  const handleCalculateStorage = async () => {
    try {
      const res = await fetch(`/api/storage-roi?commodity_id=${storageCrop}&quantity_quintals=${storageQty}&storage_days=${storageDays}&cold_storage_rate_per_month=${storageMonthlyRate}`);
      const data = await res.json();
      setStorageResult(data);
    } catch {}
  };

  // Smart Harvesting Advisory
  const handleCalculateHarvest = async () => {
    setIsCalculatingHarvest(true);
    try {
      const res = await fetch("/api/harvest-advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commodity: harvestCrop,
          maturity_percentage: harvestMaturity,
          soil_moisture_percentage: harvestMoisture,
          weather_forecast: harvestWeather,
          farm_area_acres: harvestAcres
        })
      });
      const data = await res.json();
      setHarvestResult(data);
    } catch {} finally {
      setIsCalculatingHarvest(false);
    }
  };

  // Filter Mandi
  const filteredMandiRows = useMemo(() => {
    return mandiPrices.filter(row => {
      const matchSearch = searchMandi === "" || 
        row.commodity.toLowerCase().includes(searchMandi.toLowerCase()) ||
        row.state.toLowerCase().includes(searchMandi.toLowerCase()) ||
        row.mandi.toLowerCase().includes(searchMandi.toLowerCase());
      const matchCategory = categoryFilter === "All" || row.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [mandiPrices, searchMandi, categoryFilter]);

  return (
    <div>
      {/* Live 3D Mandi Ticker */}
      <LiveTicker tickerItems={mandiPrices} onSelectCommodity={handleQuickSelect} />

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg custom-navbar sticky-top">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2" href="#">
            <div className="navbar-brand-badge">
              <i className="fa-solid fa-wheat-awn"></i>
            </div>
            <div>
              <span className="fw-bolder fs-4 text-dark">Agri<span className="text-success">Price</span> AI</span>
              <span className="badge bg-success text-white ms-2 px-2 py-1" style={{fontSize: '0.7rem'}}>SQLite + ML 3.0</span>
            </div>
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-1">
              <li className="nav-item">
                <a className={`nav-link ${activeTab === 'predictor' ? 'active' : ''}`} href="#predictor" onClick={() => setActiveTab('predictor')}>
                  <i className="fa-solid fa-wand-magic-sparkles me-1 text-success"></i> Predictor
                </a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${activeTab === 'markets' ? 'active' : ''}`} href="#markets" onClick={() => setActiveTab('markets')}>
                  <i className="fa-solid fa-store me-1 text-primary"></i> 60+ Mandis
                </a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} href="#history" onClick={() => { setActiveTab('history'); fetchHistory(); }}>
                  <i className="fa-solid fa-clock-rotate-left me-1 text-warning"></i> History ({historyLogs.length})
                </a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${activeTab === 'alerts' ? 'active' : ''}`} href="#alerts" onClick={() => { setActiveTab('alerts'); fetchAlerts(); }}>
                  <i className="fa-solid fa-bell me-1 text-danger"></i> Price Alerts
                </a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${activeTab === 'diagnostics' ? 'active' : ''}`} href="#diagnostics" onClick={() => { setActiveTab('diagnostics'); fetchMetrics(); }}>
                  <i className="fa-solid fa-microchip me-1 text-info"></i> ML Diagnostics
                </a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${activeTab === 'storage' ? 'active' : ''}`} href="#storage" onClick={() => setActiveTab('storage')}>
                  <i className="fa-solid fa-warehouse me-1 text-secondary"></i> Cold Storage
                </a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${activeTab === 'harvest' ? 'active' : ''}`} href="#harvest" onClick={() => { setActiveTab('harvest'); if (!harvestResult) handleCalculateHarvest(); }}>
                  <i className="fa-solid fa-tractor me-1 text-success"></i> Smart Harvest
                </a>
              </li>
              <li className="nav-item ms-lg-2">
                <a className="btn btn-outline-success btn-sm px-3 rounded-pill fw-bold" href="/api/export/csv?type=history" target="_blank" title="Download SQLite logs as CSV">
                  <i className="fa-solid fa-download me-1"></i> Export CSV
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Image Composition */}
      <section className="hero-section">
        <div className="container position-relative">
          <div className="row align-items-center gy-4">
            <div className="col-lg-7">
              <div className="hero-pill">
                <i className="fa-solid fa-seedling text-warning"></i>
                <span>Smart Agricultural Intelligence & Future Price Prediction</span>
              </div>
              <h1 className="hero-title">
                Market Price Prediction for <span>Agricultural Products</span>
              </h1>
              <p className="hero-subtitle">
                Forecasts future prices of crops and vegetables using historical APMC market data,
                agro-climatic indices, and seasonal trends. Integrated with Machine Learning models and SQLite database persistence.
              </p>
              
              <div className="d-flex flex-wrap gap-3 mt-4">
                <a href="#predictor" className="btn btn-light btn-lg px-4 fw-bolder text-success rounded-pill shadow-lg">
                  <i className="fa-solid fa-chart-line me-2"></i> Forecast Price Now
                </a>
                <a href="#markets" className="btn btn-outline-light btn-lg px-4 rounded-pill fw-semibold">
                  <i className="fa-solid fa-magnifying-glass me-2"></i> Browse 120+ Mandi Quotes
                </a>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="hero-3d-card">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-white-50 pb-2">
                  <span className="fw-bolder text-white">
                    <i className="fa-solid fa-cubes me-2 text-warning"></i>High-Value Commodities
                  </span>
                  <span className="badge bg-success-subtle text-success border border-success-subtle">
                    Live Mandi Feeds
                  </span>
                </div>
                
                {/* 3D Crop Thumbnails with Real Imagery */}
                <div className="row g-2">
                  {[
                    { id: "tomato", name: "Tomato", price: "₹3,150", chg: "+4.2%", img: CROP_IMAGES["tomato"] },
                    { id: "wheat", name: "Wheat", price: "₹2,450", chg: "+2.1%", img: CROP_IMAGES["wheat"] },
                    { id: "onion", name: "Onion", price: "₹2,680", chg: "-1.8%", img: CROP_IMAGES["onion"] },
                    { id: "cotton", name: "Cotton", price: "₹7,250", chg: "+3.5%", img: CROP_IMAGES["cotton"] }
                  ].map((c, i) => (
                    <div key={i} className="col-6">
                      <div 
                        className="p-2 rounded-3 d-flex align-items-center gap-2 bg-white bg-opacity-10 border border-white border-opacity-20 cursor-pointer"
                        style={{cursor: 'pointer'}}
                        onClick={() => handleQuickSelect(c.id)}
                      >
                        <img src={c.img} alt={c.name} className="hero-crop-thumb" />
                        <div>
                          <div className="fw-bold text-white small">{c.name}</div>
                          <div className="text-warning small fw-bold">{c.price}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-top border-white-50 text-center text-white-50 small">
                  <i className="fa-solid fa-database text-warning me-1"></i> 6,840+ SQLite Records • Scikit-Learn Random Forest
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="container my-5">
        
        {/* ================= SECTION: 3D COMMODITY SHOWCASE CAROUSEL ================= */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-bolder text-dark mb-0">
                <i className="fa-solid fa-wheat-awn text-success me-2"></i>Featured Crops & Vegetables
              </h4>
              <span className="text-muted small">Click any real crop card below to instantly generate its 30-day price prediction</span>
            </div>
            <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
              16 Supported Commodities
            </span>
          </div>

          <div className="row g-3">
            {commodities.slice(0, 8).map((crop) => (
              <div key={crop.id} className="col-6 col-md-4 col-lg-3">
                <div 
                  className={`crop-card-3d ${selectedCommodity === crop.id ? 'border-success shadow-lg' : ''}`}
                  onClick={() => handleQuickSelect(crop.id)}
                >
                  <div className="crop-card-img-wrap">
                    <img 
                      src={CROP_IMAGES[crop.id] || CROP_IMAGES["wheat"]} 
                      alt={crop.name} 
                      className="crop-card-img" 
                      loading="lazy"
                    />
                    <div className="crop-badge-overlay">
                      {crop.category}
                    </div>
                  </div>
                  <div className="p-3">
                    <h6 className="fw-bold text-dark mb-1 text-truncate">{crop.name}</h6>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bolder text-success">₹{crop.base_price.toLocaleString()}/qtl</span>
                      <span className="badge bg-light text-primary border small">Predict <i className="fa-solid fa-arrow-right"></i></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TAB 1: PRICE PREDICTOR ================= */}
        {activeTab === 'predictor' && (
          <section id="predictor" className="mb-5 pt-2 fade-in">
            <div className="row g-4">
              
              {/* Left Column: Form */}
              <div className="col-lg-5">
                <div className="card-3d p-4 h-100">
                  <h4 className="fw-bolder text-dark mb-3 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-sliders text-success"></i>
                    <span>Prediction Parameters</span>
                  </h4>

                  {/* Commodity Select */}
                  <div className="mb-3">
                    <label className="form-label-custom">
                      <i className="fa-solid fa-seedling text-success"></i> Select Crop / Vegetable
                    </label>
                    <select 
                      className="form-select form-select-custom" 
                      value={selectedCommodity}
                      onChange={(e) => setSelectedCommodity(e.target.value)}
                    >
                      {commodities.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
                      ))}
                    </select>
                  </div>

                  {/* State & Mandi */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label-custom">
                        <i className="fa-solid fa-map-location-dot text-primary"></i> State
                      </label>
                      <select 
                        className="form-select form-select-custom" 
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                      >
                        {Object.keys(statesMap).map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-6">
                      <label className="form-label-custom">
                        <i className="fa-solid fa-store text-primary"></i> APMC Mandi
                      </label>
                      <select 
                        className="form-select form-select-custom" 
                        value={selectedMandi}
                        onChange={(e) => setSelectedMandi(e.target.value)}
                      >
                        {(statesMap[selectedState] || []).map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Horizon */}
                  <div className="mb-3">
                    <label className="form-label-custom">
                      <i className="fa-solid fa-calendar-days text-warning"></i> Forecast Horizon
                    </label>
                    <div className="d-flex flex-wrap gap-2">
                      {[7, 15, 30, 60, 90].map(days => (
                        <button
                          key={days}
                          type="button"
                          className={`badge-tag-btn ${forecastDays === days ? 'active' : ''}`}
                          onClick={() => setForecastDays(days)}
                        >
                          {days} Days
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Agro-Climatic Parameters */}
                  <div className="p-3 bg-light rounded-3 mb-4 border">
                    <div className="mb-2">
                      <label className="form-label small fw-bold text-muted">Rainfall & Agro-Climatic Status</label>
                      <select 
                        className="form-select form-select-sm"
                        value={rainfallCondition}
                        onChange={(e) => setRainfallCondition(e.target.value)}
                      >
                        <option value="Normal">Normal Seasonal Precipitation</option>
                        <option value="Deficit (-20%)">Monsoon Deficit / Drought (-20%)</option>
                        <option value="Excess (+25%)">Excess Rainfall / Flooding (+25%)</option>
                      </select>
                    </div>

                    <div className="mb-2">
                      <label className="form-label small fw-bold text-muted">Mandi Supply & Arrival Influx</label>
                      <select 
                        className="form-select form-select-sm"
                        value={arrivalTrend}
                        onChange={(e) => setArrivalTrend(e.target.value)}
                      >
                        <option value="Normal Arrival">Normal Expected Influx</option>
                        <option value="High Arrival (Surplus)">Bumper Harvest / Surplus Influx (-)</option>
                        <option value="Low Arrival (Scarcity)">Tight Supply / Harvest Deficit (+)</option>
                      </select>
                    </div>

                    <div>
                      <div className="d-flex justify-content-between small fw-bold text-muted">
                        <span>Transport & Freight Cost Index</span>
                        <span className="text-primary">{fuelIndex}%</span>
                      </div>
                      <input 
                        type="range" 
                        className="form-range" 
                        min="80" 
                        max="140" 
                        value={fuelIndex}
                        onChange={(e) => setFuelIndex(e.target.value)}
                      />
                    </div>
                  </div>

                  <button 
                    type="button" 
                    className="btn btn-primary-custom w-100 py-3"
                    onClick={() => handleRunPrediction()}
                    disabled={isPredicting}
                  >
                    {isPredicting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Running Machine Learning Forecast...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-chart-line fs-5"></i>
                        <span>Generate ML Price Forecast</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Prediction Output */}
              <div className="col-lg-7">
                {predictionResult ? (
                  <div className="card-3d p-4 h-100 fade-in">
                    
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                      <div>
                        <h3 className="fw-bolder mb-1 text-dark">{predictionResult.commodity}</h3>
                        <div className="text-muted small">
                          <i className="fa-solid fa-location-dot text-danger me-1"></i>
                          {predictionResult.market}, {predictionResult.state} • <strong>{predictionResult.forecast_days} Days Forecast</strong>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`trend-badge-large ${
                          predictionResult.price_change_percentage >= 3 ? 'bullish' : 
                          (predictionResult.price_change_percentage <= -3 ? 'bearish' : 'stable')
                        }`}>
                          <i className={`fa-solid ${
                            predictionResult.price_change_percentage >= 3 ? 'fa-arrow-trend-up' : 
                            (predictionResult.price_change_percentage <= -3 ? 'fa-arrow-trend-down' : 'fa-arrows-left-right')
                          }`}></i>
                          {predictionResult.trend_direction}
                        </span>
                        <button 
                          className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                          onClick={() => window.print()}
                          title="Print or Save Official Market Advisory as PDF"
                        >
                          <i className="fa-solid fa-print me-1"></i> Print / PDF
                        </button>
                      </div>
                    </div>

                    {/* Price Cards */}
                    <div className="row g-3 mb-4">
                      <div className="col-6">
                        <div className="price-display-box">
                          <div className="small text-muted fw-bold">CURRENT PRICE</div>
                          <div className="price-large">
                            ₹{Math.round(predictionResult.current_price).toLocaleString()}
                            <span className="fs-6 text-muted fw-normal"> /qtl</span>
                          </div>
                          <span className="small text-muted">₹{predictionResult.current_price_per_kg}/kg wholesale</span>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="price-display-box border-success" style={{background: '#f0fdf4'}}>
                          <div className="small text-success fw-bold">PREDICTED PRICE</div>
                          <div className="price-large text-success">
                            ₹{Math.round(predictionResult.predicted_price).toLocaleString()}
                            <span className="fs-6 text-success fw-normal"> /qtl</span>
                          </div>
                          <span className={`badge ${predictionResult.price_change >= 0 ? 'bg-success' : 'bg-danger'}`}>
                            {predictionResult.price_change >= 0 ? '+' : ''}{predictionResult.price_change_percentage}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Chart.js Time-Series Curve */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-dark"><i className="fa-solid fa-chart-area text-primary me-2"></i>Time-Series Forecast Curve</span>
                        <span className="badge bg-light text-dark border">95% Confidence Band</span>
                      </div>
                      <div style={{height: '260px', position: 'relative'}}>
                        <canvas ref={chartRef}></canvas>
                      </div>
                    </div>

                    {/* Advisory */}
                    <div className="advisory-box mb-4">
                      <h6 className="fw-bold text-dark mb-1">
                        <i className="fa-solid fa-lightbulb text-warning me-2"></i>Farmer & Trader Advisory
                      </h6>
                      <p className="mb-0 text-dark small leading-relaxed">
                        {predictionResult.advisory}
                      </p>
                    </div>

                    {/* Factors */}
                    <div>
                      <h6 className="fw-bold text-dark mb-2">Forecasting Attribution Factors</h6>
                      <div className="row g-2">
                        {predictionResult.factors.map((f, i) => (
                          <div key={i} className="col-6">
                            <div className="p-2 border rounded-3 bg-light">
                              <div className="d-flex justify-content-between small fw-bold">
                                <span>{f.name}</span>
                                <span className={f.direction === 'Positive' ? 'text-success' : 'text-danger'}>
                                  {f.impact_percentage > 0 ? '+' : ''}{f.impact_percentage}%
                                </span>
                              </div>
                              <div className="small text-muted" style={{fontSize: '0.75rem'}}>{f.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="card-3d p-5 text-center text-muted h-100 d-flex flex-column justify-content-center">
                    <i className="fa-solid fa-chart-line fa-3x text-secondary opacity-50 mb-3"></i>
                    <h5>Loading ML Models...</h5>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 2: MANDI BENCHMARK EXPLORER ================= */}
        {activeTab === 'markets' && (
          <section id="markets" className="mb-5 pt-2 fade-in">
            <div className="card-3d p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4 className="fw-bold text-dark mb-0">
                    <i className="fa-solid fa-shop text-primary me-2"></i>
                    60+ Mandis Live Benchmark Explorer
                  </h4>
                  <span className="text-muted small">Real-time auction records across 12 major agricultural states</span>
                </div>
                <a href="/api/export/csv?type=mandi" className="btn btn-sm btn-outline-success rounded-pill px-3">
                  <i className="fa-solid fa-file-csv me-1"></i> Export Mandi CSV
                </a>
              </div>

              {/* Filters */}
              <div className="row g-3 mb-4">
                <div className="col-md-5">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search by crop, mandi, or state..."
                    value={searchMandi}
                    onChange={(e) => setSearchMandi(e.target.value)}
                  />
                </div>
                <div className="col-md-7 d-flex flex-wrap gap-1 justify-content-md-end">
                  {["All", "Vegetables", "Cereals & Grains", "Pulses", "Commercial & Cash Crops", "Fruits"].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      className={`btn btn-sm ${categoryFilter === cat ? 'btn-success' : 'btn-outline-secondary'} rounded-pill`}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Commodity</th>
                      <th>Category</th>
                      <th>Mandi & State</th>
                      <th>Modal Price</th>
                      <th>Retail Eqv.</th>
                      <th>24h Change</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMandiRows.slice(0, 18).map((row, idx) => (
                      <tr key={idx}>
                        <td className="fw-bold text-dark">
                          {row.commodity}
                        </td>
                        <td><span className="badge bg-light text-secondary border">{row.category}</span></td>
                        <td>
                          <div className="fw-bold text-dark">{row.mandi}</div>
                          <div className="small text-muted">{row.state}</div>
                        </td>
                        <td className="fw-bolder text-dark fs-6">₹{Math.round(row.modal_price).toLocaleString()}/qtl</td>
                        <td className="fw-semibold text-secondary">₹{row.price_per_kg}/kg</td>
                        <td>
                          <span className={`badge ${row.price_change_24h >= 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                            {row.price_change_24h >= 0 ? '+' : ''}{row.price_change_24h}%
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-success rounded-pill px-3"
                            onClick={() => handleQuickSelect(row.commodity_id || row.commodity)}
                          >
                            Forecast <i className="fa-solid fa-arrow-right ms-1"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 3: PREDICTION HISTORY (SQLite DB) ================= */}
        {activeTab === 'history' && (
          <section id="history" className="mb-5 pt-2 fade-in">
            <div className="card-3d p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4 className="fw-bold text-dark mb-0">
                    <i className="fa-solid fa-database text-warning me-2"></i>
                    SQLite Prediction History ({historyLogs.length} Records)
                  </h4>
                  <span className="text-muted small">Every forecast is permanently logged in the SQLite backend database</span>
                </div>
                <div className="d-flex gap-2">
                  <a href="/api/export/csv?type=history" className="btn btn-sm btn-outline-success rounded-pill px-3">
                    <i className="fa-solid fa-file-csv me-1"></i> Download History CSV
                  </a>
                  <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={fetchHistory}>
                    <i className="fa-solid fa-rotate me-1"></i> Refresh
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Commodity</th>
                      <th>Mandi / State</th>
                      <th>Horizon</th>
                      <th>Current</th>
                      <th>Forecast</th>
                      <th>Change</th>
                      <th>Confidence</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="text-muted small">#{log.id}</td>
                        <td className="small">{log.created_at}</td>
                        <td className="fw-bold text-dark">{log.commodity}</td>
                        <td className="small">{log.market}, {log.state}</td>
                        <td className="small">{log.forecast_days}d</td>
                        <td>₹{Math.round(log.current_price).toLocaleString()}</td>
                        <td className="fw-bold text-success">₹{Math.round(log.predicted_price).toLocaleString()}</td>
                        <td>
                          <span className={`badge ${log.price_change_pct >= 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                            {log.price_change_pct >= 0 ? '+' : ''}{log.price_change_pct}%
                          </span>
                        </td>
                        <td>{log.confidence_score}%</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-danger py-0 px-2 rounded-pill"
                            onClick={() => handleDeleteHistory(log.id)}
                            title="Delete log"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {historyLogs.length === 0 && (
                      <tr><td colSpan="10" className="text-center py-4 text-muted">No prediction logs in database yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 4: PRICE ALERTS ================= */}
        {activeTab === 'alerts' && (
          <section id="alerts" className="mb-5 pt-2 fade-in">
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="card-3d p-4">
                  <h4 className="fw-bold text-dark mb-3">
                    <i className="fa-solid fa-bell text-danger me-2"></i>Create Farmer Price Alert
                  </h4>
                  <form onSubmit={handleCreateAlert}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Farmer Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        placeholder="e.g. Ramesh Kumar"
                        value={newAlert.farmer_name}
                        onChange={(e) => setNewAlert({...newAlert, farmer_name: e.target.value})}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Phone Number or Email</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        placeholder="+91-98765-XXXXX or email"
                        value={newAlert.contact}
                        onChange={(e) => setNewAlert({...newAlert, contact: e.target.value})}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Commodity</label>
                      <select 
                        className="form-select"
                        value={newAlert.commodity}
                        onChange={(e) => setNewAlert({...newAlert, commodity: e.target.value})}
                      >
                        {commodities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-bold">Condition</label>
                        <select 
                          className="form-select"
                          value={newAlert.condition}
                          onChange={(e) => setNewAlert({...newAlert, condition: e.target.value})}
                        >
                          <option value="ABOVE">Price Goes ABOVE</option>
                          <option value="BELOW">Price Drops BELOW</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold">Target Price (₹/Qtl)</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          required 
                          value={newAlert.target_price}
                          onChange={(e) => setNewAlert({...newAlert, target_price: Number(e.target.value)})}
                        />
                      </div>
                    </div>

                    {alertSuccess && <div className="alert alert-success py-2 small">{alertSuccess}</div>}

                    <button type="submit" className="btn btn-danger w-100 py-2 fw-bold rounded-3">
                      <i className="fa-solid fa-plus me-1"></i> Register Alert in SQLite
                    </button>
                  </form>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="card-3d p-4 h-100">
                  <h4 className="fw-bold text-dark mb-3">Active Registered Price Alerts</h4>
                  <div className="table-responsive">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Farmer</th>
                          <th>Crop</th>
                          <th>Target Price</th>
                          <th>Condition</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alertsList.map(a => (
                          <tr key={a.id}>
                            <td>
                              <div className="fw-bold text-dark">{a.farmer_name}</div>
                              <div className="small text-muted">{a.contact}</div>
                            </td>
                            <td>{a.commodity}</td>
                            <td className="fw-bold text-success">₹{a.target_price.toLocaleString()}/qtl</td>
                            <td>
                              <span className={`badge ${a.condition === 'ABOVE' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                {a.condition}
                              </span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-danger py-0 px-2 rounded-pill" onClick={() => handleDeleteAlert(a.id)}>
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 5: ML MODEL DIAGNOSTICS ================= */}
        {activeTab === 'diagnostics' && (
          <section id="diagnostics" className="mb-5 pt-2 fade-in">
            <div className="card-3d p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold text-dark mb-0">
                    <i className="fa-solid fa-brain text-info me-2"></i>Machine Learning Model Diagnostics
                  </h4>
                  <span className="text-muted small">Real-time Scikit-Learn regression validation scores</span>
                </div>
                <button 
                  className="btn btn-primary rounded-pill px-4 fw-bold"
                  onClick={handleRetrainModel}
                  disabled={isRetraining}
                >
                  {isRetraining ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Re-training...</>
                  ) : (
                    <><i className="fa-solid fa-arrows-rotate me-1"></i> Re-train ML Model</>
                  )}
                </button>
              </div>

              {modelMetrics && (
                <div className="row g-3 mb-4 text-center">
                  <div className="col-md-3">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="small text-muted d-block fw-bold">R² COEFFICIENT</span>
                      <strong className="fs-3 text-success">{(modelMetrics.r2_score * 100).toFixed(1)}%</strong>
                      <span className="small text-muted d-block">Accuracy Score</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="small text-muted d-block fw-bold">RMSE ERROR</span>
                      <strong className="fs-3 text-primary">₹{modelMetrics.rmse}</strong>
                      <span className="small text-muted d-block">Root Mean Sq. Error</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="small text-muted d-block fw-bold">MAE ERROR</span>
                      <strong className="fs-3 text-dark">₹{modelMetrics.mae}</strong>
                      <span className="small text-muted d-block">Mean Absolute Error</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="small text-muted d-block fw-bold">TRAINING SAMPLES</span>
                      <strong className="fs-3 text-warning">{modelMetrics.training_samples}</strong>
                      <span className="small text-muted d-block">Historical Data Points</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 border rounded-3 bg-white">
                <h6 className="fw-bold text-dark mb-2">Features Extracted by Pipeline:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {(modelMetrics?.features || []).map((f, i) => (
                    <span key={i} className="badge bg-light text-dark border p-2">
                      <i className="fa-solid fa-code me-1 text-primary"></i>{f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 6: STORAGE ROI ================= */}
        {activeTab === 'storage' && (
          <section id="storage" className="mb-5 pt-2 fade-in">
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="card-3d p-4 h-100">
                  <h4 className="fw-bold text-dark mb-3">
                    <i className="fa-solid fa-warehouse text-warning me-2"></i>Cold Storage Simulator
                  </h4>
                  
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Crop</label>
                    <select className="form-select" value={storageCrop} onChange={(e) => setStorageCrop(e.target.value)}>
                      <option value="onion">Onion (Pyaz)</option>
                      <option value="potato">Potato (Aloo)</option>
                      <option value="garlic">Garlic (Lahsun)</option>
                      <option value="wheat">Wheat (Grain Silo)</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between small fw-bold">
                      <span>Harvest Quantity</span>
                      <span className="text-primary">{storageQty} Quintals</span>
                    </div>
                    <input type="range" className="form-range" min="20" max="800" step="10" value={storageQty} onChange={(e) => setStorageQty(Number(e.target.value))} />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between small fw-bold">
                      <span>Holding Duration</span>
                      <span className="text-primary">{storageDays} Days</span>
                    </div>
                    <input type="range" className="form-range" min="15" max="90" step="5" value={storageDays} onChange={(e) => setStorageDays(Number(e.target.value))} />
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between small fw-bold">
                      <span>Storage Rent (₹/qtl/month)</span>
                      <span className="text-primary">₹{storageMonthlyRate}</span>
                    </div>
                    <input type="range" className="form-range" min="20" max="80" step="5" value={storageMonthlyRate} onChange={(e) => setStorageMonthlyRate(Number(e.target.value))} />
                  </div>

                  <button className="btn btn-primary w-100 py-2 fw-bold" onClick={handleCalculateStorage}>
                    <i className="fa-solid fa-calculator me-1"></i> Calculate ROI Simulation
                  </button>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="card-3d p-4 h-100">
                  <h4 className="fw-bold text-dark mb-3">Storage Profit Verdict</h4>
                  {storageResult ? (
                    <div>
                      <div className={`p-4 rounded-3 mb-4 ${storageResult.recommendation === 'STORE' ? 'bg-success-subtle border border-success' : 'bg-warning-subtle border border-warning'}`}>
                        <div className="small fw-bold text-uppercase">STRATEGY VERDICT</div>
                        <h5 className="fw-bolder mb-1 text-dark">
                          Net Gain/Loss: {storageResult.net_gain_or_loss >= 0 ? '+' : ''}₹{Math.abs(storageResult.net_gain_or_loss).toLocaleString()}
                          <span className="fs-6 fw-normal ms-2">({storageResult.roi_percentage > 0 ? '+' : ''}{storageResult.roi_percentage}%)</span>
                        </h5>
                        <p className="small mb-0 text-dark">{storageResult.advice_summary}</p>
                      </div>

                      <div className="row g-2 text-center">
                        <div className="col-4 p-2 bg-light rounded-3 border">
                          <span className="small text-muted d-block">Sell Today</span>
                          <strong className="text-dark">₹{storageResult.immediate_revenue.toLocaleString()}</strong>
                        </div>
                        <div className="col-4 p-2 bg-light rounded-3 border">
                          <span className="small text-muted d-block">Storage Cost</span>
                          <strong className="text-danger">-₹{storageResult.storage_cost.toLocaleString()}</strong>
                        </div>
                        <div className="col-4 p-2 bg-light rounded-3 border">
                          <span className="small text-muted d-block">Net Future</span>
                          <strong className="text-success">₹{storageResult.net_future_revenue.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <p>Adjust inputs on the left and click Calculate ROI Simulation.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 7: SMART HARVESTING & SENSORS ================= */}
        {activeTab === 'harvest' && (
          <section id="harvest" className="mb-5 pt-2 fade-in">
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="card-3d p-4 h-100">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="badge bg-success p-2 rounded-3 text-white">
                      <i className="fa-solid fa-tractor fs-5"></i>
                    </div>
                    <div>
                      <h4 className="fw-bolder text-dark mb-0">Smart Harvesting Advisory</h4>
                      <span className="text-muted small">ML + Real-time Soil & Climate Sensors</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Target Crop</label>
                    <select className="form-select" value={harvestCrop} onChange={(e) => setHarvestCrop(e.target.value)}>
                      <option value="tomato">Tomato (Perishable)</option>
                      <option value="wheat">Wheat (Grain Maturity)</option>
                      <option value="onion">Onion (Bulb Hardiness)</option>
                      <option value="potato">Potato (Tuber Skin Set)</option>
                      <option value="cotton">Cotton (Boll Opening)</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between small fw-bold">
                      <span>Crop Maturity / Brix Index</span>
                      <span className="text-success">{harvestMaturity}%</span>
                    </div>
                    <input type="range" className="form-range" min="50" max="100" value={harvestMaturity} onChange={(e) => setHarvestMaturity(Number(e.target.value))} />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between small fw-bold">
                      <span>Soil Moisture Sensor</span>
                      <span className="text-primary">{harvestMoisture}%</span>
                    </div>
                    <input type="range" className="form-range" min="10" max="50" value={harvestMoisture} onChange={(e) => setHarvestMoisture(Number(e.target.value))} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">48-Hour Weather Forecast Radar</label>
                    <select className="form-select" value={harvestWeather} onChange={(e) => setHarvestWeather(e.target.value)}>
                      <option value="Clear Sky">Clear Sky / Dry Sunny Spell</option>
                      <option value="Approaching Rain in 48h">Approaching Rain / Thunderstorm in 48h</option>
                      <option value="High Humidity">High Humidity / Morning Dew Risk</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between small fw-bold">
                      <span>Farm Area (Acres)</span>
                      <span className="text-dark">{harvestAcres} Acres</span>
                    </div>
                    <input type="range" className="form-range" min="0.5" max="25" step="0.5" value={harvestAcres} onChange={(e) => setHarvestAcres(Number(e.target.value))} />
                  </div>

                  <button className="btn btn-success w-100 py-3 fw-bold rounded-3 shadow-sm" onClick={handleCalculateHarvest} disabled={isCalculatingHarvest}>
                    {isCalculatingHarvest ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Computing...</>
                    ) : (
                      <><i className="fa-solid fa-wheat-awn me-2"></i>Compute Optimal Harvest Timing</>
                    )}
                  </button>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="card-3d p-4 h-100">
                  <h4 className="fw-bolder text-dark mb-3">AI Sensor Harvesting Recommendation</h4>
                  {harvestResult ? (
                    <div>
                      <div className={`p-4 rounded-3 mb-4 bg-${harvestResult.badge_color}-subtle border border-${harvestResult.badge_color}`}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="small fw-bold text-uppercase">HARVEST VERDICT</span>
                          <span className={`badge bg-${harvestResult.badge_color} text-white px-3 py-1 rounded-pill`}>
                            {harvestResult.status_badge}
                          </span>
                        </div>
                        <h4 className="fw-bolder text-dark mb-2">{harvestResult.decision}</h4>
                        <p className="small mb-0 text-dark opacity-90 leading-relaxed">{harvestResult.rationale}</p>
                      </div>

                      <div className="row g-2 text-center mb-3">
                        <div className="col-4 p-2 bg-light rounded-3 border">
                          <span className="small text-muted d-block">Est. Farm Output</span>
                          <strong className="text-dark">{harvestResult.total_estimated_yield_qtl} Qtl</strong>
                        </div>
                        <div className="col-4 p-2 bg-light rounded-3 border">
                          <span className="small text-muted d-block">Current Mandi Rate</span>
                          <strong className="text-primary">₹{Math.round(harvestResult.current_market_price).toLocaleString()}</strong>
                        </div>
                        <div className="col-4 p-2 bg-light rounded-3 border">
                          <span className="small text-muted d-block">Gross Harvest Value</span>
                          <strong className="text-success">₹{Math.round(harvestResult.estimated_harvest_revenue).toLocaleString()}</strong>
                        </div>
                      </div>

                      <div className="p-3 border rounded-3 bg-white">
                        <div className="small fw-bold text-dark mb-2">Live Sensor Telemetry Reading:</div>
                        <ul className="small text-muted mb-0 ps-3">
                          <li>Soil Moisture: <strong>{harvestResult.sensor_telemetry.soil_moisture}</strong></li>
                          <li>Crop Maturity: <strong>{harvestResult.sensor_telemetry.crop_maturity}</strong></li>
                          <li>Weather Risk: <strong>{harvestResult.sensor_telemetry.weather_risk}</strong></li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <i className="fa-solid fa-satellite-dish fa-3x mb-3 text-secondary opacity-50"></i>
                      <h5>Awaiting Sensor Inputs</h5>
                      <p className="small">Set your crop maturity index and weather forecast to get real-time harvesting timing advice.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="custom-footer">
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-lg-5">
              <h5 className="fw-bold text-white mb-2">
                <i className="fa-solid fa-wheat-awn text-success me-2"></i>AgriPrice AI
              </h5>
              <p className="small text-white-50 pe-lg-4">
                Market Price Prediction for Agricultural Products using Scikit-Learn Random Forest,
                time-series seasonal harmonic models, SQLite database persistence, and FastAPI REST endpoints.
              </p>
            </div>
            <div className="col-lg-3 col-6">
              <h6 className="text-white fw-bold mb-3">Core Modules</h6>
              <ul className="list-unstyled small">
                <li className="mb-2"><a href="#predictor" onClick={() => setActiveTab('predictor')} className="text-white-50 text-decoration-none">Price Predictor</a></li>
                <li className="mb-2"><a href="#markets" onClick={() => setActiveTab('markets')} className="text-white-50 text-decoration-none">60+ Mandis Explorer</a></li>
                <li className="mb-2"><a href="#history" onClick={() => setActiveTab('history')} className="text-white-50 text-decoration-none">SQLite History</a></li>
                <li className="mb-2"><a href="#alerts" onClick={() => setActiveTab('alerts')} className="text-white-50 text-decoration-none">Price Alerts</a></li>
              </ul>
            </div>
            <div className="col-lg-4 col-6">
              <h6 className="text-white fw-bold mb-3">Backend Architecture</h6>
              <ul className="list-unstyled small text-white-50">
                <li className="mb-1"><i className="fa-solid fa-check text-success me-2"></i>SQLite with 6,840+ records</li>
                <li className="mb-1"><i className="fa-solid fa-check text-success me-2"></i>Scikit-Learn ML Models (.joblib)</li>
                <li className="mb-1"><i className="fa-solid fa-check text-success me-2"></i>FastAPI 0.162 High-Speed REST API</li>
                <li className="mb-1"><i className="fa-solid fa-check text-success me-2"></i>React 18 + Bootstrap 5.3 + Chart.js</li>
              </ul>
            </div>
          </div>
          <div className="pt-3 border-top border-secondary text-center small text-white-50">
            Market Price Prediction for Agricultural Products • Built with HTML5, CSS3, Bootstrap, JS & React.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Mount React
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
