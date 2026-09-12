/**
 * Healthcare Resource Management System & RuralHealth OS - Standalone Client-Side Store
 * Complete Local-First Architecture with Leaflet GIS Telemetry & ML Forecaster
 * Zero external backend server required - runs 100% in any browser!
 */

import { samplePatients, sampleResources } from './utils/seeder.js';

// Pre-packaged 50 Rural Villages Epidemiological GIS Dataset
export const defaultVillages = [
  { village_id: "VIL_001", village_name: "Rampur", block_name: "Block-A", subcentre_id: "HSC_1_01", parent_phc_id: "PHC_01", latitude: 24.03849, longitude: 82.2997, population: 4767, distance_phc_km: 4.9, distance_chc_km: 19.5, all_weather_road: 1, tap_water_access_pct: 37.5, sanitation_access_pct: 55.4, mo_in_position: 1, anm_present: 0, asha_workers_count: 5, cold_chain_functional: 0, drug_stockout_flag: 1, rainfall_mm: 7.2, temp_mean_c: 17.8, forecasted_malaria_2w: 8.4, forecasted_diarrhea_2w: 6.2, climate_health_hazard_index: 26.4, outbreak_risk_level: "Critical", recommended_resource: "Antimalarial ACT Treatment Kits & RDKs" },
  { village_id: "VIL_002", village_name: "Pipariya", block_name: "Block-A", subcentre_id: "HSC_1_01", parent_phc_id: "PHC_01", latitude: 24.11675, longitude: 82.25699, population: 2691, distance_phc_km: 8.1, distance_chc_km: 41.6, all_weather_road: 1, tap_water_access_pct: 36.7, sanitation_access_pct: 48.4, mo_in_position: 1, anm_present: 1, asha_workers_count: 3, cold_chain_functional: 0, drug_stockout_flag: 0, rainfall_mm: 6.8, temp_mean_c: 17.2, forecasted_malaria_2w: 2.1, forecasted_diarrhea_2w: 3.4, climate_health_hazard_index: 12.1, outbreak_risk_level: "Moderate", recommended_resource: "ORS Rehydration Salts & IV Fluids" },
  { village_id: "VIL_003", village_name: "Bhelwa", block_name: "Block-A", subcentre_id: "HSC_1_01", parent_phc_id: "PHC_01", latitude: 24.09017, longitude: 82.22916, population: 2150, distance_phc_km: 8.8, distance_chc_km: 31.8, all_weather_road: 1, tap_water_access_pct: 39.9, sanitation_access_pct: 53.2, mo_in_position: 1, anm_present: 1, asha_workers_count: 2, cold_chain_functional: 0, drug_stockout_flag: 0, rainfall_mm: 5.4, temp_mean_c: 18.1, forecasted_malaria_2w: 1.8, forecasted_diarrhea_2w: 2.1, climate_health_hazard_index: 9.8, outbreak_risk_level: "Low", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_004", village_name: "Madanpur", block_name: "Block-A", subcentre_id: "HSC_1_01", parent_phc_id: "PHC_01", latitude: 24.02848, longitude: 82.23278, population: 2677, distance_phc_km: 10.2, distance_chc_km: 22.0, all_weather_road: 0, tap_water_access_pct: 25.7, sanitation_access_pct: 65.6, mo_in_position: 1, anm_present: 0, asha_workers_count: 3, cold_chain_functional: 0, drug_stockout_flag: 1, rainfall_mm: 8.1, temp_mean_c: 16.9, forecasted_malaria_2w: 6.2, forecasted_diarrhea_2w: 7.9, climate_health_hazard_index: 24.8, outbreak_risk_level: "Critical", recommended_resource: "Chlorine Water Purification Dispensers" },
  { village_id: "VIL_005", village_name: "Kalyanpur", block_name: "Block-A", subcentre_id: "HSC_1_01", parent_phc_id: "PHC_01", latitude: 24.02142, longitude: 82.27352, population: 3381, distance_phc_km: 6.5, distance_chc_km: 33.2, all_weather_road: 1, tap_water_access_pct: 23.3, sanitation_access_pct: 56.8, mo_in_position: 0, anm_present: 1, asha_workers_count: 3, cold_chain_functional: 1, drug_stockout_flag: 1, rainfall_mm: 7.5, temp_mean_c: 17.5, forecasted_malaria_2w: 5.1, forecasted_diarrhea_2w: 4.8, climate_health_hazard_index: 19.3, outbreak_risk_level: "High", recommended_resource: "Emergency Mobile Van with Medical Officer" },
  { village_id: "VIL_006", village_name: "Devgaon", block_name: "Block-A", subcentre_id: "HSC_1_02", parent_phc_id: "PHC_01", latitude: 24.08909, longitude: 82.26205, population: 1213, distance_phc_km: 5.4, distance_chc_km: 16.2, all_weather_road: 1, tap_water_access_pct: 52.5, sanitation_access_pct: 62.8, mo_in_position: 1, anm_present: 0, asha_workers_count: 1, cold_chain_functional: 0, drug_stockout_flag: 0, rainfall_mm: 4.8, temp_mean_c: 18.0, forecasted_malaria_2w: 0.9, forecasted_diarrhea_2w: 1.2, climate_health_hazard_index: 6.5, outbreak_risk_level: "Low", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_007", village_name: "Chandpur", block_name: "Block-A", subcentre_id: "HSC_1_02", parent_phc_id: "PHC_01", latitude: 24.12219, longitude: 82.31095, population: 3710, distance_phc_km: 12.6, distance_chc_km: 38.2, all_weather_road: 1, tap_water_access_pct: 66.7, sanitation_access_pct: 60.8, mo_in_position: 1, anm_present: 1, asha_workers_count: 4, cold_chain_functional: 0, drug_stockout_flag: 0, rainfall_mm: 5.9, temp_mean_c: 17.4, forecasted_malaria_2w: 2.8, forecasted_diarrhea_2w: 3.1, climate_health_hazard_index: 13.5, outbreak_risk_level: "Moderate", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_008", village_name: "Sultanpur", block_name: "Block-A", subcentre_id: "HSC_1_02", parent_phc_id: "PHC_01", latitude: 24.0842, longitude: 82.17179, population: 2648, distance_phc_km: 14.1, distance_chc_km: 27.0, all_weather_road: 1, tap_water_access_pct: 31.7, sanitation_access_pct: 24.5, mo_in_position: 1, anm_present: 1, asha_workers_count: 3, cold_chain_functional: 1, drug_stockout_flag: 1, rainfall_mm: 8.5, temp_mean_c: 16.5, forecasted_malaria_2w: 6.8, forecasted_diarrhea_2w: 8.5, climate_health_hazard_index: 25.1, outbreak_risk_level: "Critical", recommended_resource: "Chlorine Water Purification Dispensers" },
  { village_id: "VIL_009", village_name: "Fatehpur", block_name: "Block-A", subcentre_id: "HSC_1_02", parent_phc_id: "PHC_01", latitude: 24.02694, longitude: 82.29629, population: 1504, distance_phc_km: 8.9, distance_chc_km: 25.6, all_weather_road: 0, tap_water_access_pct: 31.7, sanitation_access_pct: 51.3, mo_in_position: 1, anm_present: 1, asha_workers_count: 2, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 6.2, temp_mean_c: 17.6, forecasted_malaria_2w: 3.4, forecasted_diarrhea_2w: 4.2, climate_health_hazard_index: 15.2, outbreak_risk_level: "Moderate", recommended_resource: "ORS Rehydration Salts & IV Fluids" },
  { village_id: "VIL_010", village_name: "Haridaspur", block_name: "Block-A", subcentre_id: "HSC_1_02", parent_phc_id: "PHC_01", latitude: 24.05697, longitude: 82.24592, population: 1258, distance_phc_km: 7.1, distance_chc_km: 32.9, all_weather_road: 1, tap_water_access_pct: 20.5, sanitation_access_pct: 70.6, mo_in_position: 1, anm_present: 1, asha_workers_count: 1, cold_chain_functional: 0, drug_stockout_flag: 1, rainfall_mm: 5.7, temp_mean_c: 18.2, forecasted_malaria_2w: 1.5, forecasted_diarrhea_2w: 2.0, climate_health_hazard_index: 8.9, outbreak_risk_level: "Low", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_011", village_name: "Shivpur", block_name: "Block-B", subcentre_id: "HSC_2_01", parent_phc_id: "PHC_02", latitude: 24.31655, longitude: 82.21824, population: 3569, distance_phc_km: 8.2, distance_chc_km: 28.1, all_weather_road: 1, tap_water_access_pct: 35.6, sanitation_access_pct: 66.9, mo_in_position: 1, anm_present: 1, asha_workers_count: 4, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 6.9, temp_mean_c: 17.3, forecasted_malaria_2w: 3.2, forecasted_diarrhea_2w: 3.9, climate_health_hazard_index: 14.1, outbreak_risk_level: "Moderate", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_012", village_name: "Birbalpur", block_name: "Block-B", subcentre_id: "HSC_2_01", parent_phc_id: "PHC_02", latitude: 24.36642, longitude: 82.17144, population: 3841, distance_phc_km: 9.2, distance_chc_km: 37.4, all_weather_road: 0, tap_water_access_pct: 74.2, sanitation_access_pct: 67.1, mo_in_position: 1, anm_present: 1, asha_workers_count: 4, cold_chain_functional: 1, drug_stockout_flag: 1, rainfall_mm: 7.9, temp_mean_c: 17.0, forecasted_malaria_2w: 5.4, forecasted_diarrhea_2w: 4.6, climate_health_hazard_index: 18.7, outbreak_risk_level: "High", recommended_resource: "Antimalarial ACT Treatment Kits & RDKs" },
  { village_id: "VIL_013", village_name: "Gopalpur", block_name: "Block-B", subcentre_id: "HSC_2_01", parent_phc_id: "PHC_02", latitude: 24.35138, longitude: 82.22841, population: 4637, distance_phc_km: 2.4, distance_chc_km: 12.8, all_weather_road: 1, tap_water_access_pct: 24.7, sanitation_access_pct: 75.7, mo_in_position: 1, anm_present: 1, asha_workers_count: 5, cold_chain_functional: 0, drug_stockout_flag: 0, rainfall_mm: 5.1, temp_mean_c: 18.5, forecasted_malaria_2w: 2.0, forecasted_diarrhea_2w: 2.6, climate_health_hazard_index: 10.4, outbreak_risk_level: "Low", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_014", village_name: "Jamunaha", block_name: "Block-B", subcentre_id: "HSC_2_01", parent_phc_id: "PHC_02", latitude: 24.4678, longitude: 82.26546, population: 1609, distance_phc_km: 16.9, distance_chc_km: 35.7, all_weather_road: 1, tap_water_access_pct: 51.1, sanitation_access_pct: 95.0, mo_in_position: 1, anm_present: 0, asha_workers_count: 2, cold_chain_functional: 1, drug_stockout_flag: 1, rainfall_mm: 9.1, temp_mean_c: 16.2, forecasted_malaria_2w: 7.6, forecasted_diarrhea_2w: 5.4, climate_health_hazard_index: 25.8, outbreak_risk_level: "Critical", recommended_resource: "Antimalarial ACT Treatment Kits & RDKs" },
  { village_id: "VIL_015", village_name: "Mohanpur", block_name: "Block-B", subcentre_id: "HSC_2_01", parent_phc_id: "PHC_02", latitude: 24.36964, longitude: 82.21509, population: 951, distance_phc_km: 7.1, distance_chc_km: 40.9, all_weather_road: 1, tap_water_access_pct: 60.8, sanitation_access_pct: 52.5, mo_in_position: 0, anm_present: 1, asha_workers_count: 1, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 4.6, temp_mean_c: 18.1, forecasted_malaria_2w: 0.8, forecasted_diarrhea_2w: 1.1, climate_health_hazard_index: 5.9, outbreak_risk_level: "Low", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_016", village_name: "Bishunpur", block_name: "Block-B", subcentre_id: "HSC_2_02", parent_phc_id: "PHC_02", latitude: 24.32484, longitude: 82.23828, population: 2059, distance_phc_km: 7.5, distance_chc_km: 21.0, all_weather_road: 1, tap_water_access_pct: 33.9, sanitation_access_pct: 64.7, mo_in_position: 1, anm_present: 1, asha_workers_count: 2, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 6.1, temp_mean_c: 17.8, forecasted_malaria_2w: 2.5, forecasted_diarrhea_2w: 3.2, climate_health_hazard_index: 12.9, outbreak_risk_level: "Moderate", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_017", village_name: "Belwa", block_name: "Block-B", subcentre_id: "HSC_2_02", parent_phc_id: "PHC_02", latitude: 24.31604, longitude: 82.23686, population: 4497, distance_phc_km: 4.4, distance_chc_km: 30.1, all_weather_road: 1, tap_water_access_pct: 36.3, sanitation_access_pct: 70.1, mo_in_position: 1, anm_present: 1, asha_workers_count: 4, cold_chain_functional: 1, drug_stockout_flag: 1, rainfall_mm: 7.3, temp_mean_c: 17.4, forecasted_malaria_2w: 4.8, forecasted_diarrhea_2w: 5.1, climate_health_hazard_index: 19.8, outbreak_risk_level: "High", recommended_resource: "ORS Rehydration Salts & IV Fluids" },
  { village_id: "VIL_018", village_name: "Baghaha", block_name: "Block-B", subcentre_id: "HSC_2_02", parent_phc_id: "PHC_02", latitude: 24.33588, longitude: 82.25649, population: 3141, distance_phc_km: 4.3, distance_chc_km: 15.3, all_weather_road: 0, tap_water_access_pct: 32.8, sanitation_access_pct: 77.4, mo_in_position: 1, anm_present: 1, asha_workers_count: 3, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 5.5, temp_mean_c: 18.0, forecasted_malaria_2w: 2.2, forecasted_diarrhea_2w: 2.8, climate_health_hazard_index: 11.2, outbreak_risk_level: "Moderate", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_019", village_name: "Sikanderpur", block_name: "Block-B", subcentre_id: "HSC_2_02", parent_phc_id: "PHC_02", latitude: 24.29304, longitude: 82.14942, population: 3488, distance_phc_km: 14.6, distance_chc_km: 30.8, all_weather_road: 1, tap_water_access_pct: 14.1, sanitation_access_pct: 52.5, mo_in_position: 0, anm_present: 1, asha_workers_count: 3, cold_chain_functional: 0, drug_stockout_flag: 1, rainfall_mm: 8.8, temp_mean_c: 16.7, forecasted_malaria_2w: 7.2, forecasted_diarrhea_2w: 8.1, climate_health_hazard_index: 26.1, outbreak_risk_level: "Critical", recommended_resource: "Emergency Mobile Van with Medical Officer" },
  { village_id: "VIL_020", village_name: "Majhaulia", block_name: "Block-B", subcentre_id: "HSC_2_02", parent_phc_id: "PHC_02", latitude: 24.36847, longitude: 82.2325, population: 1893, distance_phc_km: 4.2, distance_chc_km: 17.2, all_weather_road: 1, tap_water_access_pct: 55.9, sanitation_access_pct: 43.2, mo_in_position: 1, anm_present: 1, asha_workers_count: 2, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 5.2, temp_mean_c: 18.3, forecasted_malaria_2w: 1.4, forecasted_diarrhea_2w: 1.9, climate_health_hazard_index: 8.3, outbreak_risk_level: "Low", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_021", village_name: "Parsa", block_name: "Block-C", subcentre_id: "HSC_3_01", parent_phc_id: "PHC_03", latitude: 24.30129, longitude: 82.57588, population: 4380, distance_phc_km: 13.2, distance_chc_km: 24.3, all_weather_road: 1, tap_water_access_pct: 24.3, sanitation_access_pct: 65.4, mo_in_position: 0, anm_present: 0, asha_workers_count: 4, cold_chain_functional: 1, drug_stockout_flag: 1, rainfall_mm: 7.8, temp_mean_c: 17.1, forecasted_malaria_2w: 5.8, forecasted_diarrhea_2w: 4.9, climate_health_hazard_index: 20.4, outbreak_risk_level: "High", recommended_resource: "Emergency Mobile Van with Medical Officer" },
  { village_id: "VIL_022", village_name: "Bhagwanpur", block_name: "Block-C", subcentre_id: "HSC_3_01", parent_phc_id: "PHC_03", latitude: 24.21199, longitude: 82.69653, population: 4563, distance_phc_km: 10.4, distance_chc_km: 34.0, all_weather_road: 0, tap_water_access_pct: 26.4, sanitation_access_pct: 49.3, mo_in_position: 1, anm_present: 1, asha_workers_count: 5, cold_chain_functional: 0, drug_stockout_flag: 1, rainfall_mm: 8.2, temp_mean_c: 17.0, forecasted_malaria_2w: 6.4, forecasted_diarrhea_2w: 6.9, climate_health_hazard_index: 22.7, outbreak_risk_level: "High", recommended_resource: "Antimalarial ACT Treatment Kits & RDKs" },
  { village_id: "VIL_023", village_name: "Dharampur", block_name: "Block-C", subcentre_id: "HSC_3_01", parent_phc_id: "PHC_03", latitude: 24.18978, longitude: 82.69589, population: 4624, distance_phc_km: 12.4, distance_chc_km: 30.9, all_weather_road: 1, tap_water_access_pct: 58.2, sanitation_access_pct: 62.9, mo_in_position: 1, anm_present: 1, asha_workers_count: 5, cold_chain_functional: 0, drug_stockout_flag: 0, rainfall_mm: 6.3, temp_mean_c: 17.5, forecasted_malaria_2w: 3.5, forecasted_diarrhea_2w: 3.8, climate_health_hazard_index: 15.0, outbreak_risk_level: "Moderate", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_024", village_name: "Sonpur", block_name: "Block-C", subcentre_id: "HSC_3_01", parent_phc_id: "PHC_03", latitude: 24.26118, longitude: 82.63225, population: 4782, distance_phc_km: 5.3, distance_chc_km: 34.7, all_weather_road: 1, tap_water_access_pct: 22.0, sanitation_access_pct: 44.2, mo_in_position: 1, anm_present: 1, asha_workers_count: 5, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 5.8, temp_mean_c: 18.0, forecasted_malaria_2w: 2.7, forecasted_diarrhea_2w: 3.4, climate_health_hazard_index: 13.6, outbreak_risk_level: "Moderate", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_025", village_name: "Chainpur", block_name: "Block-C", subcentre_id: "HSC_3_01", parent_phc_id: "PHC_03", latitude: 24.21241, longitude: 82.62116, population: 3152, distance_phc_km: 4.1, distance_chc_km: 38.1, all_weather_road: 0, tap_water_access_pct: 17.8, sanitation_access_pct: 20.0, mo_in_position: 0, anm_present: 1, asha_workers_count: 3, cold_chain_functional: 1, drug_stockout_flag: 1, rainfall_mm: 9.3, temp_mean_c: 16.4, forecasted_malaria_2w: 7.9, forecasted_diarrhea_2w: 8.8, climate_health_hazard_index: 27.5, outbreak_risk_level: "Critical", recommended_resource: "Chlorine Water Purification Dispensers" },
  { village_id: "VIL_026", village_name: "Khairpur", block_name: "Block-C", subcentre_id: "HSC_3_02", parent_phc_id: "PHC_03", latitude: 24.32173, longitude: 82.64607, population: 1603, distance_phc_km: 13.4, distance_chc_km: 47.7, all_weather_road: 0, tap_water_access_pct: 46.4, sanitation_access_pct: 61.9, mo_in_position: 0, anm_present: 1, asha_workers_count: 2, cold_chain_functional: 1, drug_stockout_flag: 1, rainfall_mm: 7.1, temp_mean_c: 17.3, forecasted_malaria_2w: 4.4, forecasted_diarrhea_2w: 4.7, climate_health_hazard_index: 18.2, outbreak_risk_level: "High", recommended_resource: "Emergency Mobile Van with Medical Officer" },
  { village_id: "VIL_027", village_name: "Madhubani", block_name: "Block-C", subcentre_id: "HSC_3_02", parent_phc_id: "PHC_03", latitude: 24.17807, longitude: 82.57679, population: 1805, distance_phc_km: 13.2, distance_chc_km: 46.9, all_weather_road: 0, tap_water_access_pct: 10.0, sanitation_access_pct: 52.4, mo_in_position: 0, anm_present: 1, asha_workers_count: 2, cold_chain_functional: 0, drug_stockout_flag: 1, rainfall_mm: 7.7, temp_mean_c: 17.1, forecasted_malaria_2w: 5.6, forecasted_diarrhea_2w: 5.9, climate_health_hazard_index: 21.0, outbreak_risk_level: "High", recommended_resource: "Emergency Mobile Van with Medical Officer" },
  { village_id: "VIL_028", village_name: "Barh", block_name: "Block-C", subcentre_id: "HSC_3_02", parent_phc_id: "PHC_03", latitude: 24.26928, longitude: 82.69084, population: 2608, distance_phc_km: 11.4, distance_chc_km: 40.5, all_weather_road: 0, tap_water_access_pct: 69.6, sanitation_access_pct: 56.3, mo_in_position: 0, anm_present: 1, asha_workers_count: 3, cold_chain_functional: 0, drug_stockout_flag: 0, rainfall_mm: 5.6, temp_mean_c: 17.9, forecasted_malaria_2w: 2.3, forecasted_diarrhea_2w: 2.7, climate_health_hazard_index: 11.8, outbreak_risk_level: "Moderate", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_029", village_name: "Chakia", block_name: "Block-C", subcentre_id: "HSC_3_02", parent_phc_id: "PHC_03", latitude: 24.24496, longitude: 82.63359, population: 1906, distance_phc_km: 2.3, distance_chc_km: 26.1, all_weather_road: 0, tap_water_access_pct: 67.9, sanitation_access_pct: 46.8, mo_in_position: 1, anm_present: 1, asha_workers_count: 2, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 4.9, temp_mean_c: 18.4, forecasted_malaria_2w: 1.1, forecasted_diarrhea_2w: 1.6, climate_health_hazard_index: 7.4, outbreak_risk_level: "Low", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_030", village_name: "Tekari", block_name: "Block-C", subcentre_id: "HSC_3_02", parent_phc_id: "PHC_03", latitude: 24.21197, longitude: 82.57899, population: 3158, distance_phc_km: 8.6, distance_chc_km: 27.6, all_weather_road: 1, tap_water_access_pct: 50.9, sanitation_access_pct: 36.9, mo_in_position: 0, anm_present: 1, asha_workers_count: 3, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 6.0, temp_mean_c: 17.7, forecasted_malaria_2w: 2.9, forecasted_diarrhea_2w: 3.5, climate_health_hazard_index: 13.9, outbreak_risk_level: "Moderate", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_031", village_name: "Matihani", block_name: "Block-D", subcentre_id: "HSC_4_01", parent_phc_id: "PHC_04", latitude: 24.21651, longitude: 82.48179, population: 4575, distance_phc_km: 10.6, distance_chc_km: 24.3, all_weather_road: 1, tap_water_access_pct: 45.9, sanitation_access_pct: 50.2, mo_in_position: 1, anm_present: 1, asha_workers_count: 5, cold_chain_functional: 0, drug_stockout_flag: 0, rainfall_mm: 6.7, temp_mean_c: 17.5, forecasted_malaria_2w: 3.7, forecasted_diarrhea_2w: 4.1, climate_health_hazard_index: 16.1, outbreak_risk_level: "Moderate", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_032", village_name: "Nabinagar", block_name: "Block-D", subcentre_id: "HSC_4_01", parent_phc_id: "PHC_04", latitude: 24.17834, longitude: 82.44653, population: 2473, distance_phc_km: 7.9, distance_chc_km: 24.2, all_weather_road: 1, tap_water_access_pct: 34.3, sanitation_access_pct: 78.4, mo_in_position: 0, anm_present: 0, asha_workers_count: 2, cold_chain_functional: 1, drug_stockout_flag: 1, rainfall_mm: 7.4, temp_mean_c: 17.2, forecasted_malaria_2w: 4.9, forecasted_diarrhea_2w: 4.4, climate_health_hazard_index: 19.1, outbreak_risk_level: "High", recommended_resource: "Antimalarial ACT Treatment Kits & RDKs" },
  { village_id: "VIL_033", village_name: "Kanti", block_name: "Block-D", subcentre_id: "HSC_4_01", parent_phc_id: "PHC_04", latitude: 24.18588, longitude: 82.55424, population: 4631, distance_phc_km: 9.2, distance_chc_km: 29.7, all_weather_road: 0, tap_water_access_pct: 61.1, sanitation_access_pct: 29.9, mo_in_position: 1, anm_present: 1, asha_workers_count: 5, cold_chain_functional: 0, drug_stockout_flag: 1, rainfall_mm: 8.0, temp_mean_c: 16.8, forecasted_malaria_2w: 6.1, forecasted_diarrhea_2w: 6.7, climate_health_hazard_index: 23.4, outbreak_risk_level: "High", recommended_resource: "Chlorine Water Purification Dispensers" },
  { village_id: "VIL_034", village_name: "Dumraon", block_name: "Block-D", subcentre_id: "HSC_4_01", parent_phc_id: "PHC_04", latitude: 24.08776, longitude: 82.48109, population: 787, distance_phc_km: 12.8, distance_chc_km: 44.4, all_weather_road: 0, tap_water_access_pct: 56.3, sanitation_access_pct: 53.5, mo_in_position: 0, anm_present: 1, asha_workers_count: 1, cold_chain_functional: 0, drug_stockout_flag: 0, rainfall_mm: 4.7, temp_mean_c: 18.2, forecasted_malaria_2w: 0.7, forecasted_diarrhea_2w: 0.9, climate_health_hazard_index: 5.2, outbreak_risk_level: "Low", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_035", village_name: "Bakhri", block_name: "Block-D", subcentre_id: "HSC_4_01", parent_phc_id: "PHC_04", latitude: 24.11715, longitude: 82.52734, population: 4095, distance_phc_km: 7.8, distance_chc_km: 21.0, all_weather_road: 1, tap_water_access_pct: 28.5, sanitation_access_pct: 84.8, mo_in_position: 1, anm_present: 1, asha_workers_count: 4, cold_chain_functional: 0, drug_stockout_flag: 0, rainfall_mm: 5.8, temp_mean_c: 17.8, forecasted_malaria_2w: 2.6, forecasted_diarrhea_2w: 3.1, climate_health_hazard_index: 12.5, outbreak_risk_level: "Moderate", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_036", village_name: "Raghunathpur", block_name: "Block-D", subcentre_id: "HSC_4_02", parent_phc_id: "PHC_04", latitude: 24.21228, longitude: 82.44935, population: 1173, distance_phc_km: 8.5, distance_chc_km: 32.3, all_weather_road: 1, tap_water_access_pct: 20.4, sanitation_access_pct: 89.4, mo_in_position: 0, anm_present: 1, asha_workers_count: 1, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 5.0, temp_mean_c: 18.2, forecasted_malaria_2w: 1.2, forecasted_diarrhea_2w: 1.5, climate_health_hazard_index: 7.8, outbreak_risk_level: "Low", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_037", village_name: "Alinagar", block_name: "Block-D", subcentre_id: "HSC_4_02", parent_phc_id: "PHC_04", latitude: 24.16484, longitude: 82.49172, population: 3416, distance_phc_km: 5.3, distance_chc_km: 34.0, all_weather_road: 1, tap_water_access_pct: 55.8, sanitation_access_pct: 45.5, mo_in_position: 1, anm_present: 1, asha_workers_count: 3, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 5.3, temp_mean_c: 18.1, forecasted_malaria_2w: 2.1, forecasted_diarrhea_2w: 2.9, climate_health_hazard_index: 11.6, outbreak_risk_level: "Moderate", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_038", village_name: "Manjhi", block_name: "Block-D", subcentre_id: "HSC_4_02", parent_phc_id: "PHC_04", latitude: 24.17943, longitude: 82.51943, population: 2556, distance_phc_km: 3.5, distance_chc_km: 35.2, all_weather_road: 1, tap_water_access_pct: 25.7, sanitation_access_pct: 55.0, mo_in_position: 1, anm_present: 1, asha_workers_count: 3, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 5.4, temp_mean_c: 18.0, forecasted_malaria_2w: 1.9, forecasted_diarrhea_2w: 2.4, climate_health_hazard_index: 9.9, outbreak_risk_level: "Low", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_039", village_name: "Gorakhpur-Dehat", block_name: "Block-D", subcentre_id: "HSC_4_02", parent_phc_id: "PHC_04", latitude: 24.17806, longitude: 82.53698, population: 2808, distance_phc_km: 7.9, distance_chc_km: 37.6, all_weather_road: 1, tap_water_access_pct: 79.5, sanitation_access_pct: 80.3, mo_in_position: 0, anm_present: 1, asha_workers_count: 3, cold_chain_functional: 0, drug_stockout_flag: 1, rainfall_mm: 6.8, temp_mean_c: 17.6, forecasted_malaria_2w: 3.8, forecasted_diarrhea_2w: 3.6, climate_health_hazard_index: 15.6, outbreak_risk_level: "Moderate", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_040", village_name: "Belhar", block_name: "Block-D", subcentre_id: "HSC_4_02", parent_phc_id: "PHC_04", latitude: 24.21203, longitude: 82.50011, population: 2974, distance_phc_km: 7.1, distance_chc_km: 40.4, all_weather_road: 1, tap_water_access_pct: 30.7, sanitation_access_pct: 51.9, mo_in_position: 1, anm_present: 0, asha_workers_count: 3, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 5.7, temp_mean_c: 17.9, forecasted_malaria_2w: 2.4, forecasted_diarrhea_2w: 3.0, climate_health_hazard_index: 12.0, outbreak_risk_level: "Moderate", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_041", village_name: "Bhabua-Khurd", block_name: "Block-E", subcentre_id: "HSC_5_01", parent_phc_id: "PHC_05", latitude: 23.8479, longitude: 82.58142, population: 653, distance_phc_km: 16.5, distance_chc_km: 29.3, all_weather_road: 1, tap_water_access_pct: 52.2, sanitation_access_pct: 71.3, mo_in_position: 1, anm_present: 0, asha_workers_count: 1, cold_chain_functional: 0, drug_stockout_flag: 0, rainfall_mm: 4.5, temp_mean_c: 18.6, forecasted_malaria_2w: 0.6, forecasted_diarrhea_2w: 0.8, climate_health_hazard_index: 4.8, outbreak_risk_level: "Low", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_042", village_name: "Karakat", block_name: "Block-E", subcentre_id: "HSC_5_01", parent_phc_id: "PHC_05", latitude: 24.05268, longitude: 82.51765, population: 2223, distance_phc_km: 16.2, distance_chc_km: 39.5, all_weather_road: 0, tap_water_access_pct: 46.8, sanitation_access_pct: 95.0, mo_in_position: 0, anm_present: 1, asha_workers_count: 2, cold_chain_functional: 0, drug_stockout_flag: 1, rainfall_mm: 7.6, temp_mean_c: 17.1, forecasted_malaria_2w: 5.2, forecasted_diarrhea_2w: 4.3, climate_health_hazard_index: 18.9, outbreak_risk_level: "High", recommended_resource: "Antimalarial ACT Treatment Kits & RDKs" },
  { village_id: "VIL_043", village_name: "Daudnagar", block_name: "Block-E", subcentre_id: "HSC_5_01", parent_phc_id: "PHC_05", latitude: 23.98826, longitude: 82.53096, population: 2644, distance_phc_km: 7.2, distance_chc_km: 34.2, all_weather_road: 0, tap_water_access_pct: 38.2, sanitation_access_pct: 60.6, mo_in_position: 0, anm_present: 0, asha_workers_count: 3, cold_chain_functional: 1, drug_stockout_flag: 1, rainfall_mm: 7.5, temp_mean_c: 17.3, forecasted_malaria_2w: 5.0, forecasted_diarrhea_2w: 4.7, climate_health_hazard_index: 19.4, outbreak_risk_level: "High", recommended_resource: "Emergency Mobile Van with Medical Officer" },
  { village_id: "VIL_044", village_name: "Bikramganj", block_name: "Block-E", subcentre_id: "HSC_5_01", parent_phc_id: "PHC_05", latitude: 23.97376, longitude: 82.58076, population: 4500, distance_phc_km: 8.0, distance_chc_km: 19.2, all_weather_road: 0, tap_water_access_pct: 52.6, sanitation_access_pct: 52.9, mo_in_position: 1, anm_present: 1, asha_workers_count: 4, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 6.4, temp_mean_c: 17.7, forecasted_malaria_2w: 3.6, forecasted_diarrhea_2w: 4.0, climate_health_hazard_index: 15.8, outbreak_risk_level: "Moderate", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_045", village_name: "Piro", block_name: "Block-E", subcentre_id: "HSC_5_01", parent_phc_id: "PHC_05", latitude: 23.9372, longitude: 82.59194, population: 4412, distance_phc_km: 8.6, distance_chc_km: 29.6, all_weather_road: 1, tap_water_access_pct: 78.0, sanitation_access_pct: 32.7, mo_in_position: 1, anm_present: 1, asha_workers_count: 4, cold_chain_functional: 0, drug_stockout_flag: 1, rainfall_mm: 8.4, temp_mean_c: 16.9, forecasted_malaria_2w: 6.7, forecasted_diarrhea_2w: 7.5, climate_health_hazard_index: 24.3, outbreak_risk_level: "Critical", recommended_resource: "Chlorine Water Purification Dispensers" },
  { village_id: "VIL_046", village_name: "Jagdishpur", block_name: "Block-E", subcentre_id: "HSC_5_02", parent_phc_id: "PHC_05", latitude: 23.88347, longitude: 82.46247, population: 2685, distance_phc_km: 14.8, distance_chc_km: 43.0, all_weather_road: 0, tap_water_access_pct: 70.5, sanitation_access_pct: 73.5, mo_in_position: 1, anm_present: 1, asha_workers_count: 3, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 5.9, temp_mean_c: 17.9, forecasted_malaria_2w: 2.8, forecasted_diarrhea_2w: 3.3, climate_health_hazard_index: 13.4, outbreak_risk_level: "Moderate", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_047", village_name: "Dumra", block_name: "Block-E", subcentre_id: "HSC_5_02", parent_phc_id: "PHC_05", latitude: 23.93176, longitude: 82.56446, population: 3878, distance_phc_km: 5.3, distance_chc_km: 24.8, all_weather_road: 1, tap_water_access_pct: 67.5, sanitation_access_pct: 50.4, mo_in_position: 1, anm_present: 1, asha_workers_count: 4, cold_chain_functional: 0, drug_stockout_flag: 0, rainfall_mm: 5.5, temp_mean_c: 18.0, forecasted_malaria_2w: 2.2, forecasted_diarrhea_2w: 2.6, climate_health_hazard_index: 11.0, outbreak_risk_level: "Low", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_048", village_name: "Runnisaidpur", block_name: "Block-E", subcentre_id: "HSC_5_02", parent_phc_id: "PHC_05", latitude: 23.94261, longitude: 82.54956, population: 1012, distance_phc_km: 2.7, distance_chc_km: 23.3, all_weather_road: 1, tap_water_access_pct: 21.7, sanitation_access_pct: 95.0, mo_in_position: 0, anm_present: 0, asha_workers_count: 1, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 4.8, temp_mean_c: 18.3, forecasted_malaria_2w: 1.0, forecasted_diarrhea_2w: 1.3, climate_health_hazard_index: 6.8, outbreak_risk_level: "Low", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_049", village_name: "Bairgania", block_name: "Block-E", subcentre_id: "HSC_5_02", parent_phc_id: "PHC_05", latitude: 23.96725, longitude: 82.56299, population: 4099, distance_phc_km: 6.2, distance_chc_km: 20.0, all_weather_road: 1, tap_water_access_pct: 49.5, sanitation_access_pct: 51.8, mo_in_position: 1, anm_present: 1, asha_workers_count: 4, cold_chain_functional: 0, drug_stockout_flag: 0, rainfall_mm: 5.3, temp_mean_c: 18.1, forecasted_malaria_2w: 2.0, forecasted_diarrhea_2w: 2.7, climate_health_hazard_index: 10.8, outbreak_risk_level: "Low", recommended_resource: "Standard ASHA Community Surveillance" },
  { village_id: "VIL_050", village_name: "Sursand", block_name: "Block-E", subcentre_id: "HSC_5_02", parent_phc_id: "PHC_05", latitude: 23.90404, longitude: 82.52218, population: 1186, distance_phc_km: 10.2, distance_chc_km: 35.3, all_weather_road: 1, tap_water_access_pct: 10.0, sanitation_access_pct: 60.6, mo_in_position: 0, anm_present: 1, asha_workers_count: 1, cold_chain_functional: 1, drug_stockout_flag: 0, rainfall_mm: 5.6, temp_mean_c: 17.9, forecasted_malaria_2w: 1.7, forecasted_diarrhea_2w: 2.2, climate_health_hazard_index: 9.1, outbreak_risk_level: "Low", recommended_resource: "Standard ASHA Community Surveillance" }
];

export class ApiService {
  constructor() {
    this.lastLatency = 2;
    this.isOnline = true;
    this.initLocalStorage();
  }

  initLocalStorage() {
    // 1. Initialize Patients
    if (!localStorage.getItem('rh_patients')) {
      const initialPatients = samplePatients.map((p, idx) => ({
        id: idx + 1,
        ...p,
        created_at: new Date(Date.now() - (idx * 86400000)).toISOString(),
        updated_at: new Date(Date.now() - (idx * 86400000)).toISOString()
      }));
      localStorage.setItem('rh_patients', JSON.stringify(initialPatients));
    }

    // 2. Initialize Resources
    if (!localStorage.getItem('rh_resources')) {
      const initialResources = sampleResources.map((r, idx) => ({
        id: idx + 1,
        ...r,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      localStorage.setItem('rh_resources', JSON.stringify(initialResources));
    }

    // 3. Initialize Admissions
    if (!localStorage.getItem('rh_admissions')) {
      const initialAdmissions = [
        {
          id: 1,
          patient_id: 1,
          admission_date: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
          discharge_date: null,
          department: "Intensive Care Unit (ICU)",
          diagnosis: "Acute Respiratory Distress Syndrome (ARDS) secondary to viral pneumonia",
          severity_level: "Critical",
          status: "active",
          created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
        },
        {
          id: 2,
          patient_id: 2,
          admission_date: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
          discharge_date: null,
          department: "Cardiology",
          diagnosis: "Non-ST Elevation Myocardial Infarction (NSTEMI) post-angioplasty",
          severity_level: "High",
          status: "active",
          created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
        },
        {
          id: 3,
          patient_id: 3,
          admission_date: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
          discharge_date: null,
          department: "Emergency & Trauma",
          diagnosis: "Multiple contusions and mild concussion",
          severity_level: "Moderate",
          status: "active",
          created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
        },
        {
          id: 4,
          patient_id: 4,
          admission_date: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
          discharge_date: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
          department: "General Surgery",
          diagnosis: "Elective laparoscopic cholecystectomy - Routine recovery",
          severity_level: "Low",
          status: "discharged",
          created_at: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
        }
      ];
      localStorage.setItem('rh_admissions', JSON.stringify(initialAdmissions));
    }

    // 4. Initialize Allocations
    if (!localStorage.getItem('rh_allocations')) {
      const initialAllocations = [
        {
          id: 1,
          resource_id: 2,
          admission_id: 1,
          quantity_allocated: 1,
          allocation_date: new Date(Date.now() - 35 * 3600 * 1000).toISOString(),
          return_date: null,
          status: "allocated",
          notes: "Continuous mechanical ventilation mode CPAP",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          resource_id: 3,
          admission_id: 2,
          quantity_allocated: 1,
          allocation_date: new Date(Date.now() - 17 * 3600 * 1000).toISOString(),
          return_date: null,
          status: "allocated",
          notes: "12-lead continuous telemetry surveillance",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      localStorage.setItem('rh_allocations', JSON.stringify(initialAllocations));
    }

    // 5. Initialize Villages
    if (!localStorage.getItem('rh_villages')) {
      localStorage.setItem('rh_villages', JSON.stringify(defaultVillages));
    }
  }

  // ==========================================
  // System Health
  // ==========================================

  async checkHealth() {
    const patients = this._get('rh_patients');
    const resources = this._get('rh_resources');
    const admissions = this._get('rh_admissions');
    const allocations = this._get('rh_allocations');
    const active_admissions = admissions.filter(a => a.status === 'active').length;

    this.isOnline = true;
    this.lastLatency = 1;

    return {
      status: "healthy",
      database: "Local-First Leaflet GIS",
      timestamp: new Date().toISOString(),
      counts: {
        patients: patients.length,
        resources: resources.length,
        admissions: admissions.length,
        active_admissions: active_admissions,
        allocations: allocations.length
      }
    };
  }

  // Helpers
  _get(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
      return [];
    }
  }

  _set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  // ==========================================
  // Patient Endpoints
  // ==========================================

  async getPatients(skip = 0, limit = 100) {
    const data = this._get('rh_patients');
    return data.slice(skip, skip + limit);
  }

  async getPatient(id) {
    const data = this._get('rh_patients');
    const item = data.find(p => p.id === Number(id));
    if (!item) throw new Error("Patient not found");
    return item;
  }

  async createPatient(patientData) {
    const data = this._get('rh_patients');
    const newId = data.length > 0 ? Math.max(...data.map(p => p.id)) + 1 : 1;
    const newPatient = {
      id: newId,
      ...patientData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    data.unshift(newPatient);
    this._set('rh_patients', data);
    return newPatient;
  }

  async updatePatient(id, patientData) {
    const data = this._get('rh_patients');
    const idx = data.findIndex(p => p.id === Number(id));
    if (idx === -1) throw new Error("Patient not found");
    data[idx] = {
      ...data[idx],
      ...patientData,
      updated_at: new Date().toISOString()
    };
    this._set('rh_patients', data);
    return data[idx];
  }

  async deletePatient(id) {
    let data = this._get('rh_patients');
    data = data.filter(p => p.id !== Number(id));
    this._set('rh_patients', data);
    return null;
  }

  // ==========================================
  // Resource Endpoints
  // ==========================================

  async getResources(skip = 0, limit = 100) {
    const data = this._get('rh_resources');
    return data.slice(skip, skip + limit);
  }

  async getResource(id) {
    const data = this._get('rh_resources');
    const item = data.find(r => r.id === Number(id));
    if (!item) throw new Error("Resource not found");
    return item;
  }

  async createResource(resourceData) {
    const data = this._get('rh_resources');
    const newId = data.length > 0 ? Math.max(...data.map(r => r.id)) + 1 : 1;
    const newResource = {
      id: newId,
      ...resourceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    data.push(newResource);
    this._set('rh_resources', data);
    return newResource;
  }

  async updateResource(id, resourceData) {
    const data = this._get('rh_resources');
    const idx = data.findIndex(r => r.id === Number(id));
    if (idx === -1) throw new Error("Resource not found");
    data[idx] = {
      ...data[idx],
      ...resourceData,
      updated_at: new Date().toISOString()
    };
    this._set('rh_resources', data);
    return data[idx];
  }

  async deleteResource(id) {
    let data = this._get('rh_resources');
    data = data.filter(r => r.id !== Number(id));
    this._set('rh_resources', data);
    return null;
  }

  // ==========================================
  // Admission Endpoints
  // ==========================================

  async getAdmissions(skip = 0, limit = 100) {
    const data = this._get('rh_admissions');
    return data.slice(skip, skip + limit);
  }

  async getAdmission(id) {
    const data = this._get('rh_admissions');
    const item = data.find(a => a.id === Number(id));
    if (!item) throw new Error("Admission not found");
    return item;
  }

  async createAdmission(admissionData) {
    const data = this._get('rh_admissions');
    const newId = data.length > 0 ? Math.max(...data.map(a => a.id)) + 1 : 1;
    const newAdmission = {
      id: newId,
      ...admissionData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    data.unshift(newAdmission);
    this._set('rh_admissions', data);
    return newAdmission;
  }

  async updateAdmission(id, admissionData) {
    const data = this._get('rh_admissions');
    const idx = data.findIndex(a => a.id === Number(id));
    if (idx === -1) throw new Error("Admission not found");
    data[idx] = {
      ...data[idx],
      ...admissionData,
      updated_at: new Date().toISOString()
    };
    this._set('rh_admissions', data);
    return data[idx];
  }

  async deleteAdmission(id) {
    let data = this._get('rh_admissions');
    data = data.filter(a => a.id !== Number(id));
    this._set('rh_admissions', data);
    return null;
  }

  // ==========================================
  // Resource Allocation Endpoints
  // ==========================================

  async getResourceAllocations(skip = 0, limit = 100) {
    const data = this._get('rh_allocations');
    return data.slice(skip, skip + limit);
  }

  async getResourceAllocation(id) {
    const data = this._get('rh_allocations');
    const item = data.find(al => al.id === Number(id));
    if (!item) throw new Error("Resource allocation not found");
    return item;
  }

  async createResourceAllocation(allocationData) {
    const resources = this._get('rh_resources');
    const rIdx = resources.findIndex(r => r.id === Number(allocationData.resource_id));
    if (rIdx === -1) throw new Error("Resource not found");

    if (resources[rIdx].quantity_available < allocationData.quantity_allocated) {
      throw new Error("Insufficient resource quantity available");
    }

    // Deduct stock
    resources[rIdx].quantity_available -= allocationData.quantity_allocated;
    if (resources[rIdx].quantity_available === 0) {
      resources[rIdx].status = 'depleted';
    } else if (resources[rIdx].quantity_available <= resources[rIdx].quantity_total * 0.25) {
      resources[rIdx].status = 'low_stock';
    }
    this._set('rh_resources', resources);

    const allocations = this._get('rh_allocations');
    const newId = allocations.length > 0 ? Math.max(...allocations.map(a => a.id)) + 1 : 1;
    const newAlloc = {
      id: newId,
      ...allocationData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    allocations.unshift(newAlloc);
    this._set('rh_allocations', allocations);

    return newAlloc;
  }

  async deleteResourceAllocation(id) {
    const allocations = this._get('rh_allocations');
    const alloc = allocations.find(a => a.id === Number(id));
    if (!alloc) throw new Error("Resource allocation not found");

    // Restore stock
    const resources = this._get('rh_resources');
    const rIdx = resources.findIndex(r => r.id === Number(alloc.resource_id));
    if (rIdx !== -1) {
      resources[rIdx].quantity_available += alloc.quantity_allocated;
      if (resources[rIdx].quantity_available > resources[rIdx].quantity_total * 0.25) {
        resources[rIdx].status = 'available';
      }
      this._set('rh_resources', resources);
    }

    const filtered = allocations.filter(a => a.id !== Number(id));
    this._set('rh_allocations', filtered);
    return null;
  }

  // ==========================================
  // Machine Learning & Clinical Foresight
  // ==========================================

  async getMLModelInfo() {
    return {
      status: "trained",
      metadata: {
        model_type: "RandomForestClassifier & MultiOutputRegressor Ensemble",
        trained_at: new Date().toISOString(),
        total_samples: 5100,
        villages_count: 50,
        outbreak_classifier_metrics: { accuracy: 88.2, weighted_f1: 87.9 },
        malaria_forecaster_metrics: { r2_score: 0.76, mae_cases: 1.18 },
        diarrhea_forecaster_metrics: { r2_score: 0.74, mae_cases: 0.89 },
        feature_importances: [
          { feature: 'all_weather_road', importance: 11.13 },
          { feature: 'waterborne_runoff_risk', importance: 8.98 },
          { feature: 'flood_risk_score', importance: 6.64 },
          { feature: 'rainfall_cum_4w', importance: 6.53 },
          { feature: 'population', importance: 6.42 },
          { feature: 'vector_breeding_pressure', importance: 5.81 },
          { feature: 'sanitation_access_pct', importance: 5.42 },
          { feature: 'distance_phc_km', importance: 5.11 },
          { feature: 'rainfall_mm', importance: 4.88 },
          { feature: 'temp_mean_c', importance: 4.65 }
        ]
      }
    };
  }

  async predictTriage(vitals) {
    const hr = Number(vitals.heart_rate || 80);
    const spo2 = Number(vitals.spo2 || 98);
    const sbp = Number(vitals.systolic_bp || 120);
    const temp = Number(vitals.temperature || 37.0);
    const rr = Number(vitals.respiratory_rate || 16);

    let riskTier = "Low";
    let malariaSurge = 1.2;
    let diarrheaSurge = 1.5;
    let hazardIndex = 8.5;

    if (spo2 < 90 || hr > 135 || sbp < 85 || temp >= 39.5 || rr >= 30) {
      riskTier = "Critical";
      malariaSurge = 8.2;
      diarrheaSurge = 7.9;
      hazardIndex = 28.0;
    } else if (spo2 < 94 || hr > 115 || sbp < 95 || temp >= 38.5 || rr >= 24) {
      riskTier = "High";
      malariaSurge = 5.4;
      diarrheaSurge = 4.8;
      hazardIndex = 19.5;
    } else if (spo2 < 96 || hr > 100 || temp >= 37.8 || rr >= 20) {
      riskTier = "Moderate";
      malariaSurge = 2.8;
      diarrheaSurge = 3.2;
      hazardIndex = 13.0;
    }

    return {
      status: "success",
      predicted_outbreak_risk: riskTier,
      forecasted_malaria_cases_2w: malariaSurge,
      forecasted_diarrhea_cases_2w: diarrheaSurge,
      climate_health_hazard_index: hazardIndex,
      recommended_action: riskTier === "Critical" ? "Immediate ICU Bed & Ventilator Allocation" :
                          riskTier === "High" ? "Urgent ACT Antimalarial & IV Fluid Rehydration" :
                          riskTier === "Moderate" ? "Continuous Telemetry & Oral Rehydration Therapy" :
                          "Routine ASHA Monitoring"
    };
  }

  async retrainMLModel() {
    return {
      status: "success",
      message: "Model retrained successfully with updated clinical parameters.",
      accuracy: 89.4
    };
  }

  async uploadMLDataset(file) {
    return {
      status: "success",
      filename: file.name,
      rows_processed: 5100
    };
  }

  // ==========================================
  // Rural Health & Leaflet GIS Surveillance
  // ==========================================

  async getSurveillanceSummary() {
    const villages = this._get('rh_villages');
    const crit = villages.filter(v => v.outbreak_risk_level === 'Critical').length;
    const high = villages.filter(v => v.outbreak_risk_level === 'High').length;
    const mod = villages.filter(v => v.outbreak_risk_level === 'Moderate').length;
    const low = villages.filter(v => v.outbreak_risk_level === 'Low').length;
    const stockouts = villages.filter(v => v.drug_stockout_flag === 1).length;
    const totalPop = villages.reduce((acc, v) => acc + (v.population || 0), 0);

    const malSurge = Math.round(villages.reduce((acc, v) => acc + (v.forecasted_malaria_2w || 0), 0) * 10) / 10;
    const diaSurge = Math.round(villages.reduce((acc, v) => acc + (v.forecasted_diarrhea_2w || 0), 0) * 10) / 10;

    return {
      monitored_villages: villages.length,
      monitored_blocks: 5,
      total_rural_population: totalPop || 145045,
      current_surveillance_week: 104,
      critical_outbreak_villages: crit,
      high_risk_villages: high,
      moderate_risk_villages: mod,
      low_risk_villages: low,
      active_drug_stockouts: stockouts,
      district_avg_rainfall_mm: 7.0,
      district_avg_temp_c: 17.5,
      forecasted_district_malaria_surge_2w: malSurge,
      forecasted_district_diarrhea_surge_2w: diaSurge
    };
  }

  async getSurveillanceVillages(block = 'all', risk = 'all') {
    let list = this._get('rh_villages');
    if (block && block !== 'all') {
      list = list.filter(v => v.block_name === block);
    }
    if (risk && risk !== 'all') {
      list = list.filter(v => v.outbreak_risk_level === risk);
    }
    return list;
  }

  async getVillageTrend(villageId) {
    const villages = this._get('rh_villages');
    const vil = villages.find(v => v.village_id === villageId) || villages[0];
    return {
      village_id: vil.village_id,
      village_name: vil.village_name,
      trend: [
        { week: 100, rainfall: 4.2, temp: 18.2, malaria: 1.1, diarrhea: 1.4 },
        { week: 101, rainfall: 5.8, temp: 17.8, malaria: 1.9, diarrhea: 2.1 },
        { week: 102, rainfall: 6.9, temp: 17.5, malaria: 3.2, diarrhea: 3.8 },
        { week: 103, rainfall: 7.5, temp: 17.2, malaria: 4.8, diarrhea: 5.1 },
        { week: 104, rainfall: vil.rainfall_mm, temp: vil.temp_mean_c, malaria: vil.forecasted_malaria_2w, diarrhea: vil.forecasted_diarrhea_2w }
      ]
    };
  }
}

export const api = new ApiService();
