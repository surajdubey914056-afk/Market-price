"""
Agricultural Market Price Prediction System
Realistic Indian & Global Agricultural Market Dataset & Analytics Engine
"""

import math
import random
from datetime import datetime, timedelta

COMMODITIES_CATALOG = [
    {
        "id": "wheat",
        "name": "Wheat (Gehu)",
        "category": "Cereals & Grains",
        "unit": "₹/Quintal",
        "base_price": 2450.0,
        "volatility": 0.08,
        "icon": "fa-wheat-awn",
        "harvest_season": "Rabi (March - May)",
        "peak_month": 12, # Winter peak price before harvest
        "dip_month": 4,   # Post harvest arrival glut
        "top_states": ["Punjab", "Haryana", "Madhya Pradesh", "Uttar Pradesh", "Rajasthan"],
        "shelf_life_days": 365,
        "min_support_price": 2275.0,
    },
    {
        "id": "rice_paddy",
        "name": "Paddy / Rice (Chawal)",
        "category": "Cereals & Grains",
        "unit": "₹/Quintal",
        "base_price": 2380.0,
        "volatility": 0.07,
        "icon": "fa-bowl-rice",
        "harvest_season": "Kharif (October - December)",
        "peak_month": 7,  # Monsoon pre-harvest
        "dip_month": 11, # Harvest arrival dip
        "top_states": ["Punjab", "West Bengal", "Uttar Pradesh", "Andhra Pradesh", "Telangana"],
        "shelf_life_days": 365,
        "min_support_price": 2183.0,
    },
    {
        "id": "maize",
        "name": "Maize / Corn (Makka)",
        "category": "Cereals & Grains",
        "unit": "₹/Quintal",
        "base_price": 2120.0,
        "volatility": 0.10,
        "icon": "fa-seedling",
        "harvest_season": "Kharif (September - November)",
        "peak_month": 6,
        "dip_month": 10,
        "top_states": ["Karnataka", "Madhya Pradesh", "Bihar", "Maharashtra", "Telangana"],
        "shelf_life_days": 270,
        "min_support_price": 2090.0,
    },
    {
        "id": "chana",
        "name": "Chickpea / Chana (Gram)",
        "category": "Pulses",
        "unit": "₹/Quintal",
        "base_price": 5850.0,
        "volatility": 0.12,
        "icon": "fa-circle-dot",
        "harvest_season": "Rabi (February - April)",
        "peak_month": 10, # Festive season Diwali spike
        "dip_month": 3,
        "top_states": ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Gujarat", "Uttar Pradesh"],
        "shelf_life_days": 365,
        "min_support_price": 5440.0,
    },
    {
        "id": "arhar_tur",
        "name": "Pigeon Pea / Arhar (Tur Dal)",
        "category": "Pulses",
        "unit": "₹/Quintal",
        "base_price": 9650.0,
        "volatility": 0.15,
        "icon": "fa-stroopwafel",
        "harvest_season": "Kharif (December - February)",
        "peak_month": 8,
        "dip_month": 1,
        "top_states": ["Maharashtra", "Karnataka", "Madhya Pradesh", "Gujarat", "Uttar Pradesh"],
        "shelf_life_days": 365,
        "min_support_price": 7000.0,
    },
    {
        "id": "moong",
        "name": "Moong / Green Gram",
        "category": "Pulses",
        "unit": "₹/Quintal",
        "base_price": 8450.0,
        "volatility": 0.14,
        "icon": "fa-shapes",
        "harvest_season": "Kharif (September - October)",
        "peak_month": 6,
        "dip_month": 10,
        "top_states": ["Rajasthan", "Maharashtra", "Karnataka", "Madhya Pradesh"],
        "shelf_life_days": 365,
        "min_support_price": 8558.0,
    },
    {
        "id": "tomato",
        "name": "Tomato (Tamatar)",
        "category": "Vegetables",
        "unit": "₹/Quintal",
        "base_price": 3150.0,
        "volatility": 0.35, # Highly volatile perishable
        "icon": "fa-apple-whole",
        "harvest_season": "Year-Round (Multiple Flushes)",
        "peak_month": 7,  # Monsoon supply disruption spike
        "dip_month": 2,  # Winter bumper harvest
        "top_states": ["Maharashtra", "Karnataka", "Andhra Pradesh", "Madhya Pradesh", "Gujarat"],
        "shelf_life_days": 14,
        "min_support_price": 0.0,
    },
    {
        "id": "onion",
        "name": "Onion (Pyaz)",
        "category": "Vegetables",
        "unit": "₹/Quintal",
        "base_price": 2680.0,
        "volatility": 0.32,
        "icon": "fa-egg",
        "harvest_season": "Rabi (March-May) & Kharif (Nov-Jan)",
        "peak_month": 10, # Navratri/Diwali pre-kharif spike
        "dip_month": 4,  # Rabi arrival glut
        "top_states": ["Maharashtra", "Madhya Pradesh", "Karnataka", "Gujarat", "Rajasthan"],
        "shelf_life_days": 90,
        "min_support_price": 0.0,
    },
    {
        "id": "potato",
        "name": "Potato (Aloo)",
        "category": "Vegetables",
        "unit": "₹/Quintal",
        "base_price": 1850.0,
        "volatility": 0.18,
        "icon": "fa-lemon",
        "harvest_season": "Rabi (January - March)",
        "peak_month": 11, # Cold storage release end
        "dip_month": 2,  # Fresh harvest glut
        "top_states": ["Uttar Pradesh", "West Bengal", "Bihar", "Gujarat", "Punjab"],
        "shelf_life_days": 180,
        "min_support_price": 0.0,
    },
    {
        "id": "green_chilli",
        "name": "Green Chilli (Hari Mirch)",
        "category": "Vegetables",
        "unit": "₹/Quintal",
        "base_price": 4200.0,
        "volatility": 0.28,
        "icon": "fa-pepper-hot",
        "harvest_season": "Year-Round",
        "peak_month": 8,
        "dip_month": 1,
        "top_states": ["Andhra Pradesh", "Karnataka", "Madhya Pradesh", "Maharashtra"],
        "shelf_life_days": 21,
        "min_support_price": 0.0,
    },
    {
        "id": "garlic",
        "name": "Garlic (Lahsun)",
        "category": "Vegetables",
        "unit": "₹/Quintal",
        "base_price": 11500.0,
        "volatility": 0.25,
        "icon": "fa-cloud",
        "harvest_season": "Rabi (February - April)",
        "peak_month": 12,
        "dip_month": 3,
        "top_states": ["Madhya Pradesh", "Rajasthan", "Gujarat", "Uttar Pradesh"],
        "shelf_life_days": 180,
        "min_support_price": 0.0,
    },
    {
        "id": "cotton",
        "name": "Cotton (Kapas)",
        "category": "Commercial & Cash Crops",
        "unit": "₹/Quintal",
        "base_price": 7250.0,
        "volatility": 0.12,
        "icon": "fa-feather",
        "harvest_season": "Kharif (October - February)",
        "peak_month": 5,
        "dip_month": 11,
        "top_states": ["Gujarat", "Maharashtra", "Telangana", "Andhra Pradesh", "Rajasthan"],
        "shelf_life_days": 365,
        "min_support_price": 7020.0,
    },
    {
        "id": "soybean",
        "name": "Soybean (Yellow)",
        "category": "Commercial & Cash Crops",
        "unit": "₹/Quintal",
        "base_price": 4680.0,
        "volatility": 0.11,
        "icon": "fa-sun",
        "harvest_season": "Kharif (September - November)",
        "peak_month": 5,
        "dip_month": 10,
        "top_states": ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka", "Telangana"],
        "shelf_life_days": 365,
        "min_support_price": 4600.0,
    },
    {
        "id": "mustard",
        "name": "Mustard / Rapeseed (Sarson)",
        "category": "Commercial & Cash Crops",
        "unit": "₹/Quintal",
        "base_price": 5420.0,
        "volatility": 0.10,
        "icon": "fa-burst",
        "harvest_season": "Rabi (February - April)",
        "peak_month": 11,
        "dip_month": 3,
        "top_states": ["Rajasthan", "Haryana", "Madhya Pradesh", "Uttar Pradesh", "West Bengal"],
        "shelf_life_days": 365,
        "min_support_price": 5650.0,
    },
    {
        "id": "apple",
        "name": "Apple (Kashmiri / Kinnaur)",
        "category": "Fruits",
        "unit": "₹/Quintal",
        "base_price": 9800.0,
        "volatility": 0.20,
        "icon": "fa-apple-whole",
        "harvest_season": "August - November",
        "peak_month": 4, # Controlled Atmosphere storage peak
        "dip_month": 9, # Fresh crop arrival
        "top_states": ["Himachal Pradesh", "Jammu and Kashmir", "Uttarakhand", "Punjab"],
        "shelf_life_days": 180,
        "min_support_price": 0.0,
    },
    {
        "id": "banana",
        "name": "Banana (Grand Naine)",
        "category": "Fruits",
        "unit": "₹/Quintal",
        "base_price": 2150.0,
        "volatility": 0.15,
        "icon": "fa-tree",
        "harvest_season": "Year-Round",
        "peak_month": 5, # Summer demand
        "dip_month": 12,
        "top_states": ["Maharashtra", "Tamil Nadu", "Gujarat", "Andhra Pradesh", "Karnataka"],
        "shelf_life_days": 12,
        "min_support_price": 0.0,
    }
]

STATE_MARKET_MAP = {
    "Punjab": ["Khanna Mandi", "Ludhiana APMC", "Jalandhar Grain Market", "Amritsar Mandi", "Kotkapura Market"],
    "Maharashtra": ["Lasalgaon Mandi", "Pune APMC (Gultekdi)", "Vashi Navi Mumbai", "Nashik APMC", "Nagpur Cotton Market"],
    "Uttar Pradesh": ["Azadpur Mandi Hub", "Kanpur Mandi", "Agra Fruit & Veg Market", "Varanasi Mandi", "Meerut APMC"],
    "Madhya Pradesh": ["Indore APMC (Choithram)", "Bhopal Karond Mandi", "Ujjain Grain Market", "Neemuch Mandi", "Mandsaur APMC"],
    "Gujarat": ["Rajkot Marketing Yard", "Gondal Mandi", "Unjha APMC (Jeera/Spices)", "Surat APMC", "Ahmedabad APMC"],
    "Haryana": ["Karnal Grain Market", "Kurukshetra Mandi", "Sirsa Mandi", "Ambala Cantt APMC", "Rohtak Market"],
    "Rajasthan": ["Kota Bhamashah Mandi", "Jaipur Muhana Mandi", "Jodhpur Mandi", "Sri Ganganagar Yard", "Alwar APMC"],
    "Karnataka": ["Yeshwanthpur APMC Bengaluru", "Hubballi Mandi", "Belagavi APMC", "Kolar Tomato Yard", "Mysuru APMC"],
    "Tamil Nadu": ["Koyambedu Wholesale Chennai", "Madurai Mattuthavani", "Coimbatore APMC", "Salem Market", "Tiruchirappalli Mandi"],
    "Andhra Pradesh": ["Guntur Mirchi Yard", "Vijayawada Wholesale Market", "Kurnool APMC", "Rajahmundry Yard", "Tirupati Mandi"],
    "West Bengal": ["Koley Market Kolkata", "Siliguri Wholesale Hub", "Burdwan Rice Hub", "Posta Mandi Kolkata", "Malda APMC"],
    "Telangana": ["Bowenpally Market Yard", "Warangal Grain Market", "Nizamabad Turmeric Market", "Khammam Mandi", "Mahbubnagar APMC"],
}

STATE_PRICE_MODIFIERS = {
    "Punjab": 0.98,
    "Maharashtra": 1.05,
    "Uttar Pradesh": 0.96,
    "Madhya Pradesh": 0.95,
    "Gujarat": 1.02,
    "Haryana": 0.97,
    "Rajasthan": 0.99,
    "Karnataka": 1.06,
    "Tamil Nadu": 1.08,
    "Andhra Pradesh": 1.03,
    "West Bengal": 1.01,
    "Telangana": 1.04,
}

def get_commodity_by_id_or_name(query: str):
    query_lower = query.lower().strip()
    for c in COMMODITIES_CATALOG:
        if c["id"] == query_lower or query_lower in c["name"].lower():
            return c
    return COMMODITIES_CATALOG[0] # Default Wheat

def generate_historical_prices(commodity_data, state, days=180):
    """
    Generates realistic daily historical price data for the past N days.
    Accounts for seasonal trend, weekly oscillations, and market volume.
    """
    history = []
    base = commodity_data["base_price"] * STATE_PRICE_MODIFIERS.get(state, 1.0)
    volatility = commodity_data["volatility"]
    peak_m = commodity_data["peak_month"]
    dip_m = commodity_data["dip_month"]

    today = datetime.now()
    
    # Deterministic seed based on commodity + state
    seed_val = sum(ord(ch) for ch in commodity_data["id"] + state)
    rng = random.Random(seed_val)

    for i in range(days, 0, -1):
        d = today - timedelta(days=i)
        month = d.month
        
        # Seasonal component (sine curve between dip and peak)
        season_phase = (month - dip_m) / 12.0 * 2.0 * math.pi
        seasonal_mult = 1.0 + (volatility * 1.5 * math.sin(season_phase))
        
        # Day of week variation (Mondays have higher arrivals, weekend lower)
        dow = d.weekday()
        dow_mult = 0.985 if dow == 0 else (1.01 if dow in (4, 5) else 1.0)
        
        # Noise
        noise = rng.uniform(-volatility * 0.4, volatility * 0.4)
        
        # Long term slight inflation trend (3% annualized)
        drift = 1.0 - (i / 365.0) * 0.035
        
        price = round(base * seasonal_mult * dow_mult * (1.0 + noise) * drift, 2)
        volume = round(rng.uniform(350, 1800) * (1.2 if dow == 0 else 0.9), 1)
        
        history.append({
            "date": d.strftime("%Y-%m-%d"),
            "price": price,
            "volume_quintals": volume
        })
        
    return history

def get_all_live_mandi_prices():
    """Returns a rich live snapshot of current Mandi prices across all commodities and states."""
    items = []
    rng = random.Random(42) # Consistent snapshot with subtle variations
    today_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    for c in COMMODITIES_CATALOG:
        for state, mandis in STATE_MARKET_MAP.items():
            if state in c["top_states"] or rng.random() > 0.65:
                mandi = rng.choice(mandis)
                base = c["base_price"] * STATE_PRICE_MODIFIERS.get(state, 1.0)
                
                # Current month seasonal factor
                current_month = datetime.now().month
                season_phase = (current_month - c["dip_month"]) / 12.0 * 2.0 * math.pi
                season_factor = 1.0 + (c["volatility"] * 1.2 * math.sin(season_phase))
                
                daily_jitter = rng.uniform(-0.03, 0.04)
                modal = round(base * season_factor * (1.0 + daily_jitter), 2)
                min_p = round(modal * rng.uniform(0.91, 0.95), 2)
                max_p = round(modal * rng.uniform(1.05, 1.10), 2)
                price_kg = round(modal / 100.0, 2)
                chg_24h = round(rng.uniform(-3.5, 4.2), 2)
                arrival = round(rng.uniform(120.0, 2500.0), 1)

                items.append({
                    "commodity": c["name"],
                    "commodity_id": c["id"],
                    "category": c["category"],
                    "state": state,
                    "mandi": mandi,
                    "min_price": min_p,
                    "max_price": max_p,
                    "modal_price": modal,
                    "price_per_kg": price_kg,
                    "price_change_24h": chg_24h,
                    "arrival_tons": arrival,
                    "last_updated": today_str
                })
    return items
