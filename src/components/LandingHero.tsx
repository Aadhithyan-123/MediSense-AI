import React from 'react';
import { ArrowRight, Activity, ShieldCheck, Microscope, Database, FileText, Sparkles } from 'lucide-react';
import { ASSETS } from '../assets/images';

interface LandingHeroProps {
  onStartScan: () => void;
  onExploreRisk: () => void;
  onLoadSample: (id: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartScan,
  onExploreRisk,
  onLoadSample,
}) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-[#A855F7]/25 text-[#F3E8FF] liquid-crystal-gradient">
      {/* Radiant ambient glow discs (liquid crystal purple & electric violet) */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#9333EA]/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#E879F9]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#38BDF8]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Academic Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#E879F9] tracking-wide uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E879F9] animate-pulse shadow-sm shadow-[#E879F9]" />
              <span>B.Tech CSE Capstone Project</span>
              <span aria-hidden="true" className="text-purple-400/40">·</span>
              <span>Point-of-Care Diagnostics</span>
              <span aria-hidden="true" className="text-purple-400/40">·</span>
              <span className="text-[#38BDF8]">Explainable Clinical Intelligence</span>
            </div>

            {/* Headline with Calligraphic Flourish */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] text-balance">
                Understand Health Data.{' '}
                <span className="bg-gradient-to-r from-[#E879F9] via-[#C084FC] to-[#38BDF8] bg-clip-text text-transparent">
                  Discover Meaningful Insights.
                </span>
              </h1>
              <p className="font-script text-2xl sm:text-3xl text-[#C084FC] mt-2 italic font-normal tracking-wide">
                Seamless intelligence for point-of-care laboratory decision support
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#D8B4FE]/90 leading-relaxed max-w-2xl text-pretty">
              MediSense AI transforms point-of-care test printouts and laboratory summaries into verified, explainable clinical intelligence. Combining automated OCR parsing, pre-analytical data validation, and evidence-based guideline stratification.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartScan}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-950 bg-gradient-to-r from-[#C084FC] via-[#E879F9] to-[#38BDF8] rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap font-medium"
              >
                <span>Launch Report Scanner</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreRisk}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-white bg-[#180C34]/80 border border-[#A855F7]/40 rounded-xl hover:bg-[#25134E] hover:border-[#E879F9] transition-all cursor-pointer whitespace-nowrap shadow-md"
              >
                <Activity className="w-4 h-4 text-[#E879F9]" />
                <span>Inspect Clinical Calculators</span>
              </button>
            </div>

            {/* Demo Case Fast-Loader */}
            <div className="pt-4 border-t border-[#A855F7]/25">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded">
                  DEMO DATA
                </span>
                <span className="text-xs text-[#C084FC]">
                  Fictional baseline demonstration profile:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onLoadSample('rep-demo-001')}
                  className="px-4 py-2 text-xs font-medium bg-[#180C34]/90 text-white border border-[#A855F7]/40 hover:border-[#E879F9] hover:bg-[#25134E] rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
                  <span className="font-bold">Arun Kumar · 25M (DEMO-001)</span>
                  <span className="text-[#C084FC] font-script text-sm">~ 4 Baseline Analytes</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Crystal Biological Sculpture Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl liquid-crystal-card p-3 shadow-2xl shadow-purple-950/60">
              {/* Card visual showcase */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-tr from-[#0D071E] to-[#1E0F42]">
                <img
                  src={ASSETS.heroSculpture}
                  alt="Translucent 3D crystal biological heart and neurovascular simulation"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Floating telemetry tag */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#0D071E]/90 backdrop-blur-md border border-[#A855F7]/30 text-white text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[#E879F9] font-bold">LIQUID CRYSTAL POCT</span>
                    <span className="text-[#38BDF8] font-script text-sm">~ verified telemetry</span>
                  </div>
                  <p className="mt-1 text-[11px] text-purple-200/80 line-clamp-1">
                    Multi-analyte microfluidic fluorescent telemetry · Intelligent guideline interpretation
                  </p>
                </div>
              </div>

              {/* Decorative side accent pill */}
              <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#9333EA] to-[#E879F9] text-white text-[11px] font-bold shadow-lg shadow-purple-900/50">
                CAPSTONE 2026
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Metric Rigor Strip below hero */}
        <div className="mt-12 pt-8 border-t border-[#A855F7]/25 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-xs uppercase font-mono text-[#C084FC]">Baseline Case</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">Arun Kumar</div>
            <p className="text-xs text-purple-300/80">DEMO-001 · 25 y/o Male</p>
          </div>

          <div className="space-y-1">
            <div className="text-xs uppercase font-mono text-[#C084FC]">Lab Measurements</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#E879F9] font-mono">4 Analytes</div>
            <p className="text-xs text-purple-300/80">Glucose, Total Chol, HDL, eGFR</p>
          </div>

          <div className="space-y-1">
            <div className="text-xs uppercase font-mono text-[#C084FC]">Quality Validation</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#2DD4BF] font-mono">4/4 Passed</div>
            <p className="text-xs text-purple-300/80">Programmatic schema verification</p>
          </div>

          <div className="space-y-1">
            <div className="text-xs uppercase font-mono text-[#C084FC]">Clinical Scope</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#38BDF8] font-mono">AHA & KDIGO</div>
            <p className="text-xs text-purple-300/80">Transparent evidence boundaries</p>
          </div>
        </div>
      </div>
    </section>
  );
};
