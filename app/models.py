from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PredictionRequest(BaseModel):
    commodity: str = Field(..., description="Crop or vegetable name, e.g. Wheat, Tomato, Onion")
    state: str = Field(..., description="State name, e.g. Punjab, Maharashtra")
    market: Optional[str] = Field(None, description="Specific Mandi/Market name")
    forecast_days: int = Field(30, ge=1, le=180, description="Number of days to forecast into the future")
    rainfall_condition: Optional[str] = Field("Normal", description="Normal, Deficit, or Excess")
    fuel_transport_index: Optional[float] = Field(100.0, ge=50.0, le=200.0, description="Transport cost index (base 100)")
    supply_arrival_trend: Optional[str] = Field("Normal Arrival", description="Normal Arrival, Surplus, or Scarcity")

class DailyForecastPoint(BaseModel):
    date: str
    day_number: int
    predicted_price: float
    lower_bound: float
    upper_bound: float
    trend: str

class HistoricalPoint(BaseModel):
    date: str
    price: float
    volume_quintals: float

class FactorImpact(BaseModel):
    name: str
    impact_percentage: float
    direction: str
    description: str

class PredictionResponse(BaseModel):
    commodity: str
    state: str
    market: str
    forecast_days: int
    current_price: float
    predicted_price: float
    current_price_per_kg: float
    predicted_price_per_kg: float
    price_change: float
    price_change_percentage: float
    confidence_score: float
    upper_bound: float
    lower_bound: float
    trend_direction: str
    advisory: str
    risk_level: str
    model_used: str
    factors: List[FactorImpact]
    daily_forecast: List[DailyForecastPoint]
    historical_trend: List[HistoricalPoint]

class CommodityInfo(BaseModel):
    id: str
    name: str
    category: str
    current_avg_price: float
    unit: str
    icon: str
    top_states: List[str]
    seasonal_peak_month: str
    harvest_season: str

class MandiPriceItem(BaseModel):
    commodity: str
    category: str
    state: str
    mandi: str
    min_price: float
    max_price: float
    modal_price: float
    price_per_kg: float
    price_change_24h: float
    arrival_tons: float
    last_updated: str

# Database DTOs
class PredictionSaveRequest(BaseModel):
    commodity: str
    state: str
    market: str
    forecast_days: int
    current_price: float
    predicted_price: float
    price_change: float
    price_change_pct: float
    confidence_score: float
    trend_direction: str
    risk_level: str
    advisory: str
    model_used: Optional[str] = "Ensemble Random Forest & Time-Series Harmonics"

class PredictionLogResponse(BaseModel):
    id: int
    created_at: str
    commodity: str
    state: str
    market: str
    forecast_days: int
    current_price: float
    predicted_price: float
    price_change_pct: float
    confidence_score: float
    trend_direction: str
    risk_level: str
    advisory: str

class PriceAlertCreate(BaseModel):
    farmer_name: str
    contact: str
    commodity: str
    target_price: float
    condition: str = "ABOVE" # ABOVE or BELOW

class PriceAlertResponse(BaseModel):
    id: int
    created_at: str
    farmer_name: str
    contact: str
    commodity: str
    target_price: float
    condition: str
    is_active: bool

class ModelMetricsResponse(BaseModel):
    r2_score: float
    rmse: float
    mae: float
    mape: float
    training_samples: int
    test_samples: int
    last_trained: str
    features: List[str]
    status: str

class ArbitrageRequest(BaseModel):
    commodity: str = Field("onion", description="Crop id")
    origin_state: str = Field("Maharashtra", description="Source state")
    destination_state: str = Field("Uttar Pradesh", description="Target destination state")
    truck_load_quintals: float = Field(100.0, ge=10.0, le=500.0, description="Truck load in quintals")
    distance_km: float = Field(650.0, ge=50.0, le=3000.0, description="Transit distance in km")
    freight_rate_per_km: float = Field(38.0, ge=15.0, le=100.0, description="Truck freight cost per km")
