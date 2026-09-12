/**
 * Healthcare Resource Management System - Demo Data Seeder
 * Instantly populates realistic hospital records for full demonstration
 */

import { api } from '../api.js';
import { toast } from './toast.js';
import { state } from '../state.js';

export const samplePatients = [
  {
    first_name: "Eleanor",
    last_name: "Vance",
    date_of_birth: "1985-04-12T00:00:00.000Z",
    gender: "Female",
    contact_number: "+1 (555) 234-8901",
    email: "e.vance@example.com",
    address: "742 Evergreen Terrace, Springfield",
    medical_record_number: "MRN-2026-1001"
  },
  {
    first_name: "Marcus",
    last_name: "Chen",
    date_of_birth: "1972-11-28T00:00:00.000Z",
    gender: "Male",
    contact_number: "+1 (555) 876-5432",
    email: "m.chen@example.com",
    address: "128 Beacon St, Boston, MA",
    medical_record_number: "MRN-2026-1002"
  },
  {
    first_name: "Sophia",
    last_name: "Rodriguez",
    date_of_birth: "1994-08-19T00:00:00.000Z",
    gender: "Female",
    contact_number: "+1 (555) 345-6789",
    email: "sophia.r@example.com",
    address: "450 Ocean Drive, Miami, FL",
    medical_record_number: "MRN-2026-1003"
  },
  {
    first_name: "David",
    last_name: "Kim",
    date_of_birth: "1960-02-14T00:00:00.000Z",
    gender: "Male",
    contact_number: "+1 (555) 901-2345",
    email: "david.kim@example.com",
    address: "89 Pine Hill Rd, Seattle, WA",
    medical_record_number: "MRN-2026-1004"
  },
  {
    first_name: "Amina",
    last_name: "Al-Mansoor",
    date_of_birth: "1990-09-05T00:00:00.000Z",
    gender: "Female",
    contact_number: "+1 (555) 432-1098",
    email: "amina.m@example.com",
    address: "1200 Lakeview Ave, Chicago, IL",
    medical_record_number: "MRN-2026-1005"
  },
  {
    first_name: "James",
    last_name: "Wilson",
    date_of_birth: "1954-06-30T00:00:00.000Z",
    gender: "Male",
    contact_number: "+1 (555) 678-9012",
    email: "jwilson@example.com",
    address: "330 Willow Creek Blvd, Austin, TX",
    medical_record_number: "MRN-2026-1006"
  }
];

export const sampleResources = [
  {
    name: "ICU Smart Bed - Alpha Unit",
    resource_type: "Hospital Beds",
    quantity_available: 4,
    quantity_total: 10,
    unit: "Beds",
    location: "ICU Ward B, 3rd Floor",
    status: "available"
  },
  {
    name: "Hamilton C6 Mechanical Ventilator",
    resource_type: "Critical Care Equipment",
    quantity_available: 2,
    quantity_total: 8,
    unit: "Units",
    location: "Critical Care Bay 4",
    status: "available"
  },
  {
    name: "Philips IntelliVue MX800 Patient Monitor",
    resource_type: "Diagnostic Monitors",
    quantity_available: 6,
    quantity_total: 15,
    unit: "Devices",
    location: "Emergency & Trauma Wing",
    status: "available"
  },
  {
    name: "Zoll R-Series Defibrillator & Pacer",
    resource_type: "Emergency Response",
    quantity_available: 3,
    quantity_total: 5,
    unit: "Units",
    location: "Resuscitation Suite 1",
    status: "available"
  },
  {
    name: "Medical Grade Oxygen Concentrator (50L)",
    resource_type: "Respiratory & Gas",
    quantity_available: 1,
    quantity_total: 12,
    unit: "Tanks",
    location: "Pulmonology Storage Tank #2",
    status: "low_stock"
  },
  {
    name: "GE Healthcare Portable Ultrasound",
    resource_type: "Imaging & Diagnostic",
    quantity_available: 2,
    quantity_total: 4,
    unit: "Scanners",
    location: "Radiology Mobile Bay",
    status: "available"
  },
  {
    name: "General Medical-Surgical Bed",
    resource_type: "Hospital Beds",
    quantity_available: 12,
    quantity_total: 30,
    unit: "Beds",
    location: "West Pavilion Level 2",
    status: "available"
  }
];

export async function seedDemoData() {
  toast.info('Seeding Demo Data', 'Creating realistic patients, resources, admissions & allocations...');
  
  try {
    // 1. Create Patients
    const createdPatients = [];
    for (const patient of samplePatients) {
      try {
        const p = await api.createPatient(patient);
        createdPatients.push(p);
      } catch (e) {
        console.warn('Patient already exists or error:', e.message);
      }
    }

    // 2. Create Resources
    const createdResources = [];
    for (const res of sampleResources) {
      try {
        const r = await api.createResource(res);
        createdResources.push(r);
      } catch (e) {
        console.warn('Resource already exists or error:', e.message);
      }
    }

    // Fetch refreshed list to make sure we have IDs
    const currentPatients = await api.getPatients(0, 100);
    const currentResources = await api.getResources(0, 100);

    if (currentPatients.length === 0 || currentResources.length === 0) {
      throw new Error('Could not initialize patients or resources.');
    }

    // 3. Create Admissions
    const admissionsToCreate = [
      {
        patient_id: currentPatients[0].id,
        admission_date: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        department: "Intensive Care Unit (ICU)",
        diagnosis: "Acute Respiratory Distress Syndrome (ARDS) secondary to viral pneumonia",
        severity_level: "Critical",
        status: "active"
      },
      {
        patient_id: currentPatients[1].id,
        admission_date: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
        department: "Cardiology",
        diagnosis: "Non-ST Elevation Myocardial Infarction (NSTEMI) post-angioplasty",
        severity_level: "High",
        status: "active"
      },
      {
        patient_id: currentPatients[2].id,
        admission_date: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        department: "Emergency & Trauma",
        diagnosis: "Multiple contusions and mild concussion following motor vehicle collision",
        severity_level: "Moderate",
        status: "active"
      },
      {
        patient_id: currentPatients[3].id,
        admission_date: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        discharge_date: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        department: "General Surgery",
        diagnosis: "Elective laparoscopic cholecystectomy - Routine recovery",
        severity_level: "Low",
        status: "discharged"
      }
    ];

    const createdAdmissions = [];
    for (const adm of admissionsToCreate) {
      try {
        const a = await api.createAdmission(adm);
        createdAdmissions.push(a);
      } catch (e) {
        console.warn('Admission creation warning:', e.message);
      }
    }

    // 4. Create Allocations for active admissions
    const activeAdms = createdAdmissions.filter(a => a.status === 'active');
    if (activeAdms.length > 0 && currentResources.length > 0) {
      // Allocate ventilator to ICU patient
      const ventResource = currentResources.find(r => r.name.includes('Ventilator') && r.quantity_available > 0);
      if (ventResource && activeAdms[0]) {
        try {
          await api.createResourceAllocation({
            resource_id: ventResource.id,
            admission_id: activeAdms[0].id,
            quantity_allocated: 1,
            allocation_date: new Date().toISOString(),
            status: "allocated",
            notes: "Continuous positive airway pressure monitoring required."
          });
        } catch (e) {
          console.warn('Allocation error:', e.message);
        }
      }

      // Allocate monitor to Cardiology patient
      const monitorResource = currentResources.find(r => r.name.includes('Monitor') && r.quantity_available > 0);
      if (monitorResource && activeAdms[1]) {
        try {
          await api.createResourceAllocation({
            resource_id: monitorResource.id,
            admission_id: activeAdms[1].id,
            quantity_allocated: 1,
            allocation_date: new Date().toISOString(),
            status: "allocated",
            notes: "12-lead continuous telemetry surveillance."
          });
        } catch (e) {
          console.warn('Allocation error:', e.message);
        }
      }
    }

    await state.fetchAll();
    toast.success('Demonstration Data Seeded', 'Successfully loaded patients, equipment, admissions and active allocations!');
  } catch (err) {
    console.error('Seeder failed:', err);
    toast.error('Seeder Error', err.message);
  }
}
