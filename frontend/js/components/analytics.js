/**
 * Healthcare Resource Management System - Capacity Analytics & Diagnostics Component
 * Department Load Distribution, Resource Utilization Rates & Live System Diagnostics
 */

import { state } from '../state.js';
import { api } from '../api.js';
import { toast } from '../utils/toast.js';

export class AnalyticsComponent {
  constructor(container) {
    this.container = container;
  }

  render() {
    const metrics = state.getMetrics();
    const deptDist = state.getDepartmentDistribution();
    const sevDist = state.getSeverityDistribution();

    const depts = Object.keys(deptDist);
    const maxDeptCount = Math.max(...Object.values(deptDist), 1);

    this.container.innerHTML = `
      <div class="section-header">
        <div class="section-title-group">
          <h2>
            <span>Capacity Analytics & Hospital Intelligence</span>
            <span class="badge badge-active">Real-time Analytics</span>
          </h2>
          <p>Holistic capacity monitoring, departmental patient density, equipment utilization, and backend health diagnostic telemetry</p>
        </div>
      </div>

      <!-- Overview Stats -->
      <div class="kpi-grid">
        <div class="kpi-card" style="--card-accent: var(--primary);">
          <div class="kpi-card-header">
            <span class="kpi-label">Patient Turnover</span>
            <div class="kpi-icon-wrap">🔄</div>
          </div>
          <div class="kpi-value">${metrics.totalAdmissions > 0 ? Math.round((metrics.dischargedCount / metrics.totalAdmissions) * 100) : 0}%</div>
          <div class="kpi-meta">
            <span>${metrics.dischargedCount} Discharged of ${metrics.totalAdmissions} Total</span>
            <span class="kpi-badge success">Discharge Efficiency</span>
          </div>
        </div>

        <div class="kpi-card" style="--card-accent: var(--secondary);">
          <div class="kpi-card-header">
            <span class="kpi-label">Bed Occupancy Rate</span>
            <div class="kpi-icon-wrap">🛏️</div>
          </div>
          <div class="kpi-value">${metrics.bedOccupancyRate}%</div>
          <div class="kpi-meta">
            <span>${metrics.occupiedBeds} occupied / ${metrics.totalBeds} capacity</span>
            <span class="kpi-badge ${metrics.bedOccupancyRate > 80 ? 'danger' : 'info'}">Capacity Load</span>
          </div>
        </div>

        <div class="kpi-card" style="--card-accent: var(--warning);">
          <div class="kpi-card-header">
            <span class="kpi-label">Active Deployments</span>
            <div class="kpi-icon-wrap">⚡</div>
          </div>
          <div class="kpi-value">${metrics.activeAllocationsCount}</div>
          <div class="kpi-meta">
            <span>Critical equipment currently assigned</span>
            <span class="kpi-badge warning">Monitored In-Use</span>
          </div>
        </div>

        <div class="kpi-card" style="--card-accent: var(--success);">
          <div class="kpi-card-header">
            <span class="kpi-label">Backend Latency</span>
            <div class="kpi-icon-wrap">📶</div>
          </div>
          <div class="kpi-value">${api.lastLatency !== null ? api.lastLatency + ' ms' : '< 5 ms'}</div>
          <div class="kpi-meta">
            <span>REST API Ping Response</span>
            <span class="kpi-badge ${api.isOnline ? 'success' : 'danger'}">
              ${api.isOnline ? 'Operational' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <!-- Charts & Visual Analytics Grid -->
      <div class="dashboard-grid">
        <!-- Department Distribution Visual Bar Chart -->
        <div class="glass-panel">
          <div class="panel-title-bar">
            <div class="panel-title">
              <span>📊 Departmental Patient Density</span>
            </div>
            <span class="badge badge-mono">${depts.length} Active Wards</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px; padding: 8px 0;">
            ${depts.length === 0 ? `
              <div class="empty-state" style="padding: 24px 0;">
                <div class="empty-icon">📈</div>
                <div class="empty-title">No Department Data</div>
                <div class="empty-subtitle">Admit patients across hospital departments to visualize census distribution.</div>
              </div>
            ` : depts.map(dept => {
              const count = deptDist[dept];
              const pct = Math.round((count / maxDeptCount) * 100);
              return `
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div style="display: flex; justify-content: space-between; font-size: 13px;">
                    <span style="font-weight: 600; color: var(--text-primary);">${dept}</span>
                    <strong style="color: var(--primary);">${count} Patients</strong>
                  </div>
                  <div class="stock-bar-track" style="height: 10px;">
                    <div class="stock-bar-fill high" style="width: ${pct}%; background: linear-gradient(90deg, var(--primary), var(--secondary));"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Severity Distribution Breakdown -->
        <div class="glass-panel">
          <div class="panel-title-bar">
            <div class="panel-title">
              <span>🩺 Triage Severity Distribution</span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px; padding: 8px 0;">
            <!-- Critical -->
            <div style="background: var(--severity-critical-bg); border: 1px solid rgba(239,68,68,0.3); border-radius: var(--radius-md); padding: 12px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--severity-critical); font-size: 14px;">Critical Severity</strong>
                <div style="font-size: 11.5px; color: var(--text-muted);">Requires immediate ICU & ventilator support</div>
              </div>
              <span class="badge badge-critical" style="font-size: 14px; font-weight: 700; padding: 4px 12px;">
                ${sevDist.Critical}
              </span>
            </div>

            <!-- High -->
            <div style="background: var(--severity-high-bg); border: 1px solid rgba(249,115,22,0.3); border-radius: var(--radius-md); padding: 12px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--severity-high); font-size: 14px;">High Urgency</strong>
                <div style="font-size: 11.5px; color: var(--text-muted);">Intensive surveillance & specialized medication</div>
              </div>
              <span class="badge badge-high" style="font-size: 14px; font-weight: 700; padding: 4px 12px;">
                ${sevDist.High}
              </span>
            </div>

            <!-- Moderate -->
            <div style="background: var(--severity-moderate-bg); border: 1px solid rgba(234,179,8,0.3); border-radius: var(--radius-md); padding: 12px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--severity-moderate); font-size: 14px;">Moderate Severity</strong>
                <div style="font-size: 11.5px; color: var(--text-muted);">Standard telemetry & continuous observations</div>
              </div>
              <span class="badge badge-moderate" style="font-size: 14px; font-weight: 700; padding: 4px 12px;">
                ${sevDist.Moderate}
              </span>
            </div>

            <!-- Low -->
            <div style="background: var(--severity-low-bg); border: 1px solid rgba(16,185,129,0.3); border-radius: var(--radius-md); padding: 12px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--severity-low); font-size: 14px;">Low / Routine</strong>
                <div style="font-size: 11.5px; color: var(--text-muted);">Observation, routine checkups & planned discharges</div>
              </div>
              <span class="badge badge-low" style="font-size: 14px; font-weight: 700; padding: 4px 12px;">
                ${sevDist.Low}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Resource Utilization Deep-Dive Table -->
      <div class="glass-panel" style="margin-top: 24px;">
        <div class="panel-title-bar">
          <div class="panel-title">
            <span>📦 Asset Utilization & Stock Depletion Health</span>
          </div>
        </div>

        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Type</th>
                <th>Total Capacity</th>
                <th>Available</th>
                <th>Allocated / In-Use</th>
                <th>Utilization Rate</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              ${state.resources.map(r => {
                const inUse = Math.max(0, r.quantity_total - r.quantity_available);
                const utilRate = r.quantity_total > 0 ? Math.round((inUse / r.quantity_total) * 100) : 0;
                const isCriticalStock = (r.quantity_available / r.quantity_total) <= 0.2 || r.quantity_available === 0;

                return `
                  <tr>
                    <td><strong>${r.name}</strong></td>
                    <td><span class="badge badge-mono">${r.resource_type}</span></td>
                    <td>${r.quantity_total} ${r.unit || 'units'}</td>
                    <td><strong style="color: ${isCriticalStock ? 'var(--danger)' : 'var(--success)'};">${r.quantity_available}</strong></td>
                    <td>${inUse}</td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span>${utilRate}%</span>
                        <div class="stock-bar-track" style="width: 80px; height: 6px;">
                          <div class="stock-bar-fill ${utilRate > 80 ? 'low' : utilRate > 50 ? 'medium' : 'high'}" style="width: ${utilRate}%;"></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge ${isCriticalStock ? 'badge-critical' : 'badge-available'}">
                        ${isCriticalStock ? 'Low Stock Reserve' : 'Optimal Reserve'}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}
