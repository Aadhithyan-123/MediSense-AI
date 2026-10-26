import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  FileQuestion,
  Clock,
  ArrowRight,
  Upload,
} from 'lucide-react';
import { MedicalReport } from '../types/medical';

interface HealthTrendsViewProps {
  currentReport: MedicalReport;
  onNavigate?: (tab: string) => void;
}

export const HealthTrendsView: React.FC<HealthTrendsViewProps> = ({ currentReport, onNavigate }) => {
  const visits = currentReport.historicalVisits || [];

  // Display a helpful empty state if historical records are unavailable.
  if (visits.length < 2) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12 text-[#F3E8FF]">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#E879F9] uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Longitudinal Telemetry Tracker</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Patient Health Trends
          </h2>
          <p className="font-script text-xl text-[#C084FC] italic">
            Chronological biomarker trajectory monitoring across admissions for {currentReport.patient.name}
          </p>
        </div>

        {/* Helpful Empty State Card in Liquid Crystal Glass */}
        <div className="liquid-crystal-card rounded-3xl p-10 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#0D071E] border border-[#A855F7]/40 flex items-center justify-center mx-auto text-[#E879F9] shadow-inner">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              No Historical Records for {currentReport.patient.name} ({currentReport.patient.medicalRecordNumber})
            </h3>
            <p className="text-sm text-purple-200/80 leading-relaxed">
              Longitudinal trend analysis requires <strong className="text-white">at least two chronological lab visits</strong> to plot trajectories. Currently, a single baseline panel is loaded for this patient.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D071E]/90 border border-[#A855F7]/30 max-w-md mx-auto text-xs text-left space-y-2">
            <div className="font-bold text-[#E879F9] font-mono uppercase tracking-wide">
              Academic Demonstration Integrity:
            </div>
            <p className="text-purple-200/80 leading-relaxed">
              Historical records are not simulated or fabricated. When subsequent follow-up test reports are uploaded via the Report Scanner, multi-visit biomarker trajectory curves (Fasting Glucose, Cholesterol, eGFR) will automatically render here.
            </p>
          </div>

          {onNavigate && (
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('overview')}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#180C34] border border-[#A855F7]/40 hover:border-[#E879F9] rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Return to Overview Dashboard
              </button>
              <button
                onClick={() => onNavigate('scanner')}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#C084FC] via-[#E879F9] to-[#38BDF8] rounded-xl hover:opacity-95 transition-all cursor-pointer font-medium shadow-md"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Follow-Up Report</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If 2 or more historical visits exist
  const [selectedBiomarker, setSelectedBiomarker] = useState<'glucose' | 'totalCholesterol' | 'systolicBp' | 'creatinine' | 'crp'>('glucose');

  const biomarkerConfigs = {
    glucose: { label: 'Fasting Blood Glucose', unit: 'mg/dL', refMin: 70, refMax: 99, color: '#E879F9' },
    totalCholesterol: { label: 'Total Serum Cholesterol', unit: 'mg/dL', refMin: 125, refMax: 200, color: '#C084FC' },
    systolicBp: { label: 'Systolic Blood Pressure', unit: 'mmHg', refMin: 90, refMax: 120, color: '#38BDF8' },
    creatinine: { label: 'Serum Creatinine', unit: 'mg/dL', refMin: 0.6, refMax: 1.2, color: '#2DD4BF' },
    crp: { label: 'High-Sensitivity CRP', unit: 'mg/L', refMin: 0.0, refMax: 1.0, color: '#F43F5E' },
  };

  const currentConfig = biomarkerConfigs[selectedBiomarker];
  const dataPoints = visits.map((v) => ({
    date: v.visitDate,
    value: v[selectedBiomarker] || 0,
  }));

  const values = dataPoints.map((d) => d.value);
  const minVal = Math.min(...values, currentConfig.refMin) * 0.9;
  const maxVal = Math.max(...values, currentConfig.refMax) * 1.1;

  const firstVal = values[0];
  const lastVal = values[values.length - 1];
  const delta = Math.round((lastVal - firstVal) * 10) / 10;
  const isUp = delta > 0;

  const chartWidth = 600;
  const chartHeight = 240;
  const paddingX = 60;
  const paddingY = 40;

  const getX = (index: number) => {
    if (dataPoints.length === 1) return chartWidth / 2;
    return paddingX + (index / (dataPoints.length - 1)) * (chartWidth - 2 * paddingX);
  };

  const getY = (val: number) => {
    const range = maxVal - minVal || 1;
    return chartHeight - paddingY - ((val - minVal) / range) * (chartHeight - 2 * paddingY);
  };

  const pathD = dataPoints.reduce((acc, curr, idx) => {
    const x = getX(idx);
    const y = getY(curr.value);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  return (
    <div className="space-y-8 pb-12 text-[#F3E8FF]">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#E879F9] uppercase tracking-wider">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Longitudinal Telemetry Tracker</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Patient Health Trends
        </h2>
        <p className="font-script text-xl text-[#C084FC] italic">
          Chronological visualization of laboratory biomarkers for {currentReport.patient.name}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(biomarkerConfigs) as (keyof typeof biomarkerConfigs)[]).map((key) => {
          const cfg = biomarkerConfigs[key];
          const isSelected = selectedBiomarker === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedBiomarker(key)}
              className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#9333EA] to-[#E879F9] text-white font-bold border-[#E879F9]'
                  : 'bg-[#180C34]/80 text-[#C084FC] border-[#A855F7]/30 hover:bg-[#25134E]'
              }`}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      <div className="liquid-crystal-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">{currentConfig.label}</h3>
            <p className="text-xs text-[#C084FC] font-mono">
              Illustrative range: {currentConfig.refMin} - {currentConfig.refMax} {currentConfig.unit}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#C084FC]">Delta:</span>
            <div className={`flex items-center font-bold ${isUp ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isUp ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />}
              <span>{delta > 0 ? `+${delta}` : delta} {currentConfig.unit}</span>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto min-w-[500px]">
            <rect
              x={paddingX}
              y={getY(currentConfig.refMax)}
              width={chartWidth - 2 * paddingX}
              height={Math.max(2, getY(currentConfig.refMin) - getY(currentConfig.refMax))}
              fill="rgba(232, 121, 249, 0.08)"
              stroke="rgba(232, 121, 249, 0.25)"
              strokeDasharray="4 4"
            />
            <path
              d={pathD}
              fill="none"
              stroke={currentConfig.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {dataPoints.map((d, i) => (
              <circle
                key={i}
                cx={getX(i)}
                cy={getY(d.value)}
                r="5"
                fill="#0D071E"
                stroke={currentConfig.color}
                strokeWidth="2.5"
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};
