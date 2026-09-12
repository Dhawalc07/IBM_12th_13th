/**
 * Healthcare Resource Management System - Admissions & Triage Component
 * Clinical Inpatient Tracking, Severity Triage, Discharge Management & Direct Resource Link
 */

import { api } from '../api.js';
import { state } from '../state.js';
import { toast } from '../utils/toast.js';
import { ModalManager } from '../utils/modal.js';

export class AdmissionsComponent {
  constructor(container) {
    this.container = container;
    this.searchQuery = '';
    this.statusFilter = 'all'; // 'all', 'active', 'discharged'
    this.severityFilter = 'all'; // 'all', 'Critical', 'High', 'Moderate', 'Low'
    this.departmentFilter = 'all';
  }

  render() {
    const departments = Array.from(new Set(state.admissions.map(a => a.department).filter(Boolean)));

    const filteredAdmissions = state.admissions.filter(adm => {
      const patient = state.getPatientById(adm.patient_id);
      const q = this.searchQuery.toLowerCase();
      
      const patientName = patient ? `${patient.first_name} ${patient.last_name}`.toLowerCase() : '';
      const mrn = patient && patient.medical_record_number ? patient.medical_record_number.toLowerCase() : '';
      const diagnosis = (adm.diagnosis || '').toLowerCase();
      const department = (adm.department || '').toLowerCase();

      const matchesSearch = !q || 
        patientName.includes(q) || 
        mrn.includes(q) || 
        diagnosis.includes(q) || 
        department.includes(q);

      const matchesStatus = this.statusFilter === 'all' || adm.status === this.statusFilter;
      const matchesSeverity = this.severityFilter === 'all' || 
        (adm.severity_level && adm.severity_level.toLowerCase() === this.severityFilter.toLowerCase());
      const matchesDept = this.departmentFilter === 'all' || adm.department === this.departmentFilter;

      return matchesSearch && matchesStatus && matchesSeverity && matchesDept;
    });

    this.container.innerHTML = `
      <div class="section-header">
        <div class="section-title-group">
          <h2>
            <span>Admissions & Clinical Triage</span>
            <span class="badge badge-mono">${filteredAdmissions.length} Cases</span>
          </h2>
          <p>Monitor patient hospital stays, triage urgency levels, bed assignments, and manage patient discharges</p>
        </div>
        <div class="section-actions">
          <button class="btn btn-primary" id="btn-create-admission">
            <span>+ Admit Patient</span>
          </button>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="table-controls">
        <div class="filters-group" style="flex: 1; max-width: 360px;">
          <input 
            type="text" 
            class="form-input" 
            id="admissions-search-input" 
            placeholder="Search patient, MRN, diagnosis..."
            value="${this.searchQuery}"
            style="width: 100%;"
          />
        </div>
        <div class="filters-group">
          <!-- Status Filter -->
          <select class="filter-select" id="admissions-status-filter">
            <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
            <option value="active" ${this.statusFilter === 'active' ? 'selected' : ''}>Active Inpatients</option>
            <option value="discharged" ${this.statusFilter === 'discharged' ? 'selected' : ''}>Discharged</option>
          </select>

          <!-- Severity Filter -->
          <select class="filter-select" id="admissions-severity-filter">
            <option value="all" ${this.severityFilter === 'all' ? 'selected' : ''}>All Severities</option>
            <option value="Critical" ${this.severityFilter === 'Critical' ? 'selected' : ''}>Critical</option>
            <option value="High" ${this.severityFilter === 'High' ? 'selected' : ''}>High</option>
            <option value="Moderate" ${this.severityFilter === 'Moderate' ? 'selected' : ''}>Moderate</option>
            <option value="Low" ${this.severityFilter === 'Low' ? 'selected' : ''}>Low</option>
          </select>

          <!-- Department Filter -->
          <select class="filter-select" id="admissions-dept-filter">
            <option value="all">All Departments</option>
            ${departments.map(d => `
              <option value="${d}" ${this.departmentFilter === d ? 'selected' : ''}>${d}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Admissions Table -->
      ${filteredAdmissions.length === 0 ? `
        <div class="glass-panel">
          <div class="empty-state">
            <div class="empty-icon">🏥</div>
            <div class="empty-title">No Admissions Found</div>
            <div class="empty-subtitle">No clinical admission records matched your filter criteria. Create a new patient admission or adjust filters.</div>
            <button class="btn btn-primary btn-sm" id="btn-empty-admit" style="margin-top: 12px;">+ Admit Patient</button>
          </div>
        </div>
      ` : `
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Department</th>
                <th>Diagnosis</th>
                <th>Triage Severity</th>
                <th>Admission Date</th>
                <th>Status</th>
                <th>Allocated Equipment</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAdmissions.map(adm => {
                const patient = state.getPatientById(adm.patient_id);
                const allocations = state.getAllocationsForAdmission(adm.id);
                const isCrit = adm.severity_level && adm.severity_level.toLowerCase() === 'critical';
                const isHigh = adm.severity_level && adm.severity_level.toLowerCase() === 'high';
                const sevBadge = isCrit ? 'badge-critical' : isHigh ? 'badge-high' : adm.severity_level === 'Moderate' ? 'badge-moderate' : 'badge-low';

                return `
                  <tr>
                    <td>
                      <div style="font-weight: 600; color: var(--text-primary);">
                        ${patient ? `${patient.first_name} ${patient.last_name}` : `Patient ID #${adm.patient_id}`}
                      </div>
                      ${patient ? `<span class="mrn-badge">${patient.medical_record_number}</span>` : ''}
                    </td>
                    <td>
                      <div style="font-weight: 500;">${adm.department || 'General Ward'}</div>
                    </td>
                    <td>
                      <div style="max-width: 260px; line-height: 1.3;" title="${adm.diagnosis || ''}">
                        ${adm.diagnosis || '<span style="color: var(--text-muted);">Not specified</span>'}
                      </div>
                    </td>
                    <td>
                      <span class="badge ${sevBadge}">
                        <span class="badge-dot"></span>
                        ${adm.severity_level || 'Moderate'}
                      </span>
                    </td>
                    <td>
                      <div>${new Date(adm.admission_date).toLocaleDateString()}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">${new Date(adm.admission_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td>
                      <span class="badge ${adm.status === 'active' ? 'badge-active' : 'badge-discharged'}">
                        ${adm.status}
                      </span>
                      ${adm.discharge_date ? `
                        <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 2px;">
                          Discharged ${new Date(adm.discharge_date).toLocaleDateString()}
                        </div>
                      ` : ''}
                    </td>
                    <td>
                      ${allocations.length > 0 ? (
                        allocations.map(al => {
                          const res = state.getResourceById(al.resource_id);
                          return `<div class="badge badge-allocated" style="margin-bottom: 2px; display: inline-flex;">
                            ${res ? res.name : 'Resource'} (${al.quantity_allocated})
                          </div>`;
                        }).join('')
                      ) : `
                        <span style="font-size: 12px; color: var(--text-muted);">None</span>
                      `}
                    </td>
                    <td style="text-align: right;">
                      <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
                        ${adm.status === 'active' ? `
                          <button class="btn btn-primary btn-sm btn-allocate-for-adm" data-id="${adm.id}" title="Allocate Resource to this Admission">
                            + Allocate
                          </button>
                          <button class="btn btn-secondary btn-sm btn-discharge-adm" data-id="${adm.id}" title="Mark as Discharged">
                            Discharge
                          </button>
                        ` : ''}
                        <button class="btn-icon btn-edit-adm" data-id="${adm.id}" title="Edit Admission">
                          ✏️
                        </button>
                        <button class="btn-icon delete btn-delete-adm" data-id="${adm.id}" title="Delete Admission">
                          🗑️
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
    // Search
    const searchInput = this.container.querySelector('#admissions-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
      });
    }

    // Status Filter
    const statusFilter = this.container.querySelector('#admissions-status-filter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.statusFilter = e.target.value;
        this.render();
      });
    }

    // Severity Filter
    const severityFilter = this.container.querySelector('#admissions-severity-filter');
    if (severityFilter) {
      severityFilter.addEventListener('change', (e) => {
        this.severityFilter = e.target.value;
        this.render();
      });
    }

    // Department Filter
    const deptFilter = this.container.querySelector('#admissions-dept-filter');
    if (deptFilter) {
      deptFilter.addEventListener('change', (e) => {
        this.departmentFilter = e.target.value;
        this.render();
      });
    }

    // Admit Patient Button
    const admitBtn = this.container.querySelector('#btn-create-admission') || this.container.querySelector('#btn-empty-admit');
    if (admitBtn) {
      admitBtn.addEventListener('click', () => {
        this.openCreateAdmissionModal();
      });
    }

    // Allocate for Admission shortcut
    this.container.querySelectorAll('.btn-allocate-for-adm').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const admissionId = Number(e.currentTarget.dataset.id);
        const modal = document.getElementById('modal-create-allocation');
        if (modal) {
          const select = modal.querySelector('#allocation-admission-select');
          if (select) select.value = admissionId;
        }
        ModalManager.open('modal-create-allocation');
      });
    });

    // Discharge Admission Action
    this.container.querySelectorAll('.btn-discharge-adm').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        const admission = state.getAdmissionById(id);
        if (!admission) return;

        const patient = state.getPatientById(admission.patient_id);
        const patientName = patient ? `${patient.first_name} ${patient.last_name}` : `Patient #${admission.patient_id}`;

        ModalManager.confirm({
          title: `Discharge Inpatient?`,
          message: `Confirm discharge for <strong>${patientName}</strong> from <strong>${admission.department || 'Ward'}</strong>? This will set the discharge timestamp to now.`,
          confirmText: 'Discharge Patient',
          onConfirm: async () => {
            try {
              await api.updateAdmission(id, {
                patient_id: admission.patient_id,
                admission_date: admission.admission_date,
                discharge_date: new Date().toISOString(),
                department: admission.department,
                diagnosis: admission.diagnosis,
                severity_level: admission.severity_level,
                status: "discharged"
              });
              toast.success('Patient Discharged', `Successfully processed discharge for ${patientName}`);
              await state.fetchAll();
            } catch (err) {
              toast.error('Discharge Failed', err.message);
            }
          }
        });
      });
    });

    // Edit Admission
    this.container.querySelectorAll('.btn-edit-adm').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        const admission = state.getAdmissionById(id);
        if (!admission) return;

        this.openEditAdmissionModal(admission);
      });
    });

    // Delete Admission
    this.container.querySelectorAll('.btn-delete-adm').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        ModalManager.confirm({
          title: 'Delete Admission Record?',
          message: 'Are you sure you want to delete this admission record? This action cannot be undone.',
          confirmText: 'Delete Admission',
          isDanger: true,
          onConfirm: async () => {
            try {
              await api.deleteAdmission(id);
              toast.success('Admission Deleted', 'Admission record removed');
              await state.fetchAll();
            } catch (err) {
              toast.error('Deletion Failed', err.message);
            }
          }
        });
      });
    });
  }

  openCreateAdmissionModal() {
    const form = document.getElementById('form-admission');
    if (!form) return;

    form.reset();
    document.getElementById('admission-form-id').value = '';
    document.getElementById('admission-modal-title').textContent = 'Admit Patient';

    // Populate patient select dropdown
    const patientSelect = document.getElementById('admission-patient-select');
    if (patientSelect) {
      patientSelect.innerHTML = `
        <option value="">-- Select Patient --</option>
        ${state.patients.map(p => `
          <option value="${p.id}">${p.first_name} ${p.last_name} (${p.medical_record_number})</option>
        `).join('')}
      `;
    }

    // Set default admission date to current local datetime-local
    const now = new Date();
    const formattedDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('admission-date').value = formattedDate;

    ModalManager.open('modal-create-admission');
  }

  openEditAdmissionModal(admission) {
    const form = document.getElementById('form-admission');
    if (!form) return;

    document.getElementById('admission-form-id').value = admission.id;
    document.getElementById('admission-modal-title').textContent = 'Edit Admission Details';

    const patientSelect = document.getElementById('admission-patient-select');
    if (patientSelect) {
      patientSelect.innerHTML = `
        ${state.patients.map(p => `
          <option value="${p.id}" ${p.id === admission.patient_id ? 'selected' : ''}>
            ${p.first_name} ${p.last_name} (${p.medical_record_number})
          </option>
        `).join('')}
      `;
    }

    if (admission.admission_date) {
      const d = new Date(admission.admission_date);
      document.getElementById('admission-date').value = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }
    
    document.getElementById('admission-dept').value = admission.department || '';
    document.getElementById('admission-diagnosis').value = admission.diagnosis || '';
    document.getElementById('admission-severity').value = admission.severity_level || 'Moderate';
    document.getElementById('admission-status').value = admission.status || 'active';

    ModalManager.open('modal-create-admission');
  }
}
