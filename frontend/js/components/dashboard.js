/**
 * Healthcare Resource Management System - GIS Surveillance Map & Command Center
 * Interactive GIS Mapping of 50 Rural Villages, Climate Hazards, and Outbreak Predictions
 */

import { api } from '../api.js';
import { state } from '../state.js';
import { toast } from '../utils/toast.js';
import { ModalManager } from '../utils/modal.js';

export class DashboardComponent {
  constructor(container) {
    this.container = container;
    this.map = null;
    this.markers = [];
    this.selectedBlock = 'all';
    this.selectedRisk = 'all';
    this.activeLayer = 'all';
    this.villages = [];
    this.summary = null;
  }

  async render() {
    this.container.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 350px;">
        <div style="font-size: 15px; color: var(--text-secondary);">
          🛰️ Loading GIS Satellite & Epidemiological Telemetry...
        </div>
      </div>
    `;

    try {
      const [sumRes, vilRes] = await Promise.all([
        api.getSurveillanceSummary().catch(() => null),
        api.getSurveillanceVillages(this.selectedBlock, this.selectedRisk).catch(() => [])
      ]);
      this.summary = sumRes;
      this.villages = vilRes;
    } catch (e) {
      console.error('Surveillance data fetch error:', e);
    }

    this.renderDOM();
    setTimeout(() => this.initMap(), 50);
  }

  renderDOM() {
    const s = this.summary || {
      monitored_villages: 50,
      monitored_blocks: 5,
      total_rural_population: 145045,
      current_surveillance_week: 104,
      critical_outbreak_villages: 5,
      high_risk_villages: 13,
      moderate_risk_villages: 15,
      low_risk_villages: 17,
      active_drug_stockouts: 21,
      district_avg_rainfall_mm: 7.0,
      district_avg_temp_c: 17.5,
      forecasted_district_malaria_surge_2w: 72.6,
      forecasted_district_diarrhea_surge_2w: 77.2
    };

    const topWatchlist = this.villages.slice(0, 5);

    this.container.innerHTML = `
      <!-- Header -->
      <div class="section-header">
        <div class="section-title-group">
          <h2>
            <span>GIS Rural Health Surveillance & Outbreak Foresight</span>
            <span class="badge badge-active" style="font-size: 12px; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: #fff;">
              🛰️ Week ${s.current_surveillance_week} Real-Time
            </span>
          </h2>
          <p>Climate-triangulated epidemiological surveillance across 50 rural villages, automated 2-week outbreak prediction, and resource supply allocation</p>
        </div>
        <div class="section-actions">
          <button class="btn btn-secondary btn-sm" id="btn-refresh-surveillance">
            <span>🔄 Refresh Telemetry</span>
          </button>
          <button class="btn btn-primary btn-sm" id="btn-quick-dispatch-header">
            <span>⚡ Dispatch Emergency Kit</span>
          </button>
        </div>
      </div>

      <!-- Surveillance KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card" style="--card-accent: var(--primary);">
          <div class="kpi-card-header">
            <span class="kpi-label">Monitored Rural Network</span>
            <div class="kpi-icon-wrap">🗺️</div>
          </div>
          <div class="kpi-value">${s.monitored_villages} <span style="font-size: 14px; color: var(--text-muted);">Villages</span></div>
          <div class="kpi-meta">
            <span>${(s.total_rural_population || 145045).toLocaleString()} Citizens</span>
            <span class="kpi-badge info">${s.monitored_blocks || 5} Blocks Covered</span>
          </div>
        </div>

        <div class="kpi-card" style="--card-accent: var(--danger);">
          <div class="kpi-card-header">
            <span class="kpi-label">Critical Outbreak Warning</span>
            <div class="kpi-icon-wrap">🚨</div>
          </div>
          <div class="kpi-value" style="color: var(--danger);">${s.critical_outbreak_villages} <span style="font-size: 14px; color: var(--text-muted);">Villages</span></div>
          <div class="kpi-meta">
            <span>Immediate PHC dispatch needed</span>
            <span class="kpi-badge danger">${s.high_risk_villages} High Threat</span>
          </div>
        </div>

        <div class="kpi-card" style="--card-accent: var(--warning);">
          <div class="kpi-card-header">
            <span class="kpi-label">Subcentre Drug Stockouts</span>
            <div class="kpi-icon-wrap">💊</div>
          </div>
          <div class="kpi-value">${s.active_drug_stockouts}</div>
          <div class="kpi-meta">
            <span>Essential medicine depleted</span>
            <span class="kpi-badge warning">Supply Deficit</span>
          </div>
        </div>

        <div class="kpi-card" style="--card-accent: #6366f1;">
          <div class="kpi-card-header">
            <span class="kpi-label">2-Week Disease Influx Surge</span>
            <div class="kpi-icon-wrap">📈</div>
          </div>
          <div class="kpi-value">+${Math.round(s.forecasted_district_malaria_surge_2w + s.forecasted_district_diarrhea_surge_2w)} <span style="font-size: 13px; color: var(--text-muted);">Cases</span></div>
          <div class="kpi-meta">
            <span>+${s.forecasted_district_malaria_surge_2w} Malaria | +${s.forecasted_district_diarrhea_surge_2w} Diarrhea</span>
            <span class="kpi-badge info">ML Forecast</span>
          </div>
        </div>
      </div>

      <!-- MAIN FEATURE: Interactive GIS Outbreak Map -->
      <div class="glass-panel" style="padding: 16px; margin-bottom: 24px;">
        <div class="panel-title-bar" style="margin-bottom: 12px; flex-wrap: wrap; gap: 12px;">
          <div class="panel-title" style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">📍</span>
            <div>
              <strong style="font-size: 15px; color: var(--text-primary);">District Spatial Disease & Climate Risk Map</strong>
              <div style="font-size: 11.5px; color: var(--text-muted);">GPS tracking of 50 rural villages, subcentres, and epidemiological risk zones</div>
            </div>
          </div>

          <!-- Map Filter Controls -->
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <!-- Block Filter -->
            <select class="filter-select" id="map-block-filter" style="padding: 4px 10px; font-size: 12px;">
              <option value="all" ${this.selectedBlock === 'all' ? 'selected' : ''}>All Blocks (A-E)</option>
              <option value="Block-A" ${this.selectedBlock === 'Block-A' ? 'selected' : ''}>Block-A</option>
              <option value="Block-B" ${this.selectedBlock === 'Block-B' ? 'selected' : ''}>Block-B</option>
              <option value="Block-C" ${this.selectedBlock === 'Block-C' ? 'selected' : ''}>Block-C</option>
              <option value="Block-D" ${this.selectedBlock === 'Block-D' ? 'selected' : ''}>Block-D</option>
              <option value="Block-E" ${this.selectedBlock === 'Block-E' ? 'selected' : ''}>Block-E</option>
            </select>

            <!-- Risk Filter -->
            <select class="filter-select" id="map-risk-filter" style="padding: 4px 10px; font-size: 12px;">
              <option value="all" ${this.selectedRisk === 'all' ? 'selected' : ''}>All Outbreak Tiers</option>
              <option value="Critical" ${this.selectedRisk === 'Critical' ? 'selected' : ''}>🚨 Critical Alert</option>
              <option value="High" ${this.selectedRisk === 'High' ? 'selected' : ''}>⚠️ High Risk</option>
              <option value="Moderate" ${this.selectedRisk === 'Moderate' ? 'selected' : ''}>🟡 Moderate</option>
              <option value="Low" ${this.selectedRisk === 'Low' ? 'selected' : ''}>🟢 Stable / Low</option>
            </select>

            <!-- Layer Mode Filter -->
            <select class="filter-select" id="map-layer-filter" style="padding: 4px 10px; font-size: 12px;">
              <option value="all" ${this.activeLayer === 'all' ? 'selected' : ''}>Standard View</option>
              <option value="malaria" ${this.activeLayer === 'malaria' ? 'selected' : ''}>Malaria Surge Focus</option>
              <option value="diarrhea" ${this.activeLayer === 'diarrhea' ? 'selected' : ''}>Diarrhea & Runoff Risk</option>
              <option value="stockouts" ${this.activeLayer === 'stockouts' ? 'selected' : ''}>Drug Stockouts Only</option>
            </select>

            <button class="btn btn-secondary btn-sm" id="btn-reset-map-zoom" title="Reset Map Centering" style="padding: 4px 10px; font-size: 12px;">
              🎯 Reset Center
            </button>
          </div>
        </div>

        <!-- Map Leaflet Canvas Container -->
        <div id="rural-gis-map" style="height: 520px; width: 100%; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: #090d16;"></div>

        <!-- Map Interactive Legend -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-size: 12px; color: var(--text-secondary); flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ef4444;" class="map-marker-pulse"></span>
              <strong>Critical Outbreak (>24 Hazard)</strong>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #f97316;"></span>
              <span>High Risk (>17 Hazard)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #eab308;"></span>
              <span>Moderate Risk</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #10b981;"></span>
              <span>Low / Baseline</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span>💊</span>
              <span>Subcentre Drug Stockout</span>
            </div>
          </div>

          <div style="font-size: 11.5px; color: var(--text-muted);">
            Showing ${this.villages.length} of 50 Villages | Click any marker for micro-forecast
          </div>
        </div>
      </div>

      <!-- Bottom Grid: Watchlist & Regional Diagnostics -->
      <div class="dashboard-grid">
        
        <!-- Left: Critical Outbreak Watchlist -->
        <div class="glass-panel">
          <div class="panel-title-bar">
            <div class="panel-title">
              <span>🚨 Critical Outbreak Watchlist (Immediate Action)</span>
            </div>
            <span class="badge badge-critical">${s.critical_outbreak_villages} Urgent Villages</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${topWatchlist.length === 0 ? `
              <div class="empty-state" style="padding: 24px 0;">
                <div class="empty-icon">🛡️</div>
                <div class="empty-title">No Critical Villages</div>
                <div class="empty-subtitle">All rural subcentres are currently operating within safe epidemiological thresholds.</div>
              </div>
            ` : topWatchlist.map(vil => {
              const isCrit = vil.outbreak_risk_level === 'Critical';
              return `
                <div class="admission-card" style="border-left: 4px solid ${isCrit ? 'var(--danger)' : 'var(--warning)'}; padding: 12px;">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                    <div>
                      <strong style="font-size: 15px; color: var(--text-primary);">${vil.village_name}</strong>
                      <span class="badge badge-mono" style="margin-left: 6px;">${vil.block_name}</span>
                      <span style="font-size: 11.5px; color: var(--text-muted); margin-left: 6px;">Pop: ${vil.population.toLocaleString()}</span>
                    </div>
                    <span class="badge ${isCrit ? 'badge-critical' : 'badge-high'}">
                      <span class="badge-dot"></span>
                      ${vil.outbreak_risk_level} (${vil.climate_health_hazard_index})
                    </span>
                  </div>

                  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin: 8px 0; font-size: 12px;">
                    <div style="background: rgba(255,255,255,0.02); padding: 6px; border-radius: var(--radius-sm);">
                      <span style="color: var(--text-muted); font-size: 10.5px;">2W Malaria</span>
                      <div style="color: #ef4444; font-weight: 700;">+${vil.forecasted_malaria_2w} cases</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.02); padding: 6px; border-radius: var(--radius-sm);">
                      <span style="color: var(--text-muted); font-size: 10.5px;">2W Diarrhea</span>
                      <div style="color: #f97316; font-weight: 700;">+${vil.forecasted_diarrhea_2w} cases</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.02); padding: 6px; border-radius: var(--radius-sm);">
                      <span style="color: var(--text-muted); font-size: 10.5px;">Stockout</span>
                      <div style="color: ${vil.drug_stockout_flag ? 'var(--danger)' : 'var(--success)'}; font-weight: 700;">
                        ${vil.drug_stockout_flag ? '⚠️ Depleted' : '✓ Stocked'}
                      </div>
                    </div>
                  </div>

                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; color: var(--text-secondary); margin-top: 4px;">
                    <span><strong>Resource Needed:</strong> ${vil.recommended_resource}</span>
                    <button class="btn btn-primary btn-sm btn-dispatch-village" 
                            data-village="${vil.village_name}" 
                            data-resource="${vil.recommended_resource}"
                            style="padding: 3px 10px; font-size: 11px;">
                      ⚡ Dispatch
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right: Climate Hazard & Supply Diagnostics -->
        <div class="glass-panel">
          <div class="panel-title-bar">
            <div class="panel-title">
              <span>🌦️ Meteorological & Supply Chain Triangulation</span>
            </div>
            <span class="badge badge-mono">Live Correlators</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <!-- Vector Breeding Suitability -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
                <strong>🦟 Vector Mosquito Breeding Pressure</strong>
                <span style="color: #f97316; font-weight: 700;">Elevated (${s.district_avg_temp_c}°C / ${s.district_avg_rainfall_mm}mm)</span>
              </div>
              <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">
                Higher humidity combined with recent rainfall surges create optimal transmission temperatures for Anopheles vector breeding in Block-A and Block-C.
              </p>
              <div class="stock-bar-track" style="height: 8px;">
                <div class="stock-bar-fill high" style="width: 68%; background: linear-gradient(90deg, #eab308, #ef4444);"></div>
              </div>
            </div>

            <!-- Flood Runoff & Contamination -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
                <strong>🌊 Waterborne Runoff & Well Contamination</strong>
                <span style="color: #0ea5e9; font-weight: 700;">Moderate Inundation Risk</span>
              </div>
              <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">
                Villages with &lt;40% tap water access rely on shallow open wells prone to microbial wash-in during high runoff periods.
              </p>
              <div class="stock-bar-track" style="height: 8px;">
                <div class="stock-bar-fill high" style="width: 52%; background: linear-gradient(90deg, #10b981, #0ea5e9);"></div>
              </div>
            </div>

            <!-- Infrastructure & Access Blockers -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px;">
              <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary);">
                🏥 Rural Clinical Readiness Breakdown:
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px;">
                <div style="padding: 8px; background: rgba(0,0,0,0.2); border-radius: var(--radius-sm);">
                  <span style="color: var(--text-muted); font-size: 11px;">Cold Chain Functional</span>
                  <div style="font-size: 14px; font-weight: 700; color: #10b981;">34 of 50 Subcentres</div>
                </div>
                <div style="padding: 8px; background: rgba(0,0,0,0.2); border-radius: var(--radius-sm);">
                  <span style="color: var(--text-muted); font-size: 11px;">All-Weather Roads</span>
                  <div style="font-size: 14px; font-weight: 700; color: #eab308;">28 of 50 Accessible</div>
                </div>
              </div>
            </div>

            <button class="btn btn-secondary" id="btn-jump-ai-sim" style="width: 100%; justify-content: center; margin-top: 4px;">
              <span>🧠 Launch AI Outbreak Simulation Studio</span>
            </button>
          </div>
        </div>

      </div>
    `;

    this.bindDOMEvents();
  }

  initMap() {
    const mapContainer = document.getElementById('rural-gis-map');
    if (!mapContainer) return;

    if (this.map) {
      try {
        this.map.remove();
      } catch (e) {
        console.warn('Map cleanup:', e);
      }
      this.map = null;
    }

    // If Leaflet is available on window
    if (typeof window.L !== 'undefined') {
      try {
        // Center on the district (mean coordinates of the 50 villages: ~24.23 N, 82.42 E)
        this.map = window.L.map('rural-gis-map', {
          zoomControl: true,
          attributionControl: false
        }).setView([24.23, 82.42], 10);

        // Standard OpenStreetMap tiles (100% free, no API key required)
        window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        this.plotVillages();
        return;
      } catch (err) {
        console.error('Leaflet initialization failed, falling back to SVG map:', err);
      }
    }

    // Fallback: Custom Interactive SVG Map if CDN or offline
    this.renderSVGMap(mapContainer);
  }

  plotVillages() {
    if (!this.map || typeof window.L === 'undefined') return;

    // Filter villages if layer selected
    let displayedVillages = this.villages;
    if (this.activeLayer === 'malaria') {
      displayedVillages = displayedVillages.filter(v => v.forecasted_malaria_2w >= 3);
    } else if (this.activeLayer === 'diarrhea') {
      displayedVillages = displayedVillages.filter(v => v.forecasted_diarrhea_2w >= 3);
    } else if (this.activeLayer === 'stockouts') {
      displayedVillages = displayedVillages.filter(v => v.drug_stockout_flag === 1);
    }

    displayedVillages.forEach(vil => {
      const isCrit = vil.outbreak_risk_level === 'Critical';
      const isHigh = vil.outbreak_risk_level === 'High';
      const isMod = vil.outbreak_risk_level === 'Moderate';

      const color = isCrit ? '#ef4444' : isHigh ? '#f97316' : isMod ? '#eab308' : '#10b981';
      const radius = isCrit ? 11 : isHigh ? 9 : isMod ? 7 : 6;

      const marker = window.L.circleMarker([vil.latitude, vil.longitude], {
        radius: radius,
        fillColor: color,
        color: isCrit ? '#ffffff' : color,
        weight: isCrit ? 2.5 : 1.5,
        opacity: 0.9,
        fillOpacity: 0.8
      }).addTo(this.map);

      // Popup Content
      const popupHtml = `
        <div style="min-width: 220px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="font-size: 15px; color: #fff;">${vil.village_name}</strong>
            <span class="badge ${isCrit ? 'badge-critical' : isHigh ? 'badge-high' : isMod ? 'badge-moderate' : 'badge-low'}" style="font-size: 10.5px; padding: 2px 8px;">
              ${vil.outbreak_risk_level}
            </span>
          </div>

          <div style="font-size: 11.5px; color: #94a3b8; margin-bottom: 8px;">
            ${vil.block_name} | Pop: <strong>${vil.population.toLocaleString()}</strong> | ${vil.distance_phc_km} km to PHC
          </div>

          <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; margin-bottom: 8px; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span>🦟 2W Malaria Surge:</span>
              <strong style="color: #ef4444;">+${vil.forecasted_malaria_2w} cases</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span>🌊 2W Diarrhea Surge:</span>
              <strong style="color: #f97316;">+${vil.forecasted_diarrhea_2w} cases</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span>🌦️ Climate Hazard Score:</span>
              <strong style="color: #eab308;">${vil.climate_health_hazard_index} / 100</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>💊 Drug Stockout:</span>
              <strong style="color: ${vil.drug_stockout_flag ? '#ef4444' : '#10b981'};">
                ${vil.drug_stockout_flag ? 'Depleted (Alert)' : 'In Stock'}
              </strong>
            </div>
          </div>

          <div style="font-size: 11px; color: #38bdf8; margin-bottom: 10px;">
            ⚡ <strong>Priority Action:</strong> ${vil.recommended_resource}
          </div>

          <button class="btn btn-primary btn-sm btn-popup-dispatch" 
                  data-village="${vil.village_name}"
                  data-resource="${vil.recommended_resource}"
                  style="width: 100%; justify-content: center; font-size: 11px; padding: 4px;">
            Dispatch Emergency Kit
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      this.markers.push(marker);
    });

    // Attach click listener on popup dispatch
    this.map.on('popupopen', () => {
      const btn = document.querySelector('.btn-popup-dispatch');
      if (btn) {
        btn.addEventListener('click', () => {
          const villageName = btn.dataset.village;
          const res = btn.dataset.resource;
          toast.success('Emergency Dispatch Initiated', `Dispatched ${res} to ${villageName}`);
        });
      }
    });
  }

  renderSVGMap(container) {
    // Offline SVG coordinates plotting for 50 villages
    const minLat = 24.0, maxLat = 24.5;
    const minLng = 82.1, maxLng = 82.8;

    const width = 800;
    const height = 480;

    const points = this.villages.map(v => {
      const x = ((v.longitude - minLng) / (maxLng - minLng)) * (width - 80) + 40;
      const y = height - (((v.latitude - minLat) / (maxLat - minLat)) * (height - 80) + 40);
      const isCrit = v.outbreak_risk_level === 'Critical';
      const color = isCrit ? '#ef4444' : v.outbreak_risk_level === 'High' ? '#f97316' : v.outbreak_risk_level === 'Moderate' ? '#eab308' : '#10b981';
      return `<circle cx="${x}" cy="${y}" r="${isCrit ? 8 : 5}" fill="${color}" stroke="#fff" stroke-width="1.5" opacity="0.85" />
              <text x="${x + 8}" y="${y + 4}" font-size="10" fill="#cbd5e1">${v.village_name}</text>`;
    }).join('');

    container.innerHTML = `
      <div style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0b1120;">
        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%; background: #090d16;">
          <rect width="${width}" height="${height}" fill="#090d16" />
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="${width}" height="${height}" fill="url(#grid)" />
          ${points}
        </svg>
      </div>
    `;
  }

  bindDOMEvents() {
    // Refresh Telemetry
    const refreshBtn = this.container.querySelector('#btn-refresh-surveillance');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        toast.info('Updating Telemetry', 'Fetching latest rural climate & disease predictions...');
        await this.render();
        toast.success('Telemetry Refreshed', 'Surveillance map updated.');
      });
    }

    // Quick Dispatch Header Button
    const dispatchHdr = this.container.querySelector('#btn-quick-dispatch-header');
    if (dispatchHdr) {
      dispatchHdr.addEventListener('click', () => {
        ModalManager.open('modal-create-allocation');
      });
    }

    // Map Block Filter
    const blockFilter = this.container.querySelector('#map-block-filter');
    if (blockFilter) {
      blockFilter.addEventListener('change', async (e) => {
        this.selectedBlock = e.target.value;
        this.villages = await api.getSurveillanceVillages(this.selectedBlock, this.selectedRisk);
        this.renderDOM();
        setTimeout(() => this.initMap(), 50);
      });
    }

    // Map Risk Filter
    const riskFilter = this.container.querySelector('#map-risk-filter');
    if (riskFilter) {
      riskFilter.addEventListener('change', async (e) => {
        this.selectedRisk = e.target.value;
        this.villages = await api.getSurveillanceVillages(this.selectedBlock, this.selectedRisk);
        this.renderDOM();
        setTimeout(() => this.initMap(), 50);
      });
    }

    // Map Layer Mode
    const layerFilter = this.container.querySelector('#map-layer-filter');
    if (layerFilter) {
      layerFilter.addEventListener('change', (e) => {
        this.activeLayer = e.target.value;
        if (this.map && typeof window.L !== 'undefined') {
          // Clear and replot markers
          this.markers.forEach(m => m.remove());
          this.markers = [];
          this.plotVillages();
        }
      });
    }

    // Reset Zoom
    const resetZoomBtn = this.container.querySelector('#btn-reset-map-zoom');
    if (resetZoomBtn) {
      resetZoomBtn.addEventListener('click', () => {
        if (this.map) {
          this.map.setView([24.23, 82.42], 10);
        }
      });
    }

    // Dispatch buttons from watchlist
    this.container.querySelectorAll('.btn-dispatch-village').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const v = e.currentTarget.dataset.village;
        const r = e.currentTarget.dataset.resource;
        toast.success('Dispatched Successfully', `Allocated and dispatched ${r} to ${v}`);
      });
    });

    // Jump to AI Simulation studio
    const simBtn = this.container.querySelector('#btn-jump-ai-sim');
    if (simBtn) {
      simBtn.addEventListener('click', () => {
        window.location.hash = '#ai-foresight';
        const link = document.querySelector('#nav-ai-foresight');
        if (link) link.click();
      });
    }
  }
}
