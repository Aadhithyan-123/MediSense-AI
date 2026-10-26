export type TestFlag = 'NORMAL' | 'ABNORMAL_HIGH' | 'ABNORMAL_LOW' | 'CRITICAL_HIGH' | 'CRITICAL_LOW';

export interface LabTest {
  id: string;
  name: string;
  category: 'Metabolic' | 'Lipid' | 'Renal' | 'Hepatic' | 'Hematology' | 'Inflammatory' | 'Cardiac' | 'Electrolytes';
  value: number;
  unit: string;
  referenceLow: number;
  referenceHigh: number;
  flag: TestFlag;
  confidence: number; // 0 to 1
  rawText?: string;
  notes?: string;
  isManuallyEdited?: boolean;
}

export interface QualityIssue {
  id: string;
  testId?: string;
  severity: 'error' | 'warning' | 'info';
  type: 'missing_value' | 'invalid_unit' | 'duplicate_analyte' | 'low_confidence_ocr' | 'biological_implausibility';
  title: string;
  description: string;
  suggestedAction?: string;
  autoFixable?: boolean;
}

export interface QualityAuditResult {
  overallQualityScore: number; // 0 - 100
  totalAnalytes: number;
  validAnalytes: number;
  issues: QualityIssue[];
  isLockedForAnalysis: boolean;
  auditedAt: string;
}

export interface PatientDemographics {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  systolicBp?: number;
  diastolicBp?: number;
  smoker?: boolean;
  diabetic?: boolean;
  hypertensiveTreatment?: boolean;
  fastingHours?: number;
  medicalRecordNumber: string;
}

export interface RiskFactorContribution {
  biomarker: string;
  weight: number; // -1 to +1
  measuredValue: string;
  impact: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

export interface AscvdRiskResult {
  scorePercent: number;
  category: 'Low (<5%)' | 'Borderline (5-7.4%)' | 'Intermediate (7.5-19.9%)' | 'High (>=20%)';
  equationUsed: string;
  recommendations: string[];
}

export interface CkdEgfrResult {
  egfrValue: number; // mL/min/1.73m2
  stage: 'G1 (Normal >=90)' | 'G2 (Mild 60-89)' | 'G3a (Mild-Mod 45-59)' | 'G3b (Mod-Severe 30-44)' | 'G4 (Severe 15-29)' | 'G5 (Failure <15)';
  clinicalInterpretation: string;
}

export interface Fib4Result {
  score: number;
  category: 'Low Risk (<1.30)' | 'Indeterminate (1.30 - 2.67)' | 'High Risk of Advanced Fibrosis (>2.67)';
  clinicalInterpretation: string;
}

export interface MetabolicSyndromeResult {
  criteriaMetCount: number;
  totalCriteria: number;
  hasMetabolicSyndrome: boolean;
  criteriaDetails: {
    name: string;
    threshold: string;
    patientValue: string;
    met: boolean;
  }[];
}

export interface InflammatoryRiskResult {
  score: number; // 0 - 100
  severity: 'Basal / Low' | 'Moderate Systemic Response' | 'High / Acute Phase Reaction';
  primaryDrivers: string[];
}

export interface ClinicalRiskSummary {
  ascvd: AscvdRiskResult;
  ckd: CkdEgfrResult;
  fib4: Fib4Result;
  metabolic: MetabolicSyndromeResult;
  inflammatory: InflammatoryRiskResult;
  featureAttributions: RiskFactorContribution[];
  clinicalTakeaway: string;
}

export interface HistoricalVisit {
  visitDate: string;
  reportId: string;
  glucose: number;
  totalCholesterol: number;
  systolicBp: number;
  creatinine: number;
  crp: number;
  hba1c?: number;
}

export interface MedicalReport {
  id: string;
  title: string;
  sourceType: 'POCT Cartridge' | 'Uploaded PDF' | 'Scanned Image' | 'Manual Intake';
  fileName?: string;
  createdAt: string;
  patient: PatientDemographics;
  tests: LabTest[];
  qualityAudit: QualityAuditResult;
  riskSummary?: ClinicalRiskSummary;
  historicalVisits?: HistoricalVisit[];
  status: 'draft' | 'extracted' | 'verified' | 'analyzed' | 'finalized';
  ocrRawText?: string;
  labFacility: string;
  deviceSerialNumber: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  citations?: string[];
  disclaimerShown?: boolean;
}
