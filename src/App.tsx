import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MedicalReport } from './types/medical';
import { SAMPLE_REPORTS } from './lib/sampleReports';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { DashboardView } from './components/DashboardView';
import { ScannerView } from './components/ScannerView';
import { InterpreterTable } from './components/InterpreterTable';
import { QualityGuardian } from './components/QualityGuardian';
import { RiskAnalysisView } from './components/RiskAnalysisView';
import { HealthTrendsView } from './components/HealthTrendsView';
import { AIAssistantView } from './components/AIAssistantView';
import { PatientTimelineView } from './components/PatientTimelineView';
import { PoctHardwareModal } from './components/PoctHardwareModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [allReports, setAllReports] = useState<MedicalReport[]>(SAMPLE_REPORTS);
  const [currentReportId, setCurrentReportId] = useState<string>(SAMPLE_REPORTS[0].id);
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState<boolean>(false);

  const currentReport = allReports.find((r) => r.id === currentReportId) || allReports[0];

  // Report selection
  const handleSelectReport = (reportId: string) => {
    setCurrentReportId(reportId);
  };

  // When scanner extracts a new report (from uploaded PDF, image, text)
  const handleReportExtracted = (newReport: MedicalReport) => {
    setAllReports((prev) => [newReport, ...prev]);
    setCurrentReportId(newReport.id);
  };

  // Update existing report (e.g. from Interpreter or Guardian)
  const handleUpdateReport = (updated: MedicalReport) => {
    setAllReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D071E] text-[#F3E8FF] selection:bg-[#E879F9]/30 selection:text-white liquid-crystal-gradient">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentReport={currentReport}
        onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
        onNewScan={() => setActiveTab('scanner')}
      />

      {/* Main Viewport Container with smooth moving transition */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
            >
              <LandingHero
                onStartScan={() => setActiveTab('scanner')}
                onExploreRisk={() => setActiveTab('risk')}
                onLoadSample={(id) => {
                  setCurrentReportId(id);
                  setActiveTab('overview');
                }}
              />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <DashboardView
                  currentReport={currentReport}
                  allReports={allReports}
                  onSelectReport={handleSelectReport}
                  onNavigate={setActiveTab}
                  onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
                />
              </div>
            </motion.div>
          )}

          {activeTab !== 'overview' && (
            <motion.div
              key={`tab-${activeTab}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8"
            >
              {activeTab === 'scanner' && (
                <ScannerView
                  onReportExtracted={handleReportExtracted}
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'interpreter' && (
                <InterpreterTable
                  currentReport={currentReport}
                  onUpdateReport={handleUpdateReport}
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'guardian' && (
                <QualityGuardian
                  currentReport={currentReport}
                  onUpdateReport={handleUpdateReport}
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'risk' && (
                <RiskAnalysisView
                  currentReport={currentReport}
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'trends' && (
                <HealthTrendsView
                  currentReport={currentReport}
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'assistant' && (
                <AIAssistantView currentReport={currentReport} />
              )}

              {activeTab === 'timeline' && (
                <PatientTimelineView currentReport={currentReport} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Simulated Hardware Details Modal */}
      <PoctHardwareModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
        serialNumber={currentReport.deviceSerialNumber}
      />

      {/* Clean Editorial Footer in Liquid Crystal Purple */}
      <footer className="mt-auto border-t border-[#A855F7]/20 bg-[#0D071E]/90 py-8 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#C084FC]/70">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">MediSense AI</span>
            <span>·</span>
            <span className="font-script text-base text-[#E879F9]">Portable Point-of-Care Diagnostics</span>
            <span>·</span>
            <span className="text-[#38BDF8] font-semibold">B.Tech CSE Capstone Project</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('timeline')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Audit Provenance
            </button>
            <button
              onClick={() => setIsHardwareModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Simulated Device Calibration
            </button>
            <span className="text-purple-400/40">Academic Evaluation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
