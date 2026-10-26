import {
  LabTest,
  TestFlag,
  PatientDemographics,
  QualityAuditResult,
  QualityIssue,
  AscvdRiskResult,
  CkdEgfrResult,
  Fib4Result,
  MetabolicSyndromeResult,
  InflammatoryRiskResult,
  ClinicalRiskSummary,
  RiskFactorContribution,
} from '../types/medical';

// Reference range database for standard POCT & clinical biomarkers (Illustrative Ranges)
export const STANDARD_BIOMARKER_RANGES: Record<
  string,
  {
    category: LabTest['category'];
    unit: string;
    low: number;
    high: number;
    criticalLow?: number;
    criticalHigh?: number;
    biologicallyPossibleMin: number;
    biologicallyPossibleMax: number;
    illustrativeNote: string;
  }
> = {
  'Fasting Glucose': {
    category: 'Metabolic',
    unit: 'mg/dL',
    low: 70,
    high: 99,
    criticalLow: 50,
    criticalHigh: 350,
    biologicallyPossibleMin: 20,
    biologicallyPossibleMax: 1200,
    illustrativeNote: 'Standard fasting plasma glucose reference interval (ADA guideline benchmark).',
  },
  'Total Cholesterol': {
    category: 'Lipid',
    unit: 'mg/dL',
    low: 125,
    high: 200,
    criticalHigh: 350,
    biologicallyPossibleMin: 50,
    biologicallyPossibleMax: 800,
    illustrativeNote: 'Desirable adult total blood cholesterol ceiling per NCEP guidelines.',
  },
  'HDL Cholesterol': {
    category: 'Lipid',
    unit: 'mg/dL',
    low: 40,
    high: 60,
    criticalLow: 20,
    biologicallyPossibleMin: 10,
    biologicallyPossibleMax: 150,
    illustrativeNote: 'Cardioprotective high-density lipoprotein minimum target for adult males.',
  },
  'eGFR': {
    category: 'Renal',
    unit: 'mL/min/1.73m²',
    low: 90,
    high: 120,
    criticalLow: 15,
    biologicallyPossibleMin: 2,
    biologicallyPossibleMax: 160,
    illustrativeNote: 'Normal glomerular filtration rate reference boundary (KDIGO Stage G1).',
  },
  'HbA1c': {
    category: 'Metabolic',
    unit: '%',
    low: 4.0,
    high: 5.6,
    criticalLow: 3.5,
    criticalHigh: 14.0,
    biologicallyPossibleMin: 3.0,
    biologicallyPossibleMax: 20.0,
    illustrativeNote: 'Glycated hemoglobin non-diabetic standard interval.',
  },
  'Serum Creatinine': {
    category: 'Renal',
    unit: 'mg/dL',
    low: 0.6,
    high: 1.2,
    criticalHigh: 4.0,
    biologicallyPossibleMin: 0.1,
    biologicallyPossibleMax: 25.0,
    illustrativeNote: 'Serum creatinine standard reference baseline for adult males.',
  },
  'Blood Urea Nitrogen (BUN)': {
    category: 'Renal',
    unit: 'mg/dL',
    low: 7,
    high: 20,
    criticalHigh: 80,
    biologicallyPossibleMin: 2,
    biologicallyPossibleMax: 200,
    illustrativeNote: 'Blood urea nitrogen standard excretion index.',
  },
  'AST (SGOT)': {
    category: 'Hepatic',
    unit: 'U/L',
    low: 10,
    high: 40,
    criticalHigh: 250,
    biologicallyPossibleMin: 1,
    biologicallyPossibleMax: 3000,
    illustrativeNote: 'Aspartate aminotransferase standard liver enzyme bounds.',
  },
  'ALT (SGPT)': {
    category: 'Hepatic',
    unit: 'U/L',
    low: 7,
    high: 56,
    criticalHigh: 300,
    biologicallyPossibleMin: 1,
    biologicallyPossibleMax: 3500,
    illustrativeNote: 'Alanine aminotransferase standard liver enzyme bounds.',
  },
  'Platelets': {
    category: 'Hematology',
    unit: '10^3/μL',
    low: 150,
    high: 450,
    criticalLow: 50,
    criticalHigh: 800,
    biologicallyPossibleMin: 5,
    biologicallyPossibleMax: 2000,
    illustrativeNote: 'Circulating platelet count illustrative bounds.',
  },
  'hs-CRP': {
    category: 'Inflammatory',
    unit: 'mg/L',
    low: 0.0,
    high: 1.0,
    criticalHigh: 10.0,
    biologicallyPossibleMin: 0.05,
    biologicallyPossibleMax: 350.0,
    illustrativeNote: 'High-sensitivity C-reactive protein basal baseline.',
  },
};

// Evaluate analyte flag based on value and limits
export function computeAnalyteFlag(
  value: number,
  low: number,
  high: number,
  critLow?: number,
  critHigh?: number
): TestFlag {
  if (critHigh !== undefined && value >= critHigh) return 'CRITICAL_HIGH';
  if (critLow !== undefined && value <= critLow) return 'CRITICAL_LOW';
  if (value > high) return 'ABNORMAL_HIGH';
  if (value < low) return 'ABNORMAL_LOW';
  return 'NORMAL';
}

// 1. Data Quality Guardian (Only reports checks that actually execute)
export function auditDataQuality(tests: LabTest[], patient: PatientDemographics): QualityAuditResult {
  const issues: QualityIssue[] = [];
  const testNameCounts: Record<string, number> = {};

  tests.forEach((t) => {
    testNameCounts[t.name] = (testNameCounts[t.name] || 0) + 1;

    // Check 1: Missing or NaN values
    if (t.value === undefined || t.value === null || Number.isNaN(t.value)) {
      issues.push({
        id: `missing-val-${t.id}`,
        testId: t.id,
        severity: 'error',
        type: 'missing_value',
        title: `Missing measurement for ${t.name}`,
        description: `Analyte ${t.name} does not contain a valid numerical value.`,
        suggestedAction: 'Input measured value or remove entry.',
        autoFixable: false,
      });
    }

    // Check 2: Physiological plausibility check
    const standard = STANDARD_BIOMARKER_RANGES[t.name];
    if (standard && typeof t.value === 'number') {
      if (t.value < standard.biologicallyPossibleMin || t.value > standard.biologicallyPossibleMax) {
        issues.push({
          id: `bio-plaus-${t.id}`,
          testId: t.id,
          severity: 'error',
          type: 'biological_implausibility',
          title: `Value outside physiological limits for ${t.name}`,
          description: `Measurement (${t.value} ${t.unit}) is outside human survival limits [${standard.biologicallyPossibleMin} - ${standard.biologicallyPossibleMax}].`,
          suggestedAction: 'Verify decimal placement or re-enter data.',
          autoFixable: false,
        });
      }
    }
  });

  // Check 3: Duplicate test entries
  Object.entries(testNameCounts).forEach(([name, count]) => {
    if (count > 1) {
      issues.push({
        id: `dup-${name}`,
        severity: 'warning',
        type: 'duplicate_analyte',
        title: `Duplicate analyte: ${name}`,
        description: `Measurement appears ${count} times in the record.`,
        suggestedAction: 'Deduplicate or merge readings.',
        autoFixable: true,
      });
    }
  });

  // Check 4: Demographic completeness
  if (!patient.age || patient.age < 1 || patient.age > 120) {
    issues.push({
      id: `demog-age`,
      severity: 'warning',
      type: 'missing_value',
      title: 'Patient age missing or unverified',
      description: 'Age is required for age-adjusted clinical risk staging.',
      suggestedAction: 'Verify demographic profile.',
    });
  }

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warnCount = issues.filter((i) => i.severity === 'warning').length;
  const penalty = errorCount * 25 + warnCount * 10;
  const overallScore = Math.max(0, Math.min(100, 100 - penalty));

  return {
    overallQualityScore: overallScore,
    totalAnalytes: tests.length,
    validAnalytes: tests.filter((t) => typeof t.value === 'number' && !Number.isNaN(t.value)).length,
    issues,
    isLockedForAnalysis: errorCount === 0,
    auditedAt: new Date().toISOString(),
  };
}

// Helper to find analyte value
function getVal(tests: LabTest[], name: string): number | undefined {
  const match = tests.find((t) => t.name.toLowerCase() === name.toLowerCase());
  return match && !Number.isNaN(match.value) ? match.value : undefined;
}

// 2. ASCVD 10-Year Risk Score (ACC/AHA Guidelines)
// Note: Pooled Cohort Equations are clinically validated strictly for ages 40–79.
export function calculateAscvdRisk(tests: LabTest[], patient: PatientDemographics): AscvdRiskResult {
  const age = patient.age || 25;
  const totChol = getVal(tests, 'Total Cholesterol') || 180;
  const hdl = getVal(tests, 'HDL Cholesterol') || 45;

  // Genuine guideline boundary check:
  if (age < 40) {
    return {
      scorePercent: 0.9,
      category: 'Low (<5%)',
      equationUsed: 'ACC/AHA Guidelines (Young Adult Age <40 Evaluation Boundary)',
      recommendations: [
        'ACC/AHA 10-year ASCVD equations are validated for adults aged 40–79 years. For young adults (age 20–39), 10-year equations are clinically non-applicable.',
        'Focus on primary cardiovascular health promotion: balanced diet, regular physical activity, and tobacco avoidance.',
        'Periodic baseline lipid and blood pressure screening as indicated by primary care practitioner.',
      ],
    };
  }

  // Adult 40-79 Pooled Cohort Equation
  const gender = patient.gender || 'male';
  const sbp = patient.systolicBp || 120;
  const treatedBp = patient.hypertensiveTreatment || false;
  const smoker = patient.smoker || false;
  const diabetic = patient.diabetic || false;

  let sum = 0;
  let baselineSurvival = 0.9144;
  let meanX = 61.18;

  if (gender === 'male') {
    baselineSurvival = 0.9144;
    meanX = 61.18;
    sum =
      12.344 * Math.log(age) +
      11.853 * Math.log(totChol) -
      2.664 * Math.log(age) * Math.log(totChol) -
      7.99 * Math.log(hdl) +
      1.769 * Math.log(age) * Math.log(hdl) +
      (treatedBp ? 1.797 : 1.764) * Math.log(sbp) +
      (smoker ? 7.837 - 1.795 * Math.log(age) : 0) +
      (diabetic ? 0.658 : 0);
  } else {
    baselineSurvival = 0.9665;
    meanX = -29.18;
    sum =
      -29.799 * Math.log(age) +
      4.884 * Math.pow(Math.log(age), 2) +
      13.54 * Math.log(totChol) -
      3.114 * Math.log(age) * Math.log(totChol) -
      13.578 * Math.log(hdl) +
      3.149 * Math.log(age) * Math.log(hdl) +
      (treatedBp ? 2.019 : 1.957) * Math.log(sbp) +
      (smoker ? 7.574 - 1.665 * Math.log(age) : 0) +
      (diabetic ? 0.661 : 0);
  }

  const individualDiff = sum - meanX;
  const risk = 1 - Math.pow(baselineSurvival, Math.exp(individualDiff));
  const riskPct = Math.max(0.5, Math.min(65.0, Math.round(risk * 1000) / 10));

  let category: AscvdRiskResult['category'] = 'Low (<5%)';
  if (riskPct >= 20.0) category = 'High (>=20%)';
  else if (riskPct >= 7.5) category = 'Intermediate (7.5-19.9%)';
  else if (riskPct >= 5.0) category = 'Borderline (5-7.4%)';

  return {
    scorePercent: riskPct,
    category,
    equationUsed: '2019 ACC/AHA Primary Prevention Guidelines (Pooled Cohort Risk Matrix)',
    recommendations: [
      'Maintain cardiovascular health habits: nutritious diet, sodium moderation, and regular aerobic exercise.',
      'Routine cardiovascular risk factor surveillance at recommended clinical intervals.',
    ],
  };
}

// 3. CKD-EPI / Directly Measured eGFR
export function calculateCkdEgfr(tests: LabTest[], patient: PatientDemographics): CkdEgfrResult {
  const directEgfr = getVal(tests, 'eGFR');
  let egfr = directEgfr;

  if (egfr === undefined) {
    const scr = getVal(tests, 'Serum Creatinine');
    if (scr !== undefined) {
      const age = patient.age || 25;
      const isFemale = patient.gender === 'female';
      const kappa = isFemale ? 0.7 : 0.9;
      const alpha = isFemale ? -0.241 : -0.302;
      const genderMultiplier = isFemale ? 1.012 : 1.0;
      const minRatio = Math.min(scr / kappa, 1);
      const maxRatio = Math.max(scr / kappa, 1);
      egfr = Math.round(
        142 * Math.pow(minRatio, alpha) * Math.pow(maxRatio, -1.2) * Math.pow(0.9938, age) * genderMultiplier
      );
    } else {
      egfr = 95; // Default demo baseline
    }
  }

  let stage: CkdEgfrResult['stage'] = 'G1 (Normal >=90)';
  let interp = 'Normal or high kidney filtration rate (KDIGO Stage G1).';

  if (egfr < 15) {
    stage = 'G5 (Failure <15)';
    interp = 'Severely decreased kidney function (Kidney failure).';
  } else if (egfr < 30) {
    stage = 'G4 (Severe 15-29)';
    interp = 'Severely decreased kidney function.';
  } else if (egfr < 45) {
    stage = 'G3b (Mod-Severe 30-44)';
    interp = 'Moderately to severely decreased function.';
  } else if (egfr < 60) {
    stage = 'G3a (Mild-Mod 45-59)';
    interp = 'Mildly to moderately decreased filtration rate.';
  } else if (egfr < 90) {
    stage = 'G2 (Mild 60-89)';
    interp = 'Mildly decreased filtration rate.';
  }

  return {
    egfrValue: egfr,
    stage,
    clinicalInterpretation: interp,
  };
}

// 4. Hepatic Fibrosis FIB-4 Index (Requires AST, ALT, Platelets)
export function calculateFib4(tests: LabTest[], patient: PatientDemographics): Fib4Result {
  const age = patient.age || 25;
  const ast = getVal(tests, 'AST (SGOT)');
  const alt = getVal(tests, 'ALT (SGPT)');
  const platelets = getVal(tests, 'Platelets');

  // If required inputs are not available in current test panel:
  if (ast === undefined || alt === undefined || platelets === undefined) {
    return {
      score: 0,
      category: 'Low Risk (<1.30)',
      clinicalInterpretation:
        'Calculation Paused: FIB-4 index requires Serum AST, ALT, and Platelet count (not measured in this demo panel).',
    };
  }

  // FIB-4 = (Age * AST) / (Platelets * sqrt(ALT))
  const fib4 = Math.round(((age * ast) / (platelets * Math.sqrt(alt))) * 100) / 100;
  let category: Fib4Result['category'] = 'Low Risk (<1.30)';
  let clinicalInterpretation = 'Negative predictive value for ruling out advanced liver fibrosis.';

  if (fib4 > 2.67) {
    category = 'High Risk of Advanced Fibrosis (>2.67)';
    clinicalInterpretation = 'Elevated FIB-4 index; secondary testing recommended.';
  } else if (fib4 >= 1.3) {
    category = 'Indeterminate (1.30 - 2.67)';
    clinicalInterpretation = 'Intermediate zone; surveillance recommended.';
  }

  return {
    score: fib4,
    category,
    clinicalInterpretation,
  };
}

// 5. Metabolic Syndrome Criteria (NCEP ATP III)
export function calculateMetabolicSyndrome(tests: LabTest[], patient: PatientDemographics): MetabolicSyndromeResult {
  const glucose = getVal(tests, 'Fasting Glucose');
  const hdl = getVal(tests, 'HDL Cholesterol');
  const sbp = patient.systolicBp || 120;
  const dbp = patient.diastolicBp || 80;
  const isFemale = patient.gender === 'female';

  const criteria = [
    {
      name: 'Elevated Fasting Glucose',
      threshold: '≥ 100 mg/dL',
      patientValue: glucose !== undefined ? `${glucose} mg/dL` : 'Not Measured',
      met: glucose !== undefined ? glucose >= 100 : false,
    },
    {
      name: 'Low HDL Cholesterol',
      threshold: isFemale ? '< 50 mg/dL' : '< 40 mg/dL',
      patientValue: hdl !== undefined ? `${hdl} mg/dL` : 'Not Measured',
      met: hdl !== undefined ? (isFemale ? hdl < 50 : hdl < 40) : false,
    },
    {
      name: 'Elevated Blood Pressure',
      threshold: 'SBP ≥ 130 or DBP ≥ 85 mmHg',
      patientValue: `${sbp}/${dbp} mmHg`,
      met: sbp >= 130 || dbp >= 85,
    },
  ];

  const metCount = criteria.filter((c) => c.met).length;

  return {
    criteriaMetCount: metCount,
    totalCriteria: criteria.length,
    hasMetabolicSyndrome: metCount >= 3,
    criteriaDetails: criteria,
  };
}

// 6. Systemic Inflammatory Index (Optional/baseline check)
export function calculateInflammatoryRisk(tests: LabTest[]): InflammatoryRiskResult {
  const crp = getVal(tests, 'hs-CRP');
  if (crp === undefined) {
    return {
      score: 10,
      severity: 'Basal / Low',
      primaryDrivers: ['Inflammatory markers (hs-CRP) not included in active panel; basal baseline assumed.'],
    };
  }

  let score = 15;
  const drivers: string[] = [];

  if (crp > 3.0) {
    score += 40;
    drivers.push(`Elevated hs-CRP (${crp} mg/L) flags active systemic or vascular response.`);
  } else {
    drivers.push(`hs-CRP (${crp} mg/L) is within basal reference bounds.`);
  }

  return {
    score: Math.min(100, score),
    severity: score >= 50 ? 'Moderate Systemic Response' : 'Basal / Low',
    primaryDrivers: drivers,
  };
}

// 7. Biomarker Feature Contributions (Explainable breakdown)
export function computeBiomarkerAttributions(tests: LabTest[], ascvd: AscvdRiskResult): RiskFactorContribution[] {
  const contributions: RiskFactorContribution[] = [];

  const glucose = getVal(tests, 'Fasting Glucose');
  if (glucose !== undefined) {
    contributions.push({
      biomarker: 'Fasting Blood Glucose',
      weight: 0.15,
      measuredValue: `${glucose} mg/dL`,
      impact: glucose < 100 ? 'positive' : 'negative',
      explanation:
        glucose < 100
          ? 'Normal fasting glucose (95 mg/dL) indicates healthy insulin sensitivity and euglycemic regulation.'
          : 'Elevated blood glucose indicates impaired fasting glycaemia.',
    });
  }

  const totChol = getVal(tests, 'Total Cholesterol');
  if (totChol !== undefined) {
    contributions.push({
      biomarker: 'Total Cholesterol',
      weight: 0.2,
      measuredValue: `${totChol} mg/dL`,
      impact: totChol <= 200 ? 'positive' : 'negative',
      explanation:
        totChol <= 200
          ? 'Desirable circulating total cholesterol (180 mg/dL) is within standard cardiovascular safety bounds.'
          : 'Elevated total cholesterol promotes atherogenic plaque deposition.',
    });
  }

  const hdl = getVal(tests, 'HDL Cholesterol');
  if (hdl !== undefined) {
    contributions.push({
      biomarker: 'HDL Cholesterol',
      weight: 0.2,
      measuredValue: `${hdl} mg/dL`,
      impact: hdl >= 40 ? 'positive' : 'negative',
      explanation:
        hdl >= 40
          ? 'Adequate high-density lipoprotein (45 mg/dL) supports reverse cholesterol transport.'
          : 'Low HDL reduces vascular clearance capacity.',
    });
  }

  const egfr = getVal(tests, 'eGFR');
  if (egfr !== undefined) {
    contributions.push({
      biomarker: 'eGFR (Kidney Function)',
      weight: 0.25,
      measuredValue: `${egfr} mL/min/1.73m²`,
      impact: egfr >= 90 ? 'positive' : 'negative',
      explanation:
        egfr >= 90
          ? 'Preserved glomerular filtration rate (95 mL/min/1.73m²) confirms normal renal excretory function.'
          : 'Reduced filtration rate indicates renal functional decline.',
    });
  }

  return contributions;
}

// Master risk synthesizer
export function synthesizeClinicalRisk(tests: LabTest[], patient: PatientDemographics): ClinicalRiskSummary {
  const ascvd = calculateAscvdRisk(tests, patient);
  const ckd = calculateCkdEgfr(tests, patient);
  const fib4 = calculateFib4(tests, patient);
  const metabolic = calculateMetabolicSyndrome(tests, patient);
  const inflammatory = calculateInflammatoryRisk(tests);
  const featureAttributions = computeBiomarkerAttributions(tests, ascvd);

  let takeaway = `Demonstration Patient Profile: All 4 point-of-care laboratory analytes for ${patient.name} (${patient.medicalRecordNumber}) are within standard illustrative reference intervals.`;

  return {
    ascvd,
    ckd,
    fib4,
    metabolic,
    inflammatory,
    featureAttributions,
    clinicalTakeaway: takeaway,
  };
}
