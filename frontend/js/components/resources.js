/**
 * Healthcare Resource Management System - Resource Inventory & Equipment Component
 * Stock Health Gauges, Equipment Tracking, Location Tracking & Instant Stock Adjustments
 */

import { api } from '../api.js';
import { state } from '../state.js';
import { toast } from '../utils/toast.js';
import { ModalManager } from '../utils/modal.js';

export class ResourcesComponent {
  constructor(container) {
    this.container = container;
    this.searchQuery = '';
    this.categoryFilter = 'all';
    this.statusFilter = 'all';
  }

  render() {
    const categories = Array.from(new Set(state.resources.map(r => r.resource_type).filter(Boolean)));

    const filteredResources = state.resources.filter(r => {
      const q = this.searchQuery.toLowerCase();
      const matchesSearch = !q || 
        r.name.toLowerCase().includes(q) ||
        (r.resource_type && r.resource_type.toLowerCase().includes(q)) ||
        (r.location && r.location.toLowerCase().includes(q));

      const matchesCat = this.categoryFilter === 'all' || r.resource_type === this.categoryFilter;
      const matchesStatus = this.statusFilter === 'all' || r.status === this.statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });

    this.container.innerHTML = `
      <div class="section-header">
        <div class="section-title-group">
          <h2>
            <span>Medical Equipment & Resource Inventory</span>
            <span class="badge badge-mono">${filteredResources.length} Items</span>
          </h2>
          <p>Track clinical assets, hospital bed availability, emergency reserves, and live stock levels</p>
        </div>
        <div class="section-actions">
          <button class="btn btn-primary" id="btn-create-resource">
            <span>+ Add Resource Asset</span>
          </button>
        </div>
      </div>

      <!-- Controls -->
      <div class="table-controls">
        <div class="filters-group" style="flex: 1; max-width: 400px;">
          <input 
            type="text" 
            class="form-input" 
            id="resources-search-input" 
            placeholder="Search equipment, beds, location..."
            value="${this.searchQuery}"
            style="width: 100%;"
          />
        </div>
        <div class="filters-group">
          <select class="filter-select" id="resources-category-filter">
            <option value="all">All Resource Types</option>
            ${categories.map(c => `
              <option value="${c}" ${this.categoryFilter === c ? 'selected' : ''}>${c}</option>
            `).join('')}
          </select>
          <select class="filter-select" id="resources-status-filter">
            <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
            <option value="available" ${this.statusFilter === 'available' ? 'selected' : ''}>Available</option>
            <option value="low_stock" ${this.statusFilter === 'low_stock' ? 'selected' : ''}>Low Stock</option>
            <option value="maintenance" ${this.statusFilter === 'maintenance' ? 'selected' : ''}>Maintenance</option>
          </select>
        </div>
      </div>

      <!-- Inventory Grid -->
      ${filteredResources.length === 0 ? `
        <div class="glass-panel">
          <div class="empty-state">
            <div class="empty-icon">📦</div>
            <div class="empty-title">No Resources Found</div>
            <div class="empty-subtitle">No equipment or hospital resources matched your filters. Add a new asset or reset filters.</div>
            <button class="btn btn-primary btn-sm" id="btn-empty-add-res" style="margin-top: 12px;">+ Add Resource</button>
          </div>
        </div>
      ` : `
        <div class="cards-grid">
          ${filteredResources.map(res => {
            const ratio = res.quantity_total > 0 ? Math.round((res.quantity_available / res.quantity_total) * 100) : 0;
            const isLow = ratio <= 25 || res.quantity_available === 0;
            const isMedium = ratio > 25 && ratio <= 60;
            const fillClass = isLow ? 'low' : isMedium ? 'medium' : 'high';

            return `
              <div class="resource-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                  <div>
                    <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary);">${res.name}</h3>
                    <div style="font-size: 12px; color: var(--primary); font-weight: 600; margin-top: 2px;">
                      ${res.resource_type}
                    </div>
                  </div>
                  <span class="badge ${isLow ? 'badge-critical' : 'badge-available'}">
                    ${res.status || 'available'}
                  </span>
                </div>

                <!-- Stock Gauge -->
                <div class="stock-bar-container" style="margin: 8px 0;">
                  <div class="stock-bar-header">
                    <span style="color: var(--text-secondary); font-size: 12px;">Availability Level</span>
                    <strong style="color: var(--text-primary); font-size: 13px;">
                      ${res.quantity_available} / ${res.quantity_total} ${res.unit || 'units'} (${ratio}%)
                    </strong>
                  </div>
                  <div class="stock-bar-track">
                    <div class="stock-bar-fill ${fillClass}" style="width: ${ratio}%;"></div>
                  </div>
                </div>

                <!-- Location & Metadata -->
                <div style="font-size: 12.5px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
                  <div><strong>Location:</strong> ${res.location || 'Central Hospital Bay'}</div>
                  <div><strong>Asset Unit:</strong> ${res.unit || 'Standard'}</div>
                </div>

                <!-- Quick Stock Buttons & Actions -->
                <div style="padding-top: 12px; border-top: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; gap: 4px; align-items: center;">
                    <span style="font-size: 11px; color: var(--text-muted); margin-right: 4px;">Quick Adjust:</span>
                    <button class="btn btn-secondary btn-sm btn-quick-stock" data-id="${res.id}" data-change="-1" title="Decrease Available Stock (-1)">
                      -1
                    </button>
                    <button class="btn btn-secondary btn-sm btn-quick-stock" data-id="${res.id}" data-change="1" title="Increase Available Stock (+1)">
                      +1
                    </button>
                  </div>
                  <div style="display: flex; gap: 6px;">
                    <button class="btn-icon btn-edit-res" data-id="${res.id}" title="Edit Resource">✏️</button>
                    <button class="btn-icon delete btn-delete-res" data-id="${res.id}" title="Delete Resource">🗑️</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;

    this.bindEvents();
  }

  bindEvents() {
    const searchInput = this.container.querySelector('#resources-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
      });
    }

    const catFilter = this.container.querySelector('#resources-category-filter');
    if (catFilter) {
      catFilter.addEventListener('change', (e) => {
        this.categoryFilter = e.target.value;
        this.render();
      });
    }

    const statusFilter = this.container.querySelector('#resources-status-filter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.statusFilter = e.target.value;
        this.render();
      });
    }

    const createBtn = this.container.querySelector('#btn-create-resource') || this.container.querySelector('#btn-empty-add-res');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        const form = document.getElementById('form-resource');
        if (form) form.reset();
        document.getElementById('resource-form-id').value = '';
        document.getElementById('resource-modal-title').textContent = 'Add Healthcare Resource';
        ModalManager.open('modal-resource');
      });
    }

    // Quick stock adjustment
    this.container.querySelectorAll('.btn-quick-stock').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = Number(e.currentTarget.dataset.id);
        const change = Number(e.currentTarget.dataset.change);
        const resource = state.getResourceById(id);
        if (!resource) return;

        const newAvail = Math.max(0, Math.min(resource.quantity_total, resource.quantity_available + change));
        
        try {
          await api.updateResource(id, {
            name: resource.name,
            resource_type: resource.resource_type,
            quantity_available: newAvail,
            quantity_total: resource.quantity_total,
            unit: resource.unit,
            location: resource.location,
            status: newAvail === 0 ? 'depleted' : newAvail < resource.quantity_total * 0.25 ? 'low_stock' : 'available'
          });
          toast.success('Stock Updated', `${resource.name} available: ${newAvail}`);
          await state.fetchAll();
        } catch (err) {
          toast.error('Adjustment Failed', err.message);
        }
      });
    });

    // Edit Resource
    this.container.querySelectorAll('.btn-edit-res').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        const res = state.getResourceById(id);
        if (!res) return;

        document.getElementById('resource-form-id').value = res.id;
        document.getElementById('resource-modal-title').textContent = 'Edit Resource Asset';
        document.getElementById('resource-name').value = res.name || '';
        document.getElementById('resource-type').value = res.resource_type || 'Hospital Beds';
        document.getElementById('resource-qty-total').value = res.quantity_total || 0;
        document.getElementById('resource-qty-avail').value = res.quantity_available || 0;
        document.getElementById('resource-unit').value = res.unit || 'Units';
        document.getElementById('resource-location').value = res.location || '';
        document.getElementById('resource-status').value = res.status || 'available';

        ModalManager.open('modal-resource');
      });
    });

    // Delete Resource
    this.container.querySelectorAll('.btn-delete-res').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        const res = state.getResourceById(id);
        if (!res) return;

        ModalManager.confirm({
          title: 'Delete Resource Asset?',
          message: `Are you sure you want to delete <strong>${res.name}</strong>? Any future allocations will be disabled.`,
          confirmText: 'Delete Resource',
          isDanger: true,
          onConfirm: async () => {
            try {
              await api.deleteResource(id);
              toast.success('Resource Deleted', `Removed ${res.name}`);
              await state.fetchAll();
            } catch (err) {
              toast.error('Deletion Failed', err.message);
            }
          }
        });
      });
    });
  }
}
