"""
Surveillance Router for Climate-Triangulated Rural Health Surveillance & GIS Map.
Serves 50 rural village coordinates, real-time epidemiological indicators, and outbreak forecasts.
"""

import os
import pandas as pd
from typing import List, Optional
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/surveillance", tags=["surveillance"])

# Cache variables
_cached_villages_df = None
_cached_longitudinal_df = None

def get_datasets():
    global _cached_villages_df, _cached_longitudinal_df
    if _cached_villages_df is None or _cached_longitudinal_df is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        v_path = os.path.join(base_dir, "data", "raw", "villages.csv")
        c_path = os.path.join(base_dir, "data", "processed", "climate_triangulated_health_data.csv")

        if not os.path.exists(v_path) or not os.path.exists(c_path):
            raise FileNotFoundError("Rural health surveillance CSV datasets not found.")

        _cached_villages_df = pd.read_csv(v_path)
        _cached_longitudinal_df = pd.read_csv(c_path)

    return _cached_villages_df, _cached_longitudinal_df

@router.get("/summary")
def get_surveillance_summary():
    """Returns district-wide surveillance metrics and aggregate outbreak threat statistics."""
    try:
        v_df, c_df = get_datasets()
        latest_week = int(c_df["week"].max())
        latest_slice = c_df[c_df["week"] == latest_week].copy()

        # Categorize risk
        def compute_risk(row):
            h = row.get("climate_health_hazard_index", 0)
            m = row.get("forecasted_malaria_cases_2w", 0)
            d = row.get("forecasted_diarrhea_cases_2w", 0)
            if h >= 24 or m >= 7 or d >= 8:
                return "Critical"
            elif h >= 17 or m >= 4 or d >= 5:
                return "High"
            elif h >= 11 or m >= 2 or d >= 3:
                return "Moderate"
            return "Low"

        latest_slice["risk"] = latest_slice.apply(compute_risk, axis=1)

        total_villages = len(v_df)
        total_population = int(v_df["population"].sum())
        crit_count = int((latest_slice["risk"] == "Critical").sum())
        high_count = int((latest_slice["risk"] == "High").sum())
        mod_count = int((latest_slice["risk"] == "Moderate").sum())
        low_count = int((latest_slice["risk"] == "Low").sum())
        stockouts_count = int((latest_slice["drug_stockout_flag"] == 1).sum())

        pred_mal_surge = round(float(latest_slice["forecasted_malaria_cases_2w"].sum()), 1)
        pred_dia_surge = round(float(latest_slice["forecasted_diarrhea_cases_2w"].sum()), 1)
        avg_rainfall = round(float(latest_slice["rainfall_mm"].mean()), 1)
        avg_temp = round(float(latest_slice["temp_mean_c"].mean()), 1)

        return {
            "monitored_villages": total_villages,
            "monitored_blocks": int(v_df["block_name"].nunique()),
            "total_rural_population": total_population,
            "current_surveillance_week": latest_week,
            "critical_outbreak_villages": crit_count,
            "high_risk_villages": high_count,
            "moderate_risk_villages": mod_count,
            "low_risk_villages": low_count,
            "active_drug_stockouts": stockouts_count,
            "district_avg_rainfall_mm": avg_rainfall,
            "district_avg_temp_c": avg_temp,
            "forecasted_district_malaria_surge_2w": pred_mal_surge,
            "forecasted_district_diarrhea_surge_2w": pred_dia_surge
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/villages")
def get_villages_for_map(block: Optional[str] = None, risk: Optional[str] = None):
    """Returns all 50 rural villages with exact GPS coordinates and latest outbreak forecast indicators."""
    try:
        v_df, c_df = get_datasets()
        latest_week = int(c_df["week"].max())
        latest_slice = c_df[c_df["week"] == latest_week].copy()

        def compute_risk(row):
            h = row.get("climate_health_hazard_index", 0)
            m = row.get("forecasted_malaria_cases_2w", 0)
            d = row.get("forecasted_diarrhea_cases_2w", 0)
            if h >= 24 or m >= 7 or d >= 8:
                return "Critical"
            elif h >= 17 or m >= 4 or d >= 5:
                return "High"
            elif h >= 11 or m >= 2 or d >= 3:
                return "Moderate"
            return "Low"

        def recommend_resource(row, risk_tier):
            m = row.get("forecasted_malaria_cases_2w", 0)
            d = row.get("forecasted_diarrhea_cases_2w", 0)
            if risk_tier in ["Critical", "High"] and m > 4.5:
                return "Antimalarial ACT Treatment Kits & RDKs"
            elif risk_tier in ["Critical", "High"] and d > 4.5:
                return "ORS Rehydration Salts & IV Fluids"
            elif float(row.get("waterborne_runoff_risk", 0)) > 2.0 or float(row.get("flood_risk_score", 0)) > 0.35:
                return "Chlorine Water Purification Dispensers"
            elif int(row.get("mo_in_position", 1)) == 0 and risk_tier in ["Critical", "High"]:
                return "Emergency Mobile Van with Medical Officer"
            return "Standard ASHA Community Surveillance"

        results = []
        for _, v_row in v_df.iterrows():
            v_id = v_row["village_id"]
            c_row = latest_slice[latest_slice["village_id"] == v_id]
            if c_row.empty:
                continue
            c_row = c_row.iloc[0]

            risk_tier = compute_risk(c_row)
            resource_rec = recommend_resource(c_row, risk_tier)

            item = {
                "village_id": v_id,
                "village_name": v_row["village_name"],
                "block_name": v_row["block_name"],
                "subcentre_id": v_row["subcentre_id"],
                "parent_phc_id": v_row["parent_phc_id"],
                "latitude": float(v_row["latitude"]),
                "longitude": float(v_row["longitude"]),
                "population": int(v_row["population"]),
                "distance_phc_km": float(v_row["distance_phc_km"]),
                "distance_chc_km": float(v_row["distance_chc_km"]),
                "all_weather_road": int(v_row["all_weather_road"]),
                "tap_water_access_pct": float(v_row["tap_water_access_pct"]),
                "sanitation_access_pct": float(v_row["sanitation_access_pct"]),
                "mo_in_position": int(v_row["mo_in_position"]),
                "anm_present": int(v_row["anm_present"]),
                "asha_workers_count": int(v_row["asha_workers_count"]),
                "cold_chain_functional": int(v_row["cold_chain_functional"]),
                "drug_stockout_flag": int(c_row.get("drug_stockout_flag", 0)),
                "rainfall_mm": round(float(c_row["rainfall_mm"]), 1),
                "temp_mean_c": round(float(c_row["temp_mean_c"]), 1),
                "humidity_pct": round(float(c_row["humidity_pct"]), 1),
                "flood_risk_score": round(float(c_row["flood_risk_score"]), 2),
                "current_malaria_cases": round(float(c_row["reconstructed_malaria_cases"]), 1),
                "current_diarrhea_cases": round(float(c_row["reconstructed_diarrhea_cases"]), 1),
                "forecasted_malaria_2w": round(float(c_row["forecasted_malaria_cases_2w"]), 1),
                "forecasted_diarrhea_2w": round(float(c_row["forecasted_diarrhea_cases_2w"]), 1),
                "climate_health_hazard_index": round(float(c_row["climate_health_hazard_index"]), 1),
                "outbreak_risk_level": risk_tier,
                "recommended_resource": resource_rec
            }

            if block and block.lower() != "all" and item["block_name"].lower() != block.lower():
                continue
            if risk and risk.lower() != "all" and item["outbreak_risk_level"].lower() != risk.lower():
                continue

            results.append(item)

        # Sort with highest risk first
        priority_order = {"Critical": 0, "High": 1, "Moderate": 2, "Low": 3}
        results.sort(key=lambda x: (priority_order.get(x["outbreak_risk_level"], 4), -x["climate_health_hazard_index"]))

        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/villages/{village_id}/trend")
def get_village_timeseries(village_id: str):
    """Returns the historical longitudinal timeseries for a specific village."""
    try:
        _, c_df = get_datasets()
        sub = c_df[c_df["village_id"] == village_id].sort_values("week")
        if sub.empty:
            raise HTTPException(status_code=404, detail="Village not found")

        trend = []
        for _, row in sub.iterrows():
            trend.append({
                "week": int(row["week"]),
                "rainfall_mm": round(float(row["rainfall_mm"]), 1),
                "temp_mean_c": round(float(row["temp_mean_c"]), 1),
                "malaria_cases": round(float(row["reconstructed_malaria_cases"]), 1),
                "diarrhea_cases": round(float(row["reconstructed_diarrhea_cases"]), 1),
                "flood_risk_score": round(float(row["flood_risk_score"]), 2),
                "hazard_index": round(float(row["climate_health_hazard_index"]), 1)
            })

        return {
            "village_id": village_id,
            "total_weeks": len(trend),
            "trend": trend
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
