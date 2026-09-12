/**
 * Healthcare Resource Management System - Resource Allocations Matrix Component
 * Direct Asset Dispatch, Live Inventory Decrement & Automatic Stock Restoration on Return
 */

import { api } from '../api.js';
import { state } from '../state.js';
import { toast } from '../utils/toast.js';
import { ModalManager } from '../utils/modal.js';

export class AllocationsComponent {
  constructor(container) {
    this.container = container;
    this.searchQuery = '';
    this.statusFilter = 'all'; // 'all', 'allocated', 'returned'
  }

  render() {
    const filteredAllocations = state.allocations.filter(al => {
      const q = this.searchQuery.toLowerCase();
      const res = state.getResourceById(al.resource_id);
      const adm = state.getAdmissionById(al.admission_id);
      const patient = adm ? state.getPatientById(adm.patient_id) : null;

      const resName = res ? res.name.toLowerCase() : '';
      const patName = patient ? `${patient.first_name} ${patient.last_name}`.toLowerCase() : '';
      const notes = (al.notes || '').toLowerCase();
      const dept = adm && adm.department ? adm.department.toLowerCase() : '';

      const matchesSearch = !q || 
        resName.includes(q) || 
        patName.includes(q) || 
        notes.includes(q) || 
        dept.includes(q);

      const matchesStatus = this.statusFilter === 'all' || al.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.container.innerHTML = `
      <div class="section-header">
        <div class="section-title-group">
          <h2>
            <span>Equipment Allocation & Dispatch Matrix</span>
            <span class="badge badge-mono">${filteredAllocations.length} Allocations</span>
          </h2>
          <p>Assign critical devices and beds to patients, track usage duration, and return equipment into active inventory</p>
        </div>
        <div class="section-actions">
          <button class="btn btn-primary" id="btn-create-allocation">
            <span>⚡ Dispatch / Allocate Equipment</span>
          </button>
        </div>
      </div>

      <!-- Controls -->
      <div class="table-controls">
        <div class="filters-group" style="flex: 1; max-width: 400px;">
          <input 
            type="text" 
            class="form-input" 
            id="allocations-search-input" 
            placeholder="Search equipment, patient, department, notes..."
            value="${this.searchQuery}"
            style="width: 100%;"
          />
        </div>
        <div class="filters-group">
          <select class="filter-select" id="allocations-status-filter">
            <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
            <option value="allocated" ${this.statusFilter === 'allocated' ? 'selected' : ''}>Active In-Use</option>
            <option value="returned" ${this.statusFilter === 'returned' ? 'selected' : ''}>Returned / Completed</option>
          </select>
        </div>
      </div>

      <!-- Allocation Table -->
      ${filteredAllocations.length === 0 ? `
        <div class="glass-panel">
          <div class="empty-state">
            <div class="empty-icon">⚡</div>
            <div class="empty-title">No Resource Allocations Found</div>
            <div class="empty-subtitle">No active equipment or bed allocations match your criteria. Dispatch equipment to an admitted patient.</div>
            <button class="btn btn-primary btn-sm" id="btn-empty-allocate" style="margin-top: 12px;">+ Allocate Equipment</button>
          </div>
        </div>
      ` : `
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Resource Asset</th>
                <th>Quantity</th>
                <th>Patient / Admission</th>
                <th>Department</th>
                <th>Allocation Date</th>
                <th>Status</th>
                <th>Clinical Notes</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAllocations.map(al => {
                const res = state.getResourceById(al.resource_id);
                const adm = state.getAdmissionById(al.admission_id);
                const patient = adm ? state.getPatientById(adm.patient_id) : null;
                const isReturned = al.status === 'returned';

                return `
                  <tr>
                    <td>
                      <div style="font-weight: 600; color: var(--text-primary);">
                        ${res ? res.name : `Resource ID #${al.resource_id}`}
                      </div>
                      <div style="font-size: 11.5px; color: var(--text-muted);">${res ? res.resource_type : ''}</div>
                    </td>
                    <td>
                      <span class="badge badge-active" style="font-size: 12px; font-weight: 700;">
                        ${al.quantity_allocated} ${res ? res.unit || 'units' : ''}
                      </span>
                    </td>
                    <td>
                      <div style="font-weight: 600; color: var(--text-primary);">
                        ${patient ? `${patient.first_name} ${patient.last_name}` : `Admission #${al.admission_id}`}
                      </div>
                      ${patient ? `<span class="mrn-badge">${patient.medical_record_number}</span>` : ''}
                    </td>
                    <td>
                      <div style="font-size: 13px;">${adm ? adm.department || 'Ward' : 'N/A'}</div>
                    </td>
                    <td>
                      <div>${new Date(al.allocation_date).toLocaleDateString()}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">${new Date(al.allocation_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td>
                      <span class="badge ${isReturned ? 'badge-discharged' : 'badge-allocated'}">
                        ${al.status}
                      </span>
                    </td>
                    <td>
                      <div style="max-width: 220px; font-size: 12px; color: var(--text-secondary);" title="${al.notes || ''}">
                        ${al.notes || '<span style="color: var(--text-muted);">None</span>'}
                      </div>
                    </td>
                    <td style="text-align: right;">
                      <div style="display: flex; gap: 6px; justify-content: flex-end;">
                        <button class="btn btn-danger btn-sm btn-release-allocation" data-id="${al.id}" title="Release resource and restore available inventory">
                          Release & Restore
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;

    this.bindEvents();
  }

  bindEvents() {
    const searchInput = this.container.querySelector('#allocations-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
      });
    }

    const statusFilter = this.container.querySelector('#allocations-status-filter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.statusFilter = e.target.value;
        this.render();
      });
    }

    const createBtn = this.container.querySelector('#btn-create-allocation') || this.container.querySelector('#btn-empty-allocate');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        this.openCreateAllocationModal();
      });
    }

    // Release / Delete Allocation
    this.container.querySelectorAll('.btn-release-allocation').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        const al = state.allocations.find(a => a.id === id);
        const res = al ? state.getResourceById(al.resource_id) : null;
        const resName = res ? res.name : 'Resource';

        ModalManager.confirm({
          title: 'Release & Return Equipment?',
          message: `Are you sure you want to release <strong>${al ? al.quantity_allocated : ''}x ${resName}</strong> back into the hospital available stock?`,
          confirmText: 'Release Asset',
          isDanger: true,
          onConfirm: async () => {
            try {
              await api.deleteResourceAllocation(id);
              toast.success('Resource Released', `Restored ${al ? al.quantity_allocated : ''}x ${resName} to available inventory.`);
              await state.fetchAll();
            } catch (err) {
              toast.error('Release Failed', err.message);
            }
          }
        });
      });
    });
  }

  openCreateAllocationModal() {
    const form = document.getElementById('form-allocation');
    if (!form) return;

    form.reset();

    // Populate Admission Select with active admissions
    const admSelect = document.getElementById('allocation-admission-select');
    if (admSelect) {
      const activeAdms = state.admissions.filter(a => a.status === 'active');
      admSelect.innerHTML = `
        <option value="">-- Select Active Inpatient Admission --</option>
        ${activeAdms.map(adm => {
          const patient = state.getPatientById(adm.patient_id);
          const name = patient ? `${patient.first_name} ${patient.last_name} (${patient.medical_record_number})` : `Patient #${adm.patient_id}`;
          return `
            <option value="${adm.id}">
              ${name} - ${adm.department || 'Ward'} (${adm.severity_level || 'Moderate'})
            </option>
          `;
        }).join('')}
      `;
    }

    // Populate Resource Select
    const resSelect = document.getElementById('allocation-resource-select');
    if (resSelect) {
      resSelect.innerHTML = `
        <option value="">-- Select Medical Resource Asset --</option>
        ${state.resources.map(r => `
          <option value="${r.id}" data-avail="${r.quantity_available}">
            ${r.name} (${r.quantity_available} available of ${r.quantity_total} ${r.unit || 'units'})
          </option>
        `).join('')}
      `;
    }

    ModalManager.open('modal-create-allocation');
  }
}
