import { MedicalReport } from '../types/medical';
import { auditDataQuality, synthesizeClinicalRisk } from './clinicalModels';

// Single clearly labeled fictional demo patient for B.Tech CSE Capstone demonstration
// Patient ID: DEMO-001 | Arun Kumar (25 M) | BP: 120/80 mmHg
export const SAMPLE_REPORTS: MedicalReport[] = [
  {
    id: 'rep-demo-001',
    title: 'Baseline Point-of-Care Laboratory Panel',
    sourceType: 'POCT Cartridge',
    fileName: 'DEMO_POCT_PANEL_ARUN_KUMAR.pdf',
    createdAt: '2026-10-08T10:00:00Z',
    labFacility: 'Academic Demonstration Laboratory (B.Tech Capstone)',
    deviceSerialNumber: 'POCT-SIM-001 (Simulated Device)',
    patient: {
      id: 'DEMO-001',
      name: 'Arun Kumar',
      age: 25,
      gender: 'male',
      systolicBp: 120,
      diastolicBp: 80,
      smoker: false,
      diabetic: false,
      hypertensiveTreatment: false,
      fastingHours: 10,
      medicalRecordNumber: 'DEMO-001',
    },
    tests: [
      {
        id: 't-1',
        name: 'Fasting Glucose',
        category: 'Metabolic',
        value: 95,
        unit: 'mg/dL',
        referenceLow: 70,
        referenceHigh: 99,
        flag: 'NORMAL',
        confidence: 1.0,
        rawText: 'FASTING GLUCOSE ......... 95 mg/dL [70 - 99] NORMAL',
        notes: 'Normal fasting blood glucose within standard clinical bounds (illustrative range).',
      },
      {
        id: 't-2',
        name: 'Total Cholesterol',
        category: 'Lipid',
        value: 180,
        unit: 'mg/dL',
        referenceLow: 125,
        referenceHigh: 200,
        flag: 'NORMAL',
        confidence: 1.0,
        rawText: 'TOTAL CHOLESTEROL ...... 180 mg/dL [125 - 200] NORMAL',
        notes: 'Desirable circulating total cholesterol level (illustrative range).',
      },
      {
        id: 't-3',
        name: 'HDL Cholesterol',
        category: 'Lipid',
        value: 45,
        unit: 'mg/dL',
        referenceLow: 40,
        referenceHigh: 60,
        flag: 'NORMAL',
        confidence: 1.0,
        rawText: 'HDL CHOLESTEROL ......... 45 mg/dL [40 - 60] NORMAL',
        notes: 'Normal protective high-density lipoprotein level for an adult male (illustrative range).',
      },
      {
        id: 't-4',
        name: 'eGFR',
        category: 'Renal',
        value: 95,
        unit: 'mL/min/1.73m²',
        referenceLow: 90,
        referenceHigh: 120,
        flag: 'NORMAL',
        confidence: 1.0,
        rawText: 'eGFR (ESTIMATED GFR) .... 95 mL/min/1.73m² [>= 90] NORMAL',
        notes: 'Healthy kidney filtration capacity corresponding to Stage G1 (illustrative range).',
      },
    ],
    qualityAudit: {
      overallQualityScore: 100,
      totalAnalytes: 4,
      validAnalytes: 4,
      issues: [],
      isLockedForAnalysis: true,
      auditedAt: '2026-10-08T10:00:05Z',
    },
    // Requirement 6: Display helpful empty state if historical records are unavailable.
    // Do NOT invent historical patient records or trends.
    historicalVisits: [],
    status: 'verified',
    ocrRawText: `=========================================
DEMO LABORATORY POINT-OF-CARE REPORT [DEMO DATA]
SPECIMEN ID: DEMO-001 | STATUS: VERIFIED
PATIENT: ARUN KUMAR (25 M) | ID: DEMO-001
BLOOD PRESSURE: 120/80 mmHg | FASTING: 10 HRS
SIMULATED HARDWARE: POCT-SIM-001
-----------------------------------------
FASTING GLUCOSE ......... 95 mg/dL   [70 - 99]   NORMAL
TOTAL CHOLESTEROL ....... 180 mg/dL  [125 - 200] NORMAL
HDL CHOLESTEROL ......... 45 mg/dL   [40 - 60]   NORMAL
eGFR (ESTIMATED GFR) .... 95 mL/min/1.73m² [>= 90] NORMAL
-----------------------------------------
QUALITY CHECKS PASSED: 4/4 ANALYTES VERIFIED
DEMONSTRATION RECORD ONLY · FICTIONAL PATIENT
=========================================`,
  },
];

// Enrich sample reports with computed risk summaries
SAMPLE_REPORTS.forEach((rep) => {
  rep.riskSummary = synthesizeClinicalRisk(rep.tests, rep.patient);
  rep.qualityAudit = auditDataQuality(rep.tests, rep.patient);
});
