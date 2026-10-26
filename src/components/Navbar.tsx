import React, { useState } from 'react';
import { Download, PlusCircle, Menu, X, Cpu } from 'lucide-react';
import { MedicalReport } from '../types/medical';
import { exportMedicalReportPdf } from '../lib/pdfExport';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentReport: MedicalReport;
  onOpenHardwareModal: () => void;
  onNewScan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentReport,
  onOpenHardwareModal,
  onNewScan,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'scanner', label: 'Report Scanner' },
    { id: 'interpreter', label: 'Laboratory Interpreter' },
    { id: 'guardian', label: 'Quality Guardian' },
    { id: 'risk', label: 'Risk Analysis' },
    { id: 'trends', label: 'Health Trends' },
    { id: 'assistant', label: 'AI Assistant' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0D071E]/90 backdrop-blur-md border-b border-[#A855F7]/25 text-[#F3E8FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Brand Wordmark with Calligraphy Accent */}
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('overview');
            }}
            className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#9333EA] via-[#C084FC] to-[#E879F9] flex items-center justify-center shadow-lg shadow-purple-900/50 group-hover:scale-105 transition-transform text-white font-bold font-mono text-sm">
              M
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold tracking-tight">MediSense AI</span>
              <span className="font-script text-base text-[#E879F9] hidden sm:inline font-normal">
                ~ POCT Intelligence
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#C084FC]/80">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                  activeTab === link.id
                    ? 'text-[#E879F9] font-bold border-b-2 border-[#E879F9]'
                    : 'hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Cluster */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenHardwareModal}
              title="Inspect Simulated Point-of-Care Hardware Console"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#C084FC] bg-[#180C34] border border-[#A855F7]/30 rounded-lg hover:border-[#E879F9] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              <Cpu className="w-3.5 h-3.5 text-[#E879F9]" />
              <span>POCT Console</span>
            </button>

            <button
              onClick={() => exportMedicalReportPdf(currentReport)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#C084FC] via-[#E879F9] to-[#38BDF8] rounded-lg hover:opacity-95 shadow-md transition-all whitespace-nowrap shrink-0 cursor-pointer font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => exportMedicalReportPdf(currentReport)}
              className="p-2 text-[#E879F9] bg-[#180C34] rounded-lg border border-[#A855F7]/30"
              title="Export PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#C084FC] hover:text-white bg-[#180C34] border border-[#A855F7]/30 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#A855F7]/25 bg-[#0D071E] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === link.id
                  ? 'bg-[#180C34] text-[#E879F9] font-bold'
                  : 'text-[#C084FC] hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2 border-t border-[#A855F7]/25">
            <button
              onClick={() => {
                onOpenHardwareModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium bg-[#180C34] text-white rounded-lg border border-[#A855F7]/30"
            >
              <Cpu className="w-3.5 h-3.5 text-[#E879F9]" />
              <span>Inspect POCT Hardware Console</span>
            </button>
            <button
              onClick={() => {
                onNewScan();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#C084FC] via-[#E879F9] to-[#38BDF8] rounded-lg font-medium"
            >
              <span>Launch Report Scanner</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
