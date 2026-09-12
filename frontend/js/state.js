/**
 * Healthcare Resource Management System - State Manager
 * Reactive in-memory store synchronized with FastAPI backend
 */

import { api } from './api.js';
import { toast } from './utils/toast.js';

class StateManager {
  constructor() {
    this.patients = [];
    this.resources = [];
    this.admissions = [];
    this.allocations = [];
    this.systemHealth = null;

    this.filters = {
      patientsSearch: '',
      patientsGender: 'all',
      resourcesSearch: '',
      resourcesCategory: 'all',
      admissionsSearch: '',
      admissionsStatus: 'all',
      admissionsSeverity: 'all',
      allocationsSearch: '',
      allocationsStatus: 'all'
    };

    this.listeners = new Set();
    this.isLoading = false;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, payload) {
    this.listeners.forEach(listener => {
      try {
        listener(event, payload, this);
      } catch (err) {
        console.error('State listener error:', err);
      }
    });
  }

  async fetchAll() {
    this.isLoading = true;
    this.notify('loading', true);

    try {
      const [patientsRes, resourcesRes, admissionsRes, allocationsRes, healthRes] = await Promise.allSettled([
        api.getPatients(0, 500),
        api.getResources(0, 500),
        api.getAdmissions(0, 500),
        api.getResourceAllocations(0, 500),
        api.checkHealth()
      ]);

      if (patientsRes.status === 'fulfilled' && patientsRes.value) {
        this.patients = patientsRes.value;
      }
      if (resourcesRes.status === 'fulfilled' && resourcesRes.value) {
        this.resources = resourcesRes.value;
      }
      if (admissionsRes.status === 'fulfilled' && admissionsRes.value) {
        this.admissions = admissionsRes.value;
      }
      if (allocationsRes.status === 'fulfilled' && allocationsRes.value) {
        this.allocations = allocationsRes.value;
      }
      if (healthRes.status === 'fulfilled') {
        this.systemHealth = healthRes.value;
      }

      this.isLoading = false;
      this.notify('data_loaded', this);
    } catch (error) {
      this.isLoading = false;
      this.notify('error', error);
      toast.error('Data Sync Error', error.message);
    }
  }

  // ==========================================
  // Metrics & Derived Computations
  // ==========================================

  getMetrics() {
    const totalPatients = this.patients.length;
    const activeAdmissions = this.admissions.filter(a => a.status === 'active');
    const totalAdmissions = this.admissions.length;
    const dischargedCount = this.admissions.filter(a => a.status === 'discharged').length;

    // Bed and ICU stats
    const bedResources = this.resources.filter(r => 
      r.resource_type.toLowerCase().includes('bed') || r.name.toLowerCase().includes('bed')
    );
    const totalBeds = bedResources.reduce((acc, r) => acc + (r.quantity_total || 0), 0);
    const availableBeds = bedResources.reduce((acc, r) => acc + (r.quantity_available || 0), 0);
    const occupiedBeds = totalBeds - availableBeds;
    const bedOccupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    // Critical and high severity count
    const criticalCount = activeAdmissions.filter(a => a.severity_level && a.severity_level.toLowerCase() === 'critical').length;
    const highSeverityCount = activeAdmissions.filter(a => a.severity_level && a.severity_level.toLowerCase() === 'high').length;

    // Active allocations
    const activeAllocations = this.allocations.filter(al => al.status !== 'returned');

    // Resources low stock
    const lowStockResources = this.resources.filter(r => {
      if (r.quantity_total <= 0) return true;
      const ratio = r.quantity_available / r.quantity_total;
      return ratio <= 0.25 || r.quantity_available === 0;
    });

    return {
      totalPatients,
      activeAdmissionsCount: activeAdmissions.length,
      totalAdmissions,
      dischargedCount,
      totalBeds,
      availableBeds,
      occupiedBeds,
      bedOccupancyRate,
      criticalCount,
      highSeverityCount,
      totalResources: this.resources.length,
      lowStockCount: lowStockResources.length,
      activeAllocationsCount: activeAllocations.length
    };
  }

  getDepartmentDistribution() {
    const counts = {};
    this.admissions.forEach(adm => {
      const dept = adm.department || 'General Medicine';
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return counts;
  }

  getSeverityDistribution() {
    const distribution = {
      Critical: 0,
      High: 0,
      Moderate: 0,
      Low: 0
    };
    this.admissions.forEach(adm => {
      const sev = adm.severity_level ? 
        adm.severity_level.charAt(0).toUpperCase() + adm.severity_level.slice(1).toLowerCase() : 'Moderate';
      if (distribution[sev] !== undefined) {
        distribution[sev]++;
      } else {
        distribution.Moderate++;
      }
    });
    return distribution;
  }

  getLowStockResources() {
    return this.resources.filter(r => {
      if (r.quantity_total <= 0) return true;
      return (r.quantity_available / r.quantity_total) <= 0.25;
    });
  }

  getCriticalAdmissions() {
    return this.admissions.filter(a => 
      a.status === 'active' && 
      a.severity_level && 
      (a.severity_level.toLowerCase() === 'critical' || a.severity_level.toLowerCase() === 'high')
    );
  }

  // Lookup helpers
  getPatientById(id) {
    return this.patients.find(p => p.id === Number(id));
  }

  getResourceById(id) {
    return this.resources.find(r => r.id === Number(id));
  }

  getAdmissionById(id) {
    return this.admissions.find(a => a.id === Number(id));
  }

  getAdmissionsForPatient(patientId) {
    return this.admissions.filter(a => a.patient_id === Number(patientId));
  }

  getAllocationsForAdmission(admissionId) {
    return this.allocations.filter(al => al.admission_id === Number(admissionId));
  }
}

export const state = new StateManager();
