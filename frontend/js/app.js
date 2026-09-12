/**
 * Healthcare Resource Management System - Main Application Controller
 * Handles SPA Routing, Global Modal Submission Handlers, Health Heartbeat & Theme Toggling
 */

import { api } from './api.js';
import { state } from './state.js';
import { toast } from './utils/toast.js';
import { ModalManager } from './utils/modal.js';
import { seedDemoData } from './utils/seeder.js';

import { DashboardComponent } from './components/dashboard.js';
import { PatientsComponent } from './components/patients.js';
import { AdmissionsComponent } from './components/admissions.js';
import { ResourcesComponent } from './components/resources.js';
import { AllocationsComponent } from './components/allocations.js';
import { AnalyticsComponent } from './components/analytics.js';
import { AIForesightComponent } from './components/ai_foresight.js';

class App {
  constructor() {
    this.currentTab = 'dashboard';
    this.components = {};
  }

  async init() {
    console.log('Initializing Healthcare Resource Management System SPA...');
    
    this.initComponents();
    this.bindNavigation();
    this.bindGlobalActions();
    this.bindModalForms();
    this.initTheme();

    // Subscribe to state changes
    state.subscribe((event) => {
      this.updateUI();
    });

    // Initial data fetch
    await state.fetchAll();

    // Setup health heartbeat
    this.startHeartbeat();

    // Check URL hash for direct tab navigation
    if (window.location.hash) {
      const tab = window.location.hash.replace('#', '');
      if (['dashboard', 'patients', 'admissions', 'resources', 'allocations', 'analytics', 'ai-foresight'].includes(tab)) {
        this.switchTab(tab);
      }
    }
  }

  initComponents() {
    const mainContent = document.getElementById('view-container');
    if (!mainContent) return;

    this.components = {
      dashboard: new DashboardComponent(document.getElementById('view-dashboard')),
      patients: new PatientsComponent(document.getElementById('view-patients')),
      admissions: new AdmissionsComponent(document.getElementById('view-admissions')),
      resources: new ResourcesComponent(document.getElementById('view-resources')),
      allocations: new AllocationsComponent(document.getElementById('view-allocations')),
      analytics: new AnalyticsComponent(document.getElementById('view-analytics')),
      'ai-foresight': new AIForesightComponent(document.getElementById('view-ai-foresight'))
    };
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    window.location.hash = `#${tabName}`;

    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.tab === tabName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update active views
    document.querySelectorAll('.view-section').forEach(view => {
      if (view.id === `view-${tabName}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Close mobile menu if open
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    // Render active component
    if (this.components[tabName]) {
      this.components[tabName].render();
      if (tabName === 'dashboard' && this.components.dashboard && this.components.dashboard.map) {
        setTimeout(() => {
          try {
            this.components.dashboard.map.invalidateSize();
          } catch (e) {}
        }, 150);
      }
    }
  }

  updateUI() {
    // Update sidebar badges
    const metrics = state.getMetrics();
    const patBadge = document.getElementById('badge-patients-count');
    const admBadge = document.getElementById('badge-admissions-count');
    const resBadge = document.getElementById('badge-resources-count');
    const allBadge = document.getElementById('badge-allocations-count');

    if (patBadge) patBadge.textContent = state.patients.length;
    if (admBadge) admBadge.textContent = metrics.activeAdmissionsCount;
    if (resBadge) resBadge.textContent = state.resources.length;
    if (allBadge) allBadge.textContent = metrics.activeAllocationsCount;

    // Update health indicator in sidebar
    const pulseDot = document.getElementById('status-pulse-dot');
    const statusTitle = document.getElementById('status-title');
    const statusSubtitle = document.getElementById('status-subtitle');

    if (pulseDot && statusTitle && statusSubtitle) {
      if (api.isOnline) {
        pulseDot.className = 'status-pulse-dot';
        statusTitle.textContent = 'System Operational';
        statusSubtitle.textContent = `FastAPI Connected (${api.lastLatency || 2}ms)`;
      } else {
        pulseDot.className = 'status-pulse-dot offline';
        statusTitle.textContent = 'Backend Offline';
        statusSubtitle.textContent = 'Check FastAPI Server';
      }
    }

    // Re-render current active view
    if (this.components[this.currentTab]) {
      this.components[this.currentTab].render();
    }
  }

  bindNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        if (tab) this.switchTab(tab);
      });
    });

    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('app-sidebar');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Global Search Bar Handler
    const globalSearch = document.getElementById('global-search-input');
    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => {
        const val = e.target.value;
        if (this.currentTab === 'patients' && this.components.patients) {
          this.components.patients.searchQuery = val;
          this.components.patients.render();
        } else if (this.currentTab === 'resources' && this.components.resources) {
          this.components.resources.searchQuery = val;
          this.components.resources.render();
        } else if (this.currentTab === 'admissions' && this.components.admissions) {
          this.components.admissions.searchQuery = val;
          this.components.admissions.render();
        } else if (this.currentTab === 'allocations' && this.components.allocations) {
          this.components.allocations.searchQuery = val;
          this.components.allocations.render();
        }
      });
    }

    // Keyboard shortcut '/' to focus global search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (globalSearch) globalSearch.focus();
      }
    });
  }

  bindGlobalActions() {
    // Quick Actions Menu Triggers
    const btnNewPatient = document.getElementById('btn-header-new-patient');
    if (btnNewPatient) {
      btnNewPatient.addEventListener('click', () => {
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

    const btnNewAdmission = document.getElementById('btn-header-new-admission');
    if (btnNewAdmission) {
      btnNewAdmission.addEventListener('click', () => {
        if (this.components.admissions) {
          this.components.admissions.openCreateAdmissionModal();
        }
      });
    }

    const btnNewResource = document.getElementById('btn-header-new-resource');
    if (btnNewResource) {
      btnNewResource.addEventListener('click', () => {
        const form = document.getElementById('form-resource');
        if (form) form.reset();
        document.getElementById('resource-form-id').value = '';
        document.getElementById('resource-modal-title').textContent = 'Add Healthcare Resource';
        ModalManager.open('modal-resource');
      });
    }

    const btnNewAllocation = document.getElementById('btn-header-new-allocation');
    if (btnNewAllocation) {
      btnNewAllocation.addEventListener('click', () => {
        if (this.components.allocations) {
          this.components.allocations.openCreateAllocationModal();
        }
      });
    }

    // Seeder button in header
    const btnHeaderSeed = document.getElementById('btn-header-seed');
    if (btnHeaderSeed) {
      btnHeaderSeed.addEventListener('click', () => seedDemoData());
    }

    // Refresh data button
    const btnRefresh = document.getElementById('btn-header-refresh');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', async () => {
        toast.info('Synchronizing', 'Fetching latest healthcare data...');
        await state.fetchAll();
        toast.success('Synchronized', 'Data updated from backend.');
      });
    }
  }

  bindModalForms() {
    // 1. Patient Form Submission
    const formPatient = document.getElementById('form-patient');
    if (formPatient) {
      formPatient.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('patient-form-id').value;
        const dob = document.getElementById('patient-dob').value;

        const payload = {
          first_name: document.getElementById('patient-first-name').value.trim(),
          last_name: document.getElementById('patient-last-name').value.trim(),
          date_of_birth: new Date(dob).toISOString(),
          gender: document.getElementById('patient-gender').value,
          contact_number: document.getElementById('patient-contact').value.trim() || null,
          email: document.getElementById('patient-email').value.trim() || null,
          address: document.getElementById('patient-address').value.trim() || null,
          medical_record_number: document.getElementById('patient-mrn').value.trim()
        };

        try {
          if (id) {
            await api.updatePatient(Number(id), payload);
            toast.success('Patient Updated', `Successfully updated ${payload.first_name} ${payload.last_name}`);
          } else {
            await api.createPatient(payload);
            toast.success('Patient Registered', `Registered ${payload.first_name} ${payload.last_name} (${payload.medical_record_number})`);
          }
          ModalManager.close('modal-patient');
          await state.fetchAll();
        } catch (err) {
          toast.error('Patient Save Error', err.message);
        }
      });
    }

    // 2. Admission Form Submission
    const formAdmission = document.getElementById('form-admission');
    if (formAdmission) {
      formAdmission.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('admission-form-id').value;
        const patientId = Number(document.getElementById('admission-patient-select').value);
        const admDate = document.getElementById('admission-date').value;

        if (!patientId) {
          toast.error('Validation Error', 'Please select a patient for admission.');
          return;
        }

        const payload = {
          patient_id: patientId,
          admission_date: new Date(admDate).toISOString(),
          department: document.getElementById('admission-dept').value.trim() || 'General Ward',
          diagnosis: document.getElementById('admission-diagnosis').value.trim() || null,
          severity_level: document.getElementById('admission-severity').value,
          status: document.getElementById('admission-status') ? document.getElementById('admission-status').value : 'active'
        };

        try {
          if (id) {
            await api.updateAdmission(Number(id), payload);
            toast.success('Admission Updated', 'Clinical record updated successfully.');
          } else {
            await api.createAdmission(payload);
            toast.success('Patient Admitted', `Admitted to ${payload.department} with ${payload.severity_level} priority`);
          }
          ModalManager.close('modal-create-admission');
          await state.fetchAll();
        } catch (err) {
          toast.error('Admission Error', err.message);
        }
      });

      // AI Triage Assist inside Admission Form
      const toggleVitalsBtn = document.getElementById('btn-toggle-vitals');
      const vitalsContainer = document.getElementById('ai-vitals-container');
      const runAiTriageBtn = document.getElementById('btn-run-ai-triage');
      const triageResultDiv = document.getElementById('ai-triage-result');

      if (toggleVitalsBtn && vitalsContainer) {
        toggleVitalsBtn.addEventListener('click', () => {
          const isHidden = vitalsContainer.style.display === 'none';
          vitalsContainer.style.display = isHidden ? 'block' : 'none';
          toggleVitalsBtn.textContent = isHidden ? '✕ Hide Vitals' : '⚡ Input Vitals & Predict';
        });
      }

      if (runAiTriageBtn) {
        runAiTriageBtn.addEventListener('click', async () => {
          runAiTriageBtn.disabled = true;
          runAiTriageBtn.innerHTML = '<span>⏳ Evaluating vitals with Random Forest...</span>';

          const patientId = Number(document.getElementById('admission-patient-select').value);
          const patient = patientId ? state.getPatientById(patientId) : null;
          let age = 52;
          let gender = 'Male';

          if (patient && patient.date_of_birth) {
            const birthDate = new Date(patient.date_of_birth);
            const diffMs = Date.now() - birthDate.getTime();
            age = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
            gender = patient.gender || 'Male';
          }

          const vitalsPayload = {
            age: age,
            gender: gender,
            heart_rate: parseFloat(document.getElementById('ai-hr').value) || 75,
            spo2: parseFloat(document.getElementById('ai-spo2').value) || 98,
            systolic_bp: parseFloat(document.getElementById('ai-sysbp').value) || 120,
            diastolic_bp: 80,
            respiratory_rate: parseFloat(document.getElementById('ai-rr').value) || 16,
            temperature: parseFloat(document.getElementById('ai-temp').value) || 37.0,
            department: document.getElementById('admission-dept').value.trim() || 'Emergency & Trauma',
            comorbidities: 'None'
          };

          try {
            const pred = await api.predictTriage(vitalsPayload);
            const severitySelect = document.getElementById('admission-severity');
            if (severitySelect) {
              severitySelect.value = pred.predicted_severity;
            }

            const diagField = document.getElementById('admission-diagnosis');
            if (diagField && !diagField.value.trim()) {
              diagField.value = `[AI Triage] ${pred.clinical_rationale}`;
            }

            if (triageResultDiv) {
              triageResultDiv.style.display = 'block';
              triageResultDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <strong style="color: var(--primary);">Severity: ${pred.predicted_severity}</strong>
                  <span class="badge badge-active">${Math.round(pred.severity_confidence * 100)}% Confidence</span>
                </div>
                <div style="font-size: 11.5px; color: var(--text-secondary); margin-bottom: 2px;">
                  <strong>Recommended Resource:</strong> ${pred.recommended_resource} (${Math.round(pred.resource_confidence * 100)}% match)
                </div>
                <div style="font-size: 11px; color: var(--text-muted); font-style: italic;">
                  ${pred.clinical_rationale}
                </div>
              `;
            }
            toast.success('AI Triage Applied', `Auto-selected ${pred.predicted_severity} Priority & Recommended ${pred.recommended_resource}`);
          } catch (err) {
            toast.error('AI Prediction Failed', err.message);
          } finally {
            runAiTriageBtn.disabled = false;
            runAiTriageBtn.innerHTML = '<span>🤖 Run AI Prediction & Auto-Fill Triage</span>';
          }
        });
      }
    }

    // 3. Resource Form Submission
    const formResource = document.getElementById('form-resource');
    if (formResource) {
      formResource.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('resource-form-id').value;
        const total = Number(document.getElementById('resource-qty-total').value);
        const avail = Number(document.getElementById('resource-qty-avail').value);

        if (avail > total) {
          toast.error('Validation Error', 'Available quantity cannot exceed total quantity.');
          return;
        }

        const payload = {
          name: document.getElementById('resource-name').value.trim(),
          resource_type: document.getElementById('resource-type').value,
          quantity_total: total,
          quantity_available: avail,
          unit: document.getElementById('resource-unit').value.trim() || 'Units',
          location: document.getElementById('resource-location').value.trim() || null,
          status: document.getElementById('resource-status').value
        };

        try {
          if (id) {
            await api.updateResource(Number(id), payload);
            toast.success('Resource Updated', `Saved changes to ${payload.name}`);
          } else {
            await api.createResource(payload);
            toast.success('Resource Created', `Added ${payload.name} (${payload.quantity_total} ${payload.unit})`);
          }
          ModalManager.close('modal-resource');
          await state.fetchAll();
        } catch (err) {
          toast.error('Resource Save Error', err.message);
        }
      });
    }

    // 4. Resource Allocation Form Submission
    const formAllocation = document.getElementById('form-allocation');
    if (formAllocation) {
      formAllocation.addEventListener('submit', async (e) => {
        e.preventDefault();
        const admId = Number(document.getElementById('allocation-admission-select').value);
        const resId = Number(document.getElementById('allocation-resource-select').value);
        const qty = Number(document.getElementById('allocation-quantity').value);

        if (!admId || !resId) {
          toast.error('Validation Error', 'Please select both an admission and a resource.');
          return;
        }

        const resource = state.getResourceById(resId);
        if (resource && resource.quantity_available < qty) {
          toast.error('Stock Error', `Insufficient stock. Only ${resource.quantity_available} available.`);
          return;
        }

        const payload = {
          admission_id: admId,
          resource_id: resId,
          quantity_allocated: qty,
          allocation_date: new Date().toISOString(),
          status: "allocated",
          notes: document.getElementById('allocation-notes').value.trim() || null
        };

        try {
          await api.createResourceAllocation(payload);
          toast.success('Equipment Dispatched', `Allocated ${qty}x ${resource ? resource.name : 'Resource'}`);
          ModalManager.close('modal-create-allocation');
          await state.fetchAll();
        } catch (err) {
          toast.error('Allocation Failed', err.message);
        }
      });
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButton(savedTheme);

    const themeToggleBtn = document.getElementById('btn-theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeButton(newTheme);
      });
    }
  }

  updateThemeButton(theme) {
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.title = `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`;
    }
  }

  startHeartbeat() {
    // Ping health every 15 seconds
    setInterval(async () => {
      await state.fetchAll();
    }, 15000);
  }
}

// Bootstrap Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
  window.__healthcareApp = app;
});
