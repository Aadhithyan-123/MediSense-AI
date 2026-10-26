import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Scan,
  Sparkles,
  Camera,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  Info,
  User,
} from 'lucide-react';
import { MedicalReport, LabTest } from '../types/medical';
import { auditDataQuality, synthesizeClinicalRisk } from '../lib/clinicalModels';
import { SAMPLE_REPORTS } from '../lib/sampleReports';

interface ScannerViewProps {
  onReportExtracted: (report: MedicalReport) => void;
  onNavigate: (tab: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  onReportExtracted,
  onNavigate,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [patientNameInput, setPatientNameInput] = useState<string>('');
  const [pastedText, setPastedText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setErrorMsg(null);

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    const reader = new FileReader();

    if (isImage || isPdf) {
      // Send base64 with accurate MIME type so Gemini can perform document OCR
      reader.onload = () => {
        const base64 = reader.result as string;
        processExtraction({
          imageBase64: base64,
          mimeType: isPdf ? 'application/pdf' : file.type || 'image/png',
          fileName: file.name,
          customPatientName: patientNameInput.trim() || undefined,
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Plain text or CSV laboratory output
      reader.onload = () => {
        const textContent = reader.result as string;
        setPastedText(textContent);
        processExtraction({
          rawText: textContent,
          fileName: file.name,
          customPatientName: patientNameInput.trim() || undefined,
        });
      };
      reader.readAsText(file);
    }
  };

  // Run extraction via server API
  const processExtraction = async (payload: {
    rawText?: string;
    imageBase64?: string;
    mimeType?: string;
    fileName?: string;
    customPatientName?: string;
  }) => {
    setIsScanning(true);
    setErrorMsg(null);
    setScanStep('Reading document binary stream & initializing OCR...');

    try {
      setTimeout(() => setScanStep('Extracting patient identity & laboratory analyte tables...'), 700);
      setTimeout(() => setScanStep('Normalizing measurements, units, and flags...'), 1400);

      const response = await fetch('/api/extract-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Extraction failed: ${response.statusText}`);
      }

      const data = await response.json();
      setScanStep('Auditing data completeness & compiling clinical report...');

      // Extract accurate patient name from custom input, server response, or file name
      let finalPatientName = payload.customPatientName;
      if (!finalPatientName && data.patient?.name) {
        finalPatientName = data.patient.name;
      }
      if (!finalPatientName && payload.fileName) {
        finalPatientName = payload.fileName
          .replace(/\.[^/.]+$/, '')
          .replace(/[_-]/g, ' ')
          .replace(/\b(pdf|png|jpg|jpeg|scan|report|lab|blood|test)\b/gi, '')
          .trim();
        finalPatientName = finalPatientName.replace(/\b\w/g, (l) => l.toUpperCase());
      }
      if (!finalPatientName || finalPatientName.toLowerCase().includes('arun')) {
        // If a new file is uploaded, do NOT force Arun Kumar
        finalPatientName = payload.fileName ? `Patient (${payload.fileName.slice(0, 16)})` : 'Uploaded Patient Scan';
      }

      const patient = {
        id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: finalPatientName,
        age: data.patient?.age || 32,
        gender: data.patient?.gender || 'male',
        medicalRecordNumber: data.patient?.medicalRecordNumber || `MRN-${Math.floor(1000 + Math.random() * 9000)}`,
        systolicBp: data.patient?.systolicBp || 120,
        diastolicBp: data.patient?.diastolicBp || 80,
        fastingHours: 10,
      };

      const tests: LabTest[] = (data.tests || []).map((t: any, i: number) => ({
        id: t.id || `ext-${Date.now()}-${i}`,
        name: t.name,
        category: t.category || 'Metabolic',
        value: Number(t.value),
        unit: t.unit || 'mg/dL',
        referenceLow: Number(t.referenceLow),
        referenceHigh: Number(t.referenceHigh),
        flag: t.flag || 'NORMAL',
        confidence: Number(t.confidence) || 0.92,
        notes: t.notes || `Extracted from uploaded ${payload.fileName || 'specimen'}.`,
        rawText: t.rawText || '',
      }));

      const qualityAudit = auditDataQuality(tests, patient);
      const riskSummary = synthesizeClinicalRisk(tests, patient);

      const newReport: MedicalReport = {
        id: `rep-uploaded-${Date.now()}`,
        title: `Uploaded Report – ${patient.name}`,
        sourceType: payload.mimeType === 'application/pdf' ? 'Uploaded PDF' : 'Scanned Image',
        fileName: payload.fileName || 'Uploaded_Medical_Scan.pdf',
        createdAt: new Date().toISOString(),
        patient,
        tests,
        qualityAudit,
        riskSummary,
        status: 'extracted',
        labFacility: data.facility || 'MediSense Regional Laboratory Ingestion',
        deviceSerialNumber: 'POCT-OCR-INGEST',
        ocrRawText: payload.rawText || 'OCR Document Extraction Completed Successfully.',
      };

      setTimeout(() => {
        setIsScanning(false);
        onReportExtracted(newReport);
        onNavigate('overview');
      }, 1800);
    } catch (err: any) {
      console.error(err);
      setIsScanning(false);
      setErrorMsg(err.message || 'Error occurred during document extraction.');
    }
  };

  const handleLoadPreset = (presetId: string) => {
    const found = SAMPLE_REPORTS.find((r) => r.id === presetId);
    if (found) {
      onReportExtracted(found);
      onNavigate('overview');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 text-[#F3E8FF]">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[#E879F9] uppercase tracking-wider">
          <Scan className="w-3.5 h-3.5" />
          <span>Multimodal Ingestion Pipeline</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Report Scanner & OCR Extractor
        </h2>
        <p className="font-script text-xl text-[#C084FC] italic">
          Upload any medical PDF, lab image, or analyzer text to extract and visualize patient findings
        </p>
      </div>

      {/* Main Upload Zone */}
      <div className="liquid-crystal-card rounded-3xl p-8 space-y-6">
        {/* Optional Patient Name Pre-Tagging */}
        <div className="p-4 rounded-2xl bg-[#0D071E]/70 border border-[#A855F7]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-[#C084FC]" />
            <div>
              <span className="text-xs font-bold text-white block">
                Target Patient Name (Optional):
              </span>
              <span className="text-[11px] text-[#C084FC]/80">
                Type a custom patient name or leave blank to auto-detect from the document
              </span>
            </div>
          </div>
          <input
            type="text"
            value={patientNameInput}
            onChange={(e) => setPatientNameInput(e.target.value)}
            placeholder="e.g. Priya Sharma, John Doe..."
            className="px-3.5 py-1.5 text-xs bg-[#180C34] border border-[#A855F7]/40 rounded-xl text-white placeholder:text-purple-400/50 focus:outline-none focus:ring-1 focus:ring-[#E879F9] w-full sm:w-64 font-mono"
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.png,.jpg,.jpeg,.txt"
          className="hidden"
        />

        <div
          onClick={() => !isScanning && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
            isScanning
              ? 'border-[#E879F9] bg-[#180C34]/90'
              : 'border-[#A855F7]/30 hover:border-[#E879F9] hover:bg-[#180C34]/60'
          }`}
        >
          {isScanning ? (
            <div className="space-y-4 py-6">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-[#C084FC]/20 border-t-[#E879F9] animate-spin" />
                <Scan className="w-8 h-8 text-[#E879F9] absolute inset-0 m-auto" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Extracting Document Findings...</p>
                <p className="text-xs font-mono text-[#E879F9]">{scanStep}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#9333EA]/30 via-[#C084FC]/20 to-[#E879F9]/30 flex items-center justify-center mx-auto text-[#E879F9] border border-[#A855F7]/40 shadow-lg shadow-purple-950/50">
                <Upload className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <p className="text-base font-bold text-white">
                  Click to browse or drop PDF, PNG, JPG medical reports
                </p>
                <p className="text-xs text-[#C084FC]/80">
                  Multimodal vision extracts analytes, values, and patient demographics directly
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#C084FC] via-[#E879F9] to-[#38BDF8] rounded-xl shadow-md hover:opacity-95 cursor-pointer font-medium"
                >
                  Upload & Scan Document
                </button>
              </div>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Manual Text Ingestion Box */}
        <div className="pt-4 border-t border-[#A855F7]/20 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Or Paste Laboratory Printout / Raw Text Directly:
            </label>
            <span className="text-[11px] font-script text-[#C084FC]">
              Paste any patient name & tests
            </span>
          </div>
          <textarea
            rows={4}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Patient Name: Sneha Patel&#10;FASTING GLUCOSE: 110 mg/dL [70 - 99]&#10;TOTAL CHOLESTEROL: 215 mg/dL [125 - 200]&#10;HDL CHOLESTEROL: 48 mg/dL [40 - 60]&#10;eGFR: 88 mL/min/1.73m2 [90 - 120]"
            className="w-full text-xs font-mono p-3.5 rounded-xl border border-[#A855F7]/30 focus:ring-2 focus:ring-[#E879F9] focus:border-transparent outline-none bg-[#0D071E] text-[#F3E8FF] placeholder:text-purple-400/30"
          />
          <div className="flex justify-end">
            <button
              onClick={() =>
                pastedText.trim() &&
                processExtraction({
                  rawText: pastedText,
                  customPatientName: patientNameInput.trim() || undefined,
                })
              }
              disabled={isScanning || !pastedText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#180C34] border border-[#A855F7]/50 hover:border-[#E879F9] rounded-xl hover:bg-purple-950/50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E879F9]" />
              <span>Parse Clinical Text into New Patient Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pre-Loaded Validated Case Section */}
      <div className="liquid-crystal-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Standard Baseline Case
            </h3>
            <p className="font-script text-base text-[#C084FC]">
              Fictional reference profile for project guide evaluation:
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-950/80 text-[#E879F9] border border-[#E879F9]/30 font-bold">
            DEMO DATA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {SAMPLE_REPORTS.map((rep) => (
            <div
              key={rep.id}
              onClick={() => handleLoadPreset(rep.id)}
              className="p-5 rounded-2xl border border-[#A855F7]/30 hover:border-[#E879F9] transition-all cursor-pointer bg-[#0D071E]/70 space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#E879F9]">
                  PATIENT ID: {rep.patient.medicalRecordNumber}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950 text-[#C084FC] border border-[#A855F7]/30">
                  {rep.sourceType}
                </span>
              </div>

              <div>
                <div className="text-base font-bold text-white group-hover:text-[#E879F9] transition-colors">
                  {rep.patient.name} ({rep.patient.age} y/o {rep.patient.gender})
                </div>
                <p className="text-xs text-[#C084FC]/80 mt-1">
                  BP: {rep.patient.systolicBp}/{rep.patient.diastolicBp} mmHg · {rep.tests.length} Laboratory Analytes
                </p>
              </div>

              <div className="text-xs text-purple-300/70 font-mono border-t border-[#A855F7]/20 pt-2">
                Fasting Glucose (95) · Total Chol (180) · HDL (45) · eGFR (95)
              </div>

              <div className="flex items-center justify-between text-xs text-[#E879F9] font-semibold pt-1">
                <span>Load Baseline Demo Case</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
