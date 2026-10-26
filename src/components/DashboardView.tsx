import React from 'react';
import {
  FileText,
  ShieldCheck,
  Activity,
  Heart,
  Droplets,
  Microscope,
  Cpu,
  ArrowRight,
  TrendingUp,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { MedicalReport } from '../types/medical';
import { exportMedicalReportPdf } from '../lib/pdfExport';

interface DashboardViewProps {
  currentReport: MedicalReport;
  allReports: MedicalReport[];
  onSelectReport: (reportId: string) => void;
  onNavigate: (tab: string) => void;
  onOpenHardwareModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentReport,
  allReports,
  onSelectReport,
  onNavigate,
  onOpenHardwareModal,
}) => {
  const quality = currentReport.qualityAudit;
  const isDemoReport = currentReport.patient.medicalRecordNumber === 'DEMO-001';

  return (
    <div className="space-y-8 pb-12 text-[#F3E8FF]">
      {/* Active Patient & Report Context Liquid Crystal Ribbon */}
      <div className="liquid-crystal-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        {/* Iridescent crystal glow orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#9333EA]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#E879F9]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span
                className={`px-3 py-0.5 rounded-full font-bold uppercase tracking-wide border ${
                  isDemoReport
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-[#9333EA]/30 text-[#E879F9] border-[#E879F9]/40'
                }`}
              >
                {isDemoReport ? 'DEMO DATA (FICTIONAL)' : 'UPLOADED PATIENT RECORD'}
              </span>
              <span className="text-[#A855F7]/40">·</span>
              <span className="text-[#C084FC] font-bold">
                PATIENT ID: {currentReport.patient.medicalRecordNumber}
              </span>
              <span className="text-[#A855F7]/40">·</span>
              <span className="text-[#38BDF8]">
                {currentReport.sourceType}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {currentReport.patient.name}
              </h2>
              <span className="font-script text-xl text-[#E879F9] italic">
                ~ Verified Case Profile
              </span>
            </div>

            {/* Core Patient Details Grid */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#C084FC]/90 pt-1">
              <div>
                <span>Age / Gender: </span>
                <strong className="text-white">
                  {currentReport.patient.age} yrs ({currentReport.patient.gender})
                </strong>
              </div>
              <div>
                <span>Blood Pressure: </span>
                <strong className="text-white font-mono">
                  {currentReport.patient.systolicBp || 120}/{currentReport.patient.diastolicBp || 80} mmHg
                </strong>
              </div>
              <div>
                <span>Fasting Status: </span>
                <strong className="text-white">
                  {currentReport.patient.fastingHours || 10} Hours
                </strong>
              </div>
              <div>
                <span>Facility: </span>
                <strong className="text-white">
                  {currentReport.labFacility}
                </strong>
              </div>
            </div>
          </div>

          {/* Quick Actions & Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {allReports.length > 1 && (
              <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#0D071E]/80 border border-[#A855F7]/30">
                <span className="text-[11px] text-[#C084FC] font-mono px-2">Cases:</span>
                {allReports.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onSelectReport(r.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      r.id === currentReport.id
                        ? 'bg-gradient-to-r from-[#9333EA] to-[#C084FC] text-white shadow-sm'
                        : 'text-[#C084FC] hover:text-white hover:bg-purple-950/40'
                    }`}
                  >
                    {r.patient.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenHardwareModal}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#C084FC] hover:text-white bg-[#0D071E] border border-[#A855F7]/30 rounded-xl hover:border-[#E879F9] transition-colors cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5 text-[#E879F9]" />
                <span>POCT Console</span>
              </button>

              <button
                onClick={() => exportMedicalReportPdf(currentReport)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#C084FC] via-[#E879F9] to-[#38BDF8] rounded-xl hover:opacity-95 transition-all shadow-md cursor-pointer font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Workflow Progression Pipeline */}
        <div className="mt-6 pt-5 border-t border-[#A855F7]/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0" />
            <span>1. Specimen Intake</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0" />
            <span>2. {currentReport.tests.length} Analytes Processed</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0" />
            <span>3. Integrity Audited ({quality.overallQualityScore}%)</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-[#E879F9] shrink-0" />
            <span>4. Certified Review</span>
          </div>
        </div>
      </div>

      {/* Primary Laboratory Results Strip */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Microscope className="w-5 h-5 text-[#E879F9]" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Laboratory Measurements ({currentReport.tests.length} Analytes)
            </h3>
            <span className="font-script text-base text-[#C084FC] ml-2 hidden sm:inline">
              ~ clinical reference evaluation
            </span>
          </div>

          <button
            onClick={() => onNavigate('interpreter')}
            className="text-xs text-[#E879F9] hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Open Laboratory Interpreter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentReport.tests.map((test) => (
            <div
              key={test.id}
              onClick={() => onNavigate('interpreter')}
              className="liquid-crystal-card rounded-2xl p-5 hover:border-[#E879F9]/80 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#C084FC]/80">
                  {test.category}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    test.flag === 'NORMAL'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-950/80 text-red-300 border-red-500/40'
                  }`}
                >
                  {test.flag}
                </span>
              </div>

              <div>
                <div className="text-sm font-bold text-white group-hover:text-[#E879F9] transition-colors">
                  {test.name}
                </div>
                <div className="mt-1 flex items-baseline gap-1.5 font-mono">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                    {test.value}
                  </span>
                  <span className="text-xs text-[#C084FC]">{test.unit}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#A855F7]/20 space-y-1">
                <div className="text-[11px] text-[#A855F7] font-mono">
                  Illustrative: {test.referenceLow} - {test.referenceHigh} {test.unit}
                </div>
                {test.notes && (
                  <p className="text-[11px] text-purple-200/80 line-clamp-2">
                    {test.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Secondary Functional Cards with Liquid Crystal Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Quality Guardian Card */}
        <div
          onClick={() => onNavigate('guardian')}
          className="liquid-crystal-card rounded-2xl p-6 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#C084FC]">Data Quality</span>
            <ShieldCheck className="w-5 h-5 text-[#2DD4BF] group-hover:scale-110 transition-transform" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#2DD4BF] font-mono tabular-nums">
              {quality.validAnalytes} / {quality.totalAnalytes}
            </span>
            <span className="text-xs text-[#C084FC]">Analytes Verified</span>
          </div>

          <p className="text-xs text-purple-200/80 leading-relaxed">
            Format validation, missing value detection, and physiological survival bounds audited for this specimen.
          </p>

          <div className="pt-2 flex items-center gap-1 text-xs text-[#2DD4BF] font-semibold">
            <span>Inspect Quality Guardian details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Clinical Risk Staging Card */}
        <div
          onClick={() => onNavigate('risk')}
          className="liquid-crystal-card rounded-2xl p-6 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#C084FC]">Clinical Risk</span>
            <Activity className="w-5 h-5 text-[#E879F9] group-hover:scale-110 transition-transform" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              {currentReport.riskSummary?.ckd.stage || 'G1 Stage'}
            </span>
          </div>

          <p className="text-xs text-purple-200/80 leading-relaxed">
            Evidence-based evaluation based on ACC/AHA cardiovascular guidelines and KDIGO glomerular staging.
          </p>

          <div className="pt-2 flex items-center gap-1 text-xs text-[#E879F9] font-semibold">
            <span>Inspect clinical models & calculators</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* AI Assistant Support Card */}
        <div
          onClick={() => onNavigate('assistant')}
          className="liquid-crystal-card rounded-2xl p-6 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#C084FC]">AI Decision Support</span>
            <Sparkles className="w-5 h-5 text-[#38BDF8] group-hover:scale-110 transition-transform" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              Grounded Chat
            </span>
          </div>

          <p className="text-xs text-purple-200/80 leading-relaxed">
            Interactive inquiry grounded strictly on {currentReport.patient.name}'s verified laboratory results.
          </p>

          <div className="pt-2 flex items-center gap-1 text-xs text-[#38BDF8] font-semibold">
            <span>Ask clinical questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
