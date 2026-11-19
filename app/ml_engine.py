"""
Market Price Prediction for Agricultural Products
Machine Learning & Time-Series Forecasting Engine
"""

import math
import random
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import Ridge

from app.data_generator import (
    COMMODITIES_CATALOG,
    STATE_PRICE_MODIFIERS,
    get_commodity_by_id_or_name,
    generate_historical_prices
)
from app.models import (
    PredictionRequest,
    PredictionResponse,
    DailyForecastPoint,
    HistoricalPoint,
    FactorImpact
)

class AgriculturalPricePredictor:
    def __init__(self):
        self.cached_models = {}

    def _prepare_training_data(self, history_data, commodity_meta):
        """
        Creates feature matrices with cyclical calendar features, lag values,
        and rolling statistical moments.
        """
        df = pd.DataFrame(history_data)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date').reset_index(drop=True)

        df['day_of_year'] = df['date'].dt.dayofyear
        df['sin_doy'] = np.sin(2 * np.pi * df['day_of_year'] / 365.25)
        df['cos_doy'] = np.cos(2 * np.pi * df['day_of_year'] / 365.25)
        df['month'] = df['date'].dt.month
        df['day_of_week'] = df['date'].dt.dayofweek

        # Lags
        df['lag_1'] = df['price'].shift(1)
        df['lag_3'] = df['price'].shift(3)
        df['lag_7'] = df['price'].shift(7)
        df['lag_14'] = df['price'].shift(14)
        df['rolling_mean_7'] = df['price'].shift(1).rolling(window=7, min_periods=1).mean()
        df['rolling_mean_14'] = df['price'].shift(1).rolling(window=14, min_periods=1).mean()
        df['rolling_std_14'] = df['price'].shift(1).rolling(window=14, min_periods=1).std().fillna(0)

        # Volume feature
        df['vol_norm'] = df['volume_quintals'] / df['volume_quintals'].mean()

        # Drop warm-up rows
        clean_df = df.dropna().reset_index(drop=True)
        
        feature_cols = [
            'sin_doy', 'cos_doy', 'month', 'day_of_week',
            'lag_1', 'lag_3', 'lag_7', 'lag_14',
            'rolling_mean_7', 'rolling_mean_14', 'vol_norm'
        ]
        
        X = clean_df[feature_cols].values
        y = clean_df['price'].values
        
        return X, y, clean_df, feature_cols

    def predict(self, req: PredictionRequest) -> PredictionResponse:
        commodity_meta = get_commodity_by_id_or_name(req.commodity)
        state = req.state or "Punjab"
        market = req.market or f"{state} Primary Mandi"
        forecast_days = max(1, min(180, req.forecast_days))

        # 1. Generate past 180 days historical mandi data
        history = generate_historical_prices(commodity_meta, state, days=180)
        recent_prices = [h["price"] for h in history]
        current_price = recent_prices[-1]

        # 2. Machine Learning Model Training (Random Forest + Ridge Ensemble)
        X, y, clean_df, feature_cols = self._prepare_training_data(history, commodity_meta)
        
        rf_model = RandomForestRegressor(n_estimators=45, max_depth=6, random_state=42)
        rf_model.fit(X, y)

        ridge_model = Ridge(alpha=1.0)
        ridge_model.fit(X, y)

        # 3. Factor Adjustments from user request
        # Weather / Rainfall
        rain_mult = 1.0
        rain_desc = "Normal monsoon patterns support typical price stability."
        if "Deficit" in (req.rainfall_condition or ""):
            # Perishables spike more on drought/deficit
            boost = 0.08 if commodity_meta["category"] == "Vegetables" else 0.05
            rain_mult = 1.0 + boost
            rain_desc = "Rainfall deficit reduces expected crop yield, driving upward price pressure."
        elif "Excess" in (req.rainfall_condition or ""):
            # Perishables get damaged by excess rain; grains get good moisture
            if commodity_meta["category"] == "Vegetables":
                rain_mult = 1.07
                rain_desc = "Excess rainfall risks crop spoilage and logistic transit bottlenecks."
            else:
                rain_mult = 0.96
                rain_desc = "Abundant moisture enhances crop output, moderating future price spikes."

        # Transport & Fuel
        fuel_index = req.fuel_transport_index or 100.0
        transport_mult = 1.0 + ((fuel_index - 100.0) / 100.0) * 0.07
        transport_desc = f"Transport freight index at {fuel_index:.1f}% adjusts freight & interstate mandi margins."

        # Arrival Trend
        arrival_mult = 1.0
        arrival_desc = "Balanced mandi arrivals matched with steady wholesale consumption."
        if "Surplus" in (req.supply_arrival_trend or "") or "High" in (req.supply_arrival_trend or ""):
            arrival_mult = 0.93
            arrival_desc = "Heavy harvest arrivals expected to create short-term market glut."
        elif "Scarcity" in (req.supply_arrival_trend or "") or "Low" in (req.supply_arrival_trend or ""):
            arrival_mult = 1.09
            arrival_desc = "Tight supply and reduced farmgate arrivals forecast to elevate bid prices."

        combined_external_mult = rain_mult * transport_mult * arrival_mult

        # 4. Multi-step recursive forecasting with seasonality harmonics
        daily_forecasts = []
        last_date = datetime.strptime(history[-1]["date"], "%Y-%m-%d")
        
        # Buffer for lag tracking
        running_prices = list(recent_prices[-30:])
        running_vols = [h["volume_quintals"] for h in history[-30:]]
        avg_vol = np.mean(running_vols)

        base_volatility = commodity_meta["volatility"]
        peak_month = commodity_meta["peak_month"]
        dip_month = commodity_meta["dip_month"]

        for day in range(1, forecast_days + 1):
            target_date = last_date + timedelta(days=day)
            doy = target_date.timetuple().tm_yday
            month = target_date.month
            dow = target_date.weekday()

            sin_d = math.sin(2 * math.pi * doy / 365.25)
            cos_d = math.cos(2 * math.pi * doy / 365.25)

            # Seasonal harmonic cycle
            season_phase = (month - dip_month) / 12.0 * 2.0 * math.pi
            season_harmonic = 1.0 + (base_volatility * 1.3 * math.sin(season_phase))

            # Lag features
            lag_1 = running_prices[-1]
            lag_3 = running_prices[-3] if len(running_prices) >= 3 else lag_1
            lag_7 = running_prices[-7] if len(running_prices) >= 7 else lag_1
            lag_14 = running_prices[-14] if len(running_prices) >= 14 else lag_1
            rm_7 = np.mean(running_prices[-7:])
            rm_14 = np.mean(running_prices[-14:])
            vol_norm = 1.0

            cur_features = np.array([[
                sin_d, cos_d, month, dow,
                lag_1, lag_3, lag_7, lag_14,
                rm_7, rm_14, vol_norm
            ]])

            rf_pred = float(rf_model.predict(cur_features)[0])
            ridge_pred = float(ridge_model.predict(cur_features)[0])

            # Ensemble blend
            ensemble_pred = 0.65 * rf_pred + 0.35 * ridge_pred
            
            # Apply seasonal harmonic and external adjustments progressively
            progress_ratio = min(1.0, day / 21.0)
            target_trend_price = (ensemble_pred * 0.7 + (current_price * season_harmonic) * 0.3)
            adjusted_price = target_trend_price * (1.0 + (combined_external_mult - 1.0) * progress_ratio)

            # Smooth slight daily micro-variation
            micro_jitter = (math.sin(day * 0.8) * 0.005)
            final_day_price = round(adjusted_price * (1.0 + micro_jitter), 2)

            # Expanding confidence intervals
            ci_spread = base_volatility * math.sqrt(day / 15.0) * final_day_price * 0.75
            lower_bound = round(max(final_day_price * 0.5, final_day_price - ci_spread), 2)
            upper_bound = round(final_day_price + ci_spread, 2)

            trend_status = "Rising" if final_day_price > current_price * 1.02 else ("Falling" if final_day_price < current_price * 0.98 else "Stable")

            daily_forecasts.append(DailyForecastPoint(
                date=target_date.strftime("%Y-%m-%d"),
                day_number=day,
                predicted_price=final_day_price,
                lower_bound=lower_bound,
                upper_bound=upper_bound,
                trend=trend_status
            ))

            running_prices.append(final_day_price)

        final_predicted_price = daily_forecasts[-1].predicted_price
        price_change = round(final_predicted_price - current_price, 2)
        pct_change = round((price_change / current_price) * 100.0, 2)
        current_kg = round(current_price / 100.0, 2)
        predicted_kg = round(final_predicted_price / 100.0, 2)

        # Confidence calculation
        # Perishables have lower base confidence; long horizons lower confidence
        horizon_penalty = (forecast_days / 180.0) * 12.0
        confidence = round(max(72.0, 95.5 - (base_volatility * 35.0) - horizon_penalty), 1)

        # Direction and Risk
        if pct_change >= 4.0:
            trend_dir = "Bullish (Rising)"
            risk_level = "Medium" if pct_change < 15.0 else "High"
        elif pct_change <= -4.0:
            trend_dir = "Bearish (Falling)"
            risk_level = "High" if commodity_meta["category"] == "Vegetables" else "Medium"
        else:
            trend_dir = "Stable / Sideways"
            risk_level = "Low"

        # Actionable Advisory
        if pct_change >= 8.0:
            advisory = (
                f"Favorable Price Surge Forecasted (+{pct_change}% over {forecast_days} days). "
                f"If you possess dry/cold storage facilities, holding stock until day {max(1, forecast_days - 7)} "
                f"will optimize farmgate returns. Monitor weekly mandi arrival trends."
            )
        elif pct_change <= -6.0:
            advisory = (
                f"Downward Price Correction Forecasted ({pct_change}%). "
                f"Recommended strategy: Liquidate early harvest lots within the next 5-7 days "
                f"to hedge against looming supply influx in {market}."
            )
        else:
            advisory = (
                f"Market Stability Expected with gentle ±{abs(pct_change)}% fluctuations. "
                f"Staggered market releases are advised. Focus on quality grading (Grade A / Premium) "
                f"to capture top mandi auction bids."
            )

        # Factors
        season_impact = round((commodity_meta["base_price"] * (season_harmonic - 1.0) / current_price) * 100.0, 1)
        factors = [
            FactorImpact(
                name="Seasonality & Harvest Cycle",
                impact_percentage=season_impact,
                direction="Positive" if season_impact >= 0 else "Negative",
                description=f"Current position in the {commodity_meta['harvest_season']} cycle."
            ),
            FactorImpact(
                name="Rainfall & Agro-Climatic Factor",
                impact_percentage=round((rain_mult - 1.0) * 100.0, 1),
                direction="Positive" if rain_mult >= 1.0 else "Negative",
                description=rain_desc
            ),
            FactorImpact(
                name="Mandi Arrivals & Supply Shock",
                impact_percentage=round((arrival_mult - 1.0) * 100.0, 1),
                direction="Positive" if arrival_mult >= 1.0 else "Negative",
                description=arrival_desc
            ),
            FactorImpact(
                name="Logistics & Transport Fuel Index",
                impact_percentage=round((transport_mult - 1.0) * 100.0, 1),
                direction="Positive" if transport_mult >= 1.0 else "Negative",
                description=transport_desc
            )
        ]

        historical_points = [
            HistoricalPoint(date=h["date"], price=h["price"], volume_quintals=h["volume_quintals"])
            for h in history[-60:] # Return last 60 days for frontend visualization
        ]

        return PredictionResponse(
            commodity=commodity_meta["name"],
            state=state,
            market=market,
            forecast_days=forecast_days,
            current_price=current_price,
            predicted_price=final_predicted_price,
            current_price_per_kg=current_kg,
            predicted_price_per_kg=predicted_kg,
            price_change=price_change,
            price_change_percentage=pct_change,
            confidence_score=confidence,
            upper_bound=daily_forecasts[-1].upper_bound,
            lower_bound=daily_forecasts[-1].lower_bound,
            trend_direction=trend_dir,
            advisory=advisory,
            risk_level=risk_level,
            model_used="Ensemble Random Forest & Time-Series Harmonic Regressor",
            factors=factors,
            daily_forecast=daily_forecasts,
            historical_trend=historical_points
        )

# Global singleton
predictor = AgriculturalPricePredictor()
