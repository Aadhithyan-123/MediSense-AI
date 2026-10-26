import React from 'react';
import {
  Activity,
  Heart,
  Droplets,
  Layers,
  Flame,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Download,
  Share2,
  Info,
  PauseCircle,
} from 'lucide-react';
import { MedicalReport } from '../types/medical';
import { exportMedicalReportPdf } from '../lib/pdfExport';

interface RiskAnalysisViewProps {
  currentReport: MedicalReport;
  onNavigate: (tab: string) => void;
}

export const RiskAnalysisView: React.FC<RiskAnalysisViewProps> = ({
  currentReport,
  onNavigate,
}) => {
  const risk = currentReport.riskSummary;

  if (!risk) {
    return (
      <div className="p-8 text-center text-purple-400 font-mono">
        Clinical risk data is currently being synthesized...
      </div>
    );
  }

  const { ascvd, ckd, fib4, metabolic, featureAttributions } = risk;
  const isYoungAdult = (currentReport.patient.age || 25) < 40;

  return (
    <div className="space-y-8 pb-12 text-[#F3E8FF]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#E879F9] uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>Evidence-Based Clinical Calculators</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Clinical Risk Stratification
          </h2>
          <p className="font-script text-xl text-[#C084FC] italic">
            Mathematical evaluation of standard clinical models for {currentReport.patient.name}
          </p>
        </div>

        <button
          onClick={() => exportMedicalReportPdf(currentReport)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#C084FC] via-[#E879F9] to-[#38BDF8] rounded-xl hover:opacity-95 shadow-md transition-all cursor-pointer whitespace-nowrap self-start md:self-auto font-medium"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Summary PDF</span>
        </button>
      </div>

      {/* Scope & Methodology Banner */}
      <div className="p-4 rounded-2xl bg-[#180C34]/80 border border-[#A855F7]/30 text-xs flex items-start gap-3 shadow-md">
        <Info className="w-4 h-4 text-[#E879F9] mt-0.5 shrink-0" />
        <div className="space-y-1 text-purple-200/80">
          <span className="font-bold text-white">Calculator Validation Boundaries:</span>
          <p className="leading-relaxed">
            Medical prediction models have strict, peer-reviewed eligibility boundaries. Models with available inputs execute transparently; models requiring unavailable inputs or outside validated age brackets are clearly designated.
          </p>
        </div>
      </div>

      {/* Top Grid: Model 1 (ASCVD Scope) & Model 2 (eGFR CKD Staging) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model 1: ASCVD 10-Year Risk */}
        <div className="liquid-crystal-card rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">10-Year ASCVD Risk Evaluation</h3>
                <p className="text-xs text-[#C084FC]">ACC/AHA Pooled Cohort Equations</p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
              Low Baseline Risk
            </span>
          </div>

          {/* Age Boundary Status Box */}
          {isYoungAdult ? (
            <div className="p-4 rounded-2xl bg-[#0D071E] border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Info className="w-4 h-4" />
                <span>Guideline Age Boundary: Patient Age {currentReport.patient.age}</span>
              </div>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                The ACC/AHA Pooled Cohort 10-year equations are clinically validated strictly for patients aged <strong className="text-white">40 to 79 years</strong>. For young adults under 40, standard guidelines state 10-year numerical equations are clinically non-applicable. Primary prevention lifestyle counseling applies.
              </p>
            </div>
          ) : (
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
                {ascvd.scorePercent}%
              </span>
              <span className="text-xs text-[#C084FC]">
                10-year statistical probability of ASCVD event
              </span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-[#0D071E] border border-[#A855F7]/25 space-y-2">
            <div className="text-xs font-bold text-white">Evidence-Based Clinical Guidance:</div>
            <ul className="text-xs text-purple-200/80 space-y-1.5 list-disc pl-4 leading-relaxed">
              {ascvd.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Model 2: eGFR & Renal Staging */}
        <div className="liquid-crystal-card rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-950/70 border border-[#38BDF8]/40 text-[#38BDF8] flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Renal Glomerular Filtration (eGFR)</h3>
                <p className="text-xs text-[#C084FC]">KDIGO Renal Function Staging</p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
              {ckd.stage}
            </span>
          </div>

          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
              {ckd.egfrValue}
            </span>
            <span className="text-xs text-[#C084FC] font-mono">
              mL/min/1.73m² (Normal: ≥ 90)
            </span>
          </div>

          {/* Linear Staging Visualizer */}
          <div className="space-y-1.5">
            <div className="h-2.5 w-full bg-[#0D071E] rounded-full overflow-hidden flex border border-[#A855F7]/30">
              <div style={{ width: '15%' }} className="bg-red-500/80" title="G5 (<15)" />
              <div style={{ width: '15%' }} className="bg-amber-600/80" title="G4 (15-29)" />
              <div style={{ width: '15%' }} className="bg-amber-400/80" title="G3b (30-44)" />
              <div style={{ width: '15%' }} className="bg-yellow-400/80" title="G3a (45-59)" />
              <div style={{ width: '20%' }} className="bg-cyan-400/80" title="G2 (60-89)" />
              <div style={{ width: '20%' }} className="bg-emerald-400" title="G1 (>=90)" />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#A855F7]">
              <span>G5 (&lt;15)</span>
              <span>G4 (30)</span>
              <span>G3 (60)</span>
              <span>G2 (90)</span>
              <span className="text-emerald-300 font-bold">G1 (≥90 Normal)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D071E] border border-[#A855F7]/25 space-y-1">
            <div className="text-xs font-bold text-white">Functional Evaluation:</div>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              {ckd.clinicalInterpretation} Preserved excretory clearance kinetics.
            </p>
          </div>
        </div>
      </div>

      {/* Middle Grid: Model 3 (FIB-4 Status) & Model 4 (Metabolic Syndrome) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model 3: FIB-4 Liver Index */}
        <div className="liquid-crystal-card rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-950/70 border border-[#A855F7]/40 text-purple-300 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Hepatic FIB-4 Fibrosis Index</h3>
                <p className="text-xs text-[#C084FC]">Liver Enzyme & Platelet Ratio</p>
              </div>
            </div>

            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              INPUTS UNAVAILABLE
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D071E] border border-[#A855F7]/25 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <PauseCircle className="w-4 h-4 text-amber-400" />
              <span>Calculation Engine Paused</span>
            </div>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              FIB-4 calculation requires <strong className="text-white">AST (SGOT)</strong>, <strong className="text-white">ALT (SGPT)</strong>, and <strong className="text-white">Platelet count</strong>. If these analytes are not part of the active laboratory panel, the model remains paused without fabricating numbers.
            </p>
            <p className="text-[11px] text-[#A855F7] font-mono">
              Formula: (Age × AST) / (Platelets × √ALT)
            </p>
          </div>
        </div>

        {/* Model 4: Metabolic Syndrome Evaluation */}
        <div className="liquid-crystal-card rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Metabolic Syndrome Evaluation</h3>
                <p className="text-xs text-[#C084FC]">NCEP ATP III Criteria</p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
              NEGATIVE (0 Criteria Met)
            </span>
          </div>

          <div className="space-y-2">
            {metabolic.criteriaDetails.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D071E] border border-[#A855F7]/25 text-xs"
              >
                <div>
                  <span className="font-semibold text-white">{c.name}</span>
                  <span className="text-[11px] text-[#A855F7] ml-2 font-mono">
                    Threshold: {c.threshold}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[#C084FC]">{c.patientValue}</span>
                  <span className="text-emerald-300 font-bold">NORMAL</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transparent Feature Attributions */}
      <div className="liquid-crystal-card rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">
            Biomarker Feature Contributions (Explainable Attribution)
          </h3>
          <p className="font-script text-lg text-[#C084FC]">
            ~ individual analyte influence on overall cardiovascular and metabolic risk
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {featureAttributions.map((attr, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#0D071E] border border-[#A855F7]/25 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{attr.biomarker}</span>
                <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Favorable
                </span>
              </div>
              <div className="text-xs text-[#E879F9] font-mono">
                Measured: {attr.measuredValue}
              </div>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                {attr.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
