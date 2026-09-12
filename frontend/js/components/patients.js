/**
 * Healthcare Resource Management System - Patients Directory Component
 * Full CRUD, Medical Record Number (MRN) management, Admissions History & Detailed Inspection
 */

import { api } from '../api.js';
import { state } from '../state.js';
import { toast } from '../utils/toast.js';
import { ModalManager } from '../utils/modal.js';

export class PatientsComponent {
  constructor(container) {
    this.container = container;
    this.viewMode = 'table'; // 'table' or 'grid'
    this.searchQuery = '';
    this.selectedGender = 'all';
  }

  render() {
    const filteredPatients = state.patients.filter(p => {
      const q = this.searchQuery.toLowerCase();
      const matchesSearch = !q || 
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) ||
        (p.medical_record_number && p.medical_record_number.toLowerCase().includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.contact_number && p.contact_number.toLowerCase().includes(q));

      const matchesGender = this.selectedGender === 'all' || 
        (p.gender && p.gender.toLowerCase() === this.selectedGender.toLowerCase());

      return matchesSearch && matchesGender;
    });

    this.container.innerHTML = `
      <div class="section-header">
        <div class="section-title-group">
          <h2>
            <span>Patient Records & Directory</span>
            <span class="badge badge-mono">${filteredPatients.length} Patients</span>
          </h2>
          <p>Manage patient demographics, electronic medical records (EMR), and linked clinical admission histories</p>
        </div>
        <div class="section-actions">
          <button class="btn btn-primary" id="btn-add-patient">
            <span>+ Register New Patient</span>
          </button>
        </div>
      </div>

      <!-- Controls & Search -->
      <div class="table-controls">
        <div class="filters-group" style="flex: 1; max-width: 480px;">
          <input 
            type="text" 
            class="form-input" 
            id="patients-search-input" 
            placeholder="Search by name, MRN, contact or email..."
            value="${this.searchQuery}"
            style="width: 100%;"
          />
        </div>
        <div class="filters-group">
          <select class="filter-select" id="patients-gender-filter">
            <option value="all" ${this.selectedGender === 'all' ? 'selected' : ''}>All Genders</option>
            <option value="male" ${this.selectedGender === 'male' ? 'selected' : ''}>Male</option>
            <option value="female" ${this.selectedGender === 'female' ? 'selected' : ''}>Female</option>
            <option value="other" ${this.selectedGender === 'other' ? 'selected' : ''}>Other</option>
          </select>
          <button class="btn btn-secondary btn-sm" id="btn-toggle-patients-view" title="Toggle Table/Card View">
            <span>${this.viewMode === 'table' ? '⊞ Card View' : '☰ Table View'}</span>
          </button>
        </div>
      </div>

      <!-- Content Area -->
      ${filteredPatients.length === 0 ? `
        <div class="glass-panel">
          <div class="empty-state">
            <div class="empty-icon">👥</div>
            <div class="empty-title">No Patients Found</div>
            <div class="empty-subtitle">No patient records matched your search filter. Register a new patient or seed demonstration records.</div>
            <button class="btn btn-primary btn-sm" id="btn-empty-add-patient" style="margin-top: 12px;">+ Register Patient</button>
          </div>
        </div>
      ` : this.viewMode === 'table' ? `
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>MRN</th>
                <th>DOB / Age</th>
                <th>Gender</th>
                <th>Contact Info</th>
                <th>Admissions</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredPatients.map(p => {
                const admissions = state.getAdmissionsForPatient(p.id);
                const activeAdm = admissions.find(a => a.status === 'active');
                const age = p.date_of_birth ? Math.floor((Date.now() - new Date(p.date_of_birth).getTime()) / (365.25 * 24 * 3600 * 1000)) : 'N/A';
                return `
                  <tr>
                    <td>
                      <div style="font-weight: 600; color: var(--text-primary);">
                        ${p.first_name} ${p.last_name}
                      </div>
                      <div style="font-size: 11.5px; color: var(--text-muted);">${p.email || 'No email provided'}</div>
                    </td>
                    <td>
                      <span class="mrn-badge">${p.medical_record_number}</span>
                    </td>
                    <td>
                      <div>${new Date(p.date_of_birth).toLocaleDateString()}</div>
                      <div style="font-size: 11.5px; color: var(--text-muted);">${age} years old</div>
                    </td>
                    <td>
                      <span class="badge ${p.gender === 'Female' ? 'badge-high' : 'badge-active'}">
                        ${p.gender || 'Not specified'}
                      </span>
                    </td>
                    <td>
                      <div>${p.contact_number || 'N/A'}</div>
                      <div style="font-size: 11.5px; color: var(--text-muted);">${p.address || ''}</div>
                    </td>
                    <td>
                      ${activeAdm ? `
                        <span class="badge badge-critical" title="Currently admitted in ${activeAdm.department}">
                          Active: ${activeAdm.department || 'Inpatient'}
                        </span>
                      ` : admissions.length > 0 ? `
                        <span class="badge badge-discharged">${admissions.length} Historical</span>
                      ` : `
                        <span style="color: var(--text-muted); font-size: 12px;">None</span>
                      `}
                    </td>
                    <td style="text-align: right;">
                      <div style="display: flex; gap: 6px; justify-content: flex-end;">
                        <button class="btn-icon btn-view-patient" data-id="${p.id}" title="View Patient Details">
                          👁️
                        </button>
                        <button class="btn-icon btn-edit-patient" data-id="${p.id}" title="Edit Patient Details">
                          ✏️
                        </button>
                        <button class="btn-icon delete btn-delete-patient" data-id="${p.id}" title="Delete Patient Record">
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
      ` : `
        <div class="cards-grid">
          ${filteredPatients.map(p => {
            const admissions = state.getAdmissionsForPatient(p.id);
            const activeAdm = admissions.find(a => a.status === 'active');
            const age = p.date_of_birth ? Math.floor((Date.now() - new Date(p.date_of_birth).getTime()) / (365.25 * 24 * 3600 * 1000)) : 'N/A';
            return `
              <div class="patient-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary);">
                      ${p.first_name} ${p.last_name}
                    </h3>
                    <span class="mrn-badge" style="margin-top: 4px; display: inline-block;">
                      ${p.medical_record_number}
                    </span>
                  </div>
                  <span class="badge ${p.gender === 'Female' ? 'badge-high' : 'badge-active'}">
                    ${p.gender || 'Patient'}
                  </span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--text-secondary);">
                  <div><strong>Age / DOB:</strong> ${age} yrs (${new Date(p.date_of_birth).toLocaleDateString()})</div>
                  <div><strong>Contact:</strong> ${p.contact_number || 'N/A'}</div>
                  <div><strong>Email:</strong> ${p.email || 'N/A'}</div>
                  <div><strong>Address:</strong> ${p.address || 'N/A'}</div>
                </div>

                <div style="padding-top: 10px; border-top: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    ${activeAdm ? `
                      <span class="badge badge-critical">Active Inpatient</span>
                    ` : `
                      <span class="badge badge-discharged">${admissions.length} Admissions</span>
                    `}
                  </div>
                  <div style="display: flex; gap: 6px;">
                    <button class="btn-icon btn-view-patient" data-id="${p.id}" title="View Details">👁️</button>
                    <button class="btn-icon btn-edit-patient" data-id="${p.id}" title="Edit">✏️</button>
                    <button class="btn-icon delete btn-delete-patient" data-id="${p.id}" title="Delete">🗑️</button>
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
    // Search input
    const searchInput = this.container.querySelector('#patients-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
      });
    }

    // Gender filter
    const genderFilter = this.container.querySelector('#patients-gender-filter');
    if (genderFilter) {
      genderFilter.addEventListener('change', (e) => {
        this.selectedGender = e.target.value;
        this.render();
      });
    }

    // Toggle view
    const toggleViewBtn = this.container.querySelector('#btn-toggle-patients-view');
    if (toggleViewBtn) {
      toggleViewBtn.addEventListener('click', () => {
        this.viewMode = this.viewMode === 'table' ? 'grid' : 'table';
        this.render();
      });
    }

    // Add Patient button
    const addBtn = this.container.querySelector('#btn-add-patient') || this.container.querySelector('#btn-empty-add-patient');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        // Generate random suggested MRN
        const form = document.getElementById('form-patient');
        if (form) {
          form.reset();
          document.getElementById('patient-form-id').value = '';
          document.getElementById('patient-modal-title').textContent = 'Register New Patient';
          document.getElementById('patient-mrn').value = `MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        ModalManager.open('modal-patient');
      });
    }

    // View Patient details
    this.container.querySelectorAll('.btn-view-patient').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        this.showPatientDetails(id);
      });
    });

    // Edit Patient
    this.container.querySelectorAll('.btn-edit-patient').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        const patient = state.getPatientById(id);
        if (!patient) return;

        document.getElementById('patient-form-id').value = patient.id;
        document.getElementById('patient-modal-title').textContent = 'Edit Patient Record';
        document.getElementById('patient-first-name').value = patient.first_name || '';
        document.getElementById('patient-last-name').value = patient.last_name || '';
        
        if (patient.date_of_birth) {
          const dobDate = new Date(patient.date_of_birth).toISOString().split('T')[0];
          document.getElementById('patient-dob').value = dobDate;
        }
        document.getElementById('patient-gender').value = patient.gender || 'Other';
        document.getElementById('patient-contact').value = patient.contact_number || '';
        document.getElementById('patient-email').value = patient.email || '';
        document.getElementById('patient-address').value = patient.address || '';
        document.getElementById('patient-mrn').value = patient.medical_record_number || '';

        ModalManager.open('modal-patient');
      });
    });

    // Delete Patient
    this.container.querySelectorAll('.btn-delete-patient').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        const patient = state.getPatientById(id);
        if (!patient) return;

        ModalManager.confirm({
          title: `Delete Patient Record?`,
          message: `Are you sure you want to delete <strong>${patient.first_name} ${patient.last_name}</strong> (${patient.medical_record_number})? This action cannot be undone.`,
          confirmText: 'Delete Record',
          isDanger: true,
          onConfirm: async () => {
            try {
              await api.deletePatient(id);
              toast.success('Patient Deleted', `Removed ${patient.first_name} ${patient.last_name}`);
              await state.fetchAll();
            } catch (err) {
              toast.error('Deletion Failed', err.message);
            }
          }
        });
      });
    });
  }

  showPatientDetails(patientId) {
    const patient = state.getPatientById(patientId);
    if (!patient) return;

    const admissions = state.getAdmissionsForPatient(patientId);
    const modal = document.getElementById('modal-patient-details');
    if (!modal) return;

    modal.querySelector('.patient-detail-name').textContent = `${patient.first_name} ${patient.last_name}`;
    modal.querySelector('.patient-detail-mrn').textContent = patient.medical_record_number;
    modal.querySelector('.patient-detail-dob').textContent = new Date(patient.date_of_birth).toLocaleDateString();
    modal.querySelector('.patient-detail-gender').textContent = patient.gender || 'Not specified';
    modal.querySelector('.patient-detail-contact').textContent = patient.contact_number || 'N/A';
    modal.querySelector('.patient-detail-email').textContent = patient.email || 'N/A';
    modal.querySelector('.patient-detail-address').textContent = patient.address || 'N/A';

    const historyContainer = modal.querySelector('.patient-admissions-history');
    if (historyContainer) {
      if (admissions.length === 0) {
        historyContainer.innerHTML = `<div style="color: var(--text-muted); font-size: 13px;">No admission history recorded for this patient.</div>`;
      } else {
        historyContainer.innerHTML = admissions.map(adm => {
          const allocations = state.getAllocationsForAdmission(adm.id);
          return `
            <div style="background: var(--bg-tertiary); border-radius: var(--radius-md); padding: 12px; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <strong style="font-size: 14px; color: var(--text-primary);">${adm.department || 'Inpatient Admission'}</strong>
                <span class="badge ${adm.status === 'active' ? 'badge-active' : 'badge-discharged'}">${adm.status}</span>
              </div>
              <div style="font-size: 12.5px; color: var(--text-secondary); margin-bottom: 6px;">
                <strong>Diagnosis:</strong> ${adm.diagnosis || 'None listed'} &nbsp;|&nbsp; 
                <strong>Severity:</strong> <span class="badge badge-${(adm.severity_level || 'low').toLowerCase()}">${adm.severity_level || 'Low'}</span>
              </div>
              <div style="font-size: 11.5px; color: var(--text-muted);">
                Admitted: ${new Date(adm.admission_date).toLocaleString()}
                ${adm.discharge_date ? ` | Discharged: ${new Date(adm.discharge_date).toLocaleString()}` : ''}
              </div>
              ${allocations.length > 0 ? `
                <div style="margin-top: 8px; font-size: 12px; padding-top: 6px; border-top: 1px solid var(--border-color);">
                  <strong>Allocated Equipment:</strong>
                  ${allocations.map(al => {
                    const res = state.getResourceById(al.resource_id);
                    return `<span class="badge badge-allocated" style="margin-right: 4px;">${res ? res.name : 'Equipment'} (${al.quantity_allocated}x)</span>`;
                  }).join('')}
                </div>
              ` : ''}
            </div>
          `;
        }).join('');
      }
    }

    ModalManager.open('modal-patient-details');
  }
}
