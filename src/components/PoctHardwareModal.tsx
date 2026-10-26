import React from 'react';
import { X, Cpu, Battery, Wifi, CheckCircle2, Shield, Thermometer, Info } from 'lucide-react';
import { ASSETS } from '../assets/images';

interface PoctHardwareModalProps {
  isOpen: boolean;
  onClose: () => void;
  serialNumber: string;
}

export const PoctHardwareModal: React.FC<PoctHardwareModalProps> = ({
  isOpen,
  onClose,
  serialNumber,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#180C34] rounded-3xl border border-[#A855F7]/40 shadow-2xl overflow-hidden space-y-6 p-6 text-[#F3E8FF]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#A855F7]/25">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#9333EA] to-[#E879F9] flex items-center justify-center text-white shadow-md">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  POCT Device Simulator
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/80 text-[#E879F9] border border-[#E879F9]/30 font-semibold">
                  SIMULATED INTERFACE
                </span>
              </div>
              <p className="text-xs font-mono text-[#C084FC]">
                Academic Emulation Profile · S/N: {serialNumber || 'POCT-SIM-001'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-purple-300 hover:text-white rounded-lg hover:bg-purple-900/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner */}
        <div className="p-3.5 rounded-xl bg-purple-950/60 border border-[#A855F7]/30 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#E879F9] shrink-0 mt-0.5" />
          <p className="text-purple-200/90 leading-relaxed">
            <strong className="text-white">Academic Project Notice:</strong> No physical sensor hardware is connected. This view simulates how a portable fluorescent or microfluidic cartridge reader communicates raw analyte telemetry to MediSense AI.
          </p>
        </div>

        {/* Device Photo & Simulated Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden aspect-video sm:aspect-square bg-slate-900 border border-[#A855F7]/30">
            <img
              src={ASSETS.poctDevice}
              alt="Simulated Portable Point-of-Care Handheld Device Concept"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-3 flex flex-col justify-between">
            <div className="space-y-2 bg-[#0D071E] p-3.5 rounded-2xl border border-[#A855F7]/25">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#C084FC]">Cartridge Bay:</span>
                <span className="text-[#2DD4BF] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Simulated Ready
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#C084FC]">Optical Model:</span>
                <span className="text-white">Dual Fluorescence (488/635nm)</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#C084FC]">Thermal Cell:</span>
                <span className="text-white flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" /> 37.0°C (Emulated)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#C084FC]">Data Protocol:</span>
                <span className="text-[#E879F9] flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5" /> BLE 5.4 / REST Payload
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#C084FC]">Emulated Battery:</span>
                <span className="text-[#2DD4BF] flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5" /> 95% (Virtual Cell)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0D071E] border border-[#A855F7]/25 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Shield className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span>Simulated Calibration Profile</span>
              </div>
              <p className="text-[11px] text-purple-200/80">
                Demonstrates reference curve mapping for glucose, lipids, and renal markers based on illustrative laboratory intervals.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-purple-950 hover:bg-purple-900 rounded-xl transition-colors cursor-pointer border border-[#A855F7]/40 shadow-sm"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
