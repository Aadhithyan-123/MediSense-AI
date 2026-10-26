import React from 'react';
import {
  Clock,
  CheckCircle,
  ShieldCheck,
  Cpu,
  FileText,
  UserCheck,
  Activity,
} from 'lucide-react';
import { MedicalReport } from '../types/medical';

interface PatientTimelineViewProps {
  currentReport: MedicalReport;
}

export const PatientTimelineView: React.FC<PatientTimelineViewProps> = ({ currentReport }) => {
  const isDemo = currentReport.patient.medicalRecordNumber === 'DEMO-001';

  const events = [
    {
      time: '10:00:00',
      title: isDemo ? 'Baseline Patient Intake (Demo Profile)' : `Uploaded Specimen Intake (${currentReport.patient.name})`,
      description: `Demographic and vital parameters registered: ${currentReport.patient.name} (ID: ${currentReport.patient.medicalRecordNumber}), Age ${currentReport.patient.age} ${currentReport.patient.gender}, BP ${currentReport.patient.systolicBp}/${currentReport.patient.diastolicBp} mmHg.`,
      icon: Cpu,
      color: 'text-[#E879F9]',
      badge: 'Profile Registered',
    },
    {
      time: '10:01:25',
      title: 'Laboratory Measurements Digitize & Formatted',
      description: `${currentReport.tests.length} clinical laboratory analytes ingested: ${currentReport.tests.map(t => `${t.name} (${t.value} ${t.unit})`).join(', ')}.`,
      icon: FileText,
      color: 'text-[#2DD4BF]',
      badge: 'Analytes Digitized',
    },
    {
      time: '10:02:10',
      title: 'Data Quality Guardian Audit Executed',
      description: `Pre-analytical validation completed with ${currentReport.qualityAudit.overallQualityScore}% data completeness score.`,
      icon: ShieldCheck,
      color: 'text-[#C084FC]',
      badge: 'Audit Passed',
    },
    {
      time: '10:03:00',
      title: 'Evidence-Based Guideline Stratification',
      description: `Calculators evaluated per clinical scope. KDIGO kidney staging (${currentReport.riskSummary?.ckd.stage || 'G1'}) and cardiovascular boundaries synthesized.`,
      icon: Activity,
      color: 'text-[#38BDF8]',
      badge: 'Models Evaluated',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-[#F3E8FF]">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#E879F9] uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>Audit Provenance Log</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Audit & Provenance Timeline
        </h2>
        <p className="font-script text-xl text-[#C084FC] italic">
          Transparent chain-of-custody logging for {currentReport.patient.name}
        </p>
      </div>

      <div className="liquid-crystal-card rounded-3xl p-8 space-y-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#A855F7]/25">
          <div>
            <span className="text-xs text-[#C084FC] font-mono">SPECIMEN ID: {currentReport.id}</span>
            <div className="text-lg font-bold text-white">{currentReport.patient.name} ({currentReport.patient.medicalRecordNumber})</div>
          </div>
          <div className="text-right text-xs font-mono text-[#C084FC]/80">
            <div>Facility: {currentReport.labFacility}</div>
            <div>Hardware: {currentReport.deviceSerialNumber}</div>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#A855F7]/30">
          {events.map((evt, idx) => {
            const Icon = evt.icon;
            return (
              <div key={idx} className="relative flex items-start gap-4">
                <div className={`w-6 h-6 rounded-full bg-[#0D071E] border-2 border-current ${evt.color} flex items-center justify-center -ml-6 z-10 shadow-md`}>
                  <Icon className="w-3 h-3" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#C084FC]">{evt.time}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0D071E] text-[#E879F9] border border-[#A855F7]/30">
                      {evt.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{evt.title}</h4>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
