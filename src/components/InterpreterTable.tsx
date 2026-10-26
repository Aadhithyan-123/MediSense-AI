import React, { useState } from 'react';
import {
  Table,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Filter,
  Search,
  AlertTriangle,
  RefreshCw,
  Save,
  CheckCircle,
  HelpCircle,
  Info,
} from 'lucide-react';
import { LabTest, TestFlag, MedicalReport } from '../types/medical';
import { computeAnalyteFlag, auditDataQuality, synthesizeClinicalRisk, STANDARD_BIOMARKER_RANGES } from '../lib/clinicalModels';

interface InterpreterTableProps {
  currentReport: MedicalReport;
  onUpdateReport: (updated: MedicalReport) => void;
  onNavigate: (tab: string) => void;
}

export const InterpreterTable: React.FC<InterpreterTableProps> = ({
  currentReport,
  onUpdateReport,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<LabTest>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTest, setNewTest] = useState<Partial<LabTest>>({
    name: '',
    category: 'Metabolic',
    value: 0,
    unit: 'mg/dL',
    referenceLow: 0,
    referenceHigh: 100,
    confidence: 1.0,
    notes: '',
  });

  const categories = ['All', 'Metabolic', 'Lipid', 'Renal', 'Hepatic', 'Hematology'];

  // Filtered list
  const filteredTests = currentReport.tests.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Start editing a row
  const startEdit = (test: LabTest) => {
    setEditingId(test.id);
    setEditFormData({ ...test });
  };

  // Save row edits
  const saveEdit = (id: string) => {
    const updatedTests = currentReport.tests.map((t) => {
      if (t.id === id) {
        const val = Number(editFormData.value !== undefined ? editFormData.value : t.value);
        const low = Number(editFormData.referenceLow !== undefined ? editFormData.referenceLow : t.referenceLow);
        const high = Number(editFormData.referenceHigh !== undefined ? editFormData.referenceHigh : t.referenceHigh);
        const flag = computeAnalyteFlag(val, low, high);

        return {
          ...t,
          ...editFormData,
          value: val,
          referenceLow: low,
          referenceHigh: high,
          flag,
          isManuallyEdited: true,
        };
      }
      return t;
    });

    applyChanges(updatedTests);
    setEditingId(null);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  // Delete row
  const deleteTest = (id: string) => {
    const updatedTests = currentReport.tests.filter((t) => t.id !== id);
    applyChanges(updatedTests);
  };

  // Add new analyte
  const handleAddNewTest = () => {
    if (!newTest.name || newTest.value === undefined) return;

    const val = Number(newTest.value);
    const low = Number(newTest.referenceLow || 0);
    const high = Number(newTest.referenceHigh || 100);
    const flag = computeAnalyteFlag(val, low, high);

    const testItem: LabTest = {
      id: `test-user-${Date.now()}`,
      name: newTest.name,
      category: (newTest.category as any) || 'Metabolic',
      value: val,
      unit: newTest.unit || 'mg/dL',
      referenceLow: low,
      referenceHigh: high,
      flag,
      confidence: 1.0,
      isManuallyEdited: true,
      notes: newTest.notes || 'Manually added measurement.',
      rawText: 'Clinician manually added analyte.',
    };

    const updatedTests = [...currentReport.tests, testItem];
    applyChanges(updatedTests);

    setIsAddingNew(false);
    setNewTest({
      name: '',
      category: 'Metabolic',
      value: 0,
      unit: 'mg/dL',
      referenceLow: 0,
      referenceHigh: 100,
      confidence: 1.0,
      notes: '',
    });
  };

  const applyChanges = (tests: LabTest[]) => {
    const qualityAudit = auditDataQuality(tests, currentReport.patient);
    const riskSummary = synthesizeClinicalRisk(tests, currentReport.patient);

    onUpdateReport({
      ...currentReport,
      tests,
      qualityAudit,
      riskSummary,
    });
  };

  return (
    <div className="space-y-8 pb-12 text-[#F3E8FF]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#E879F9] uppercase tracking-wider">
            <Table className="w-3.5 h-3.5" />
            <span>Biomarker Interpretation & Reference Analysis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Laboratory Interpreter
          </h2>
          <p className="font-script text-xl text-[#C084FC] italic">
            Displaying laboratory measurements for <strong className="text-white not-italic">{currentReport.patient.name}</strong> ({currentReport.patient.medicalRecordNumber})
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#C084FC] via-[#E879F9] to-[#38BDF8] rounded-xl hover:opacity-95 shadow-md transition-all cursor-pointer font-medium self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Measurement</span>
        </button>
      </div>

      {/* Illustrative Reference Range Notice */}
      <div className="p-4 rounded-2xl bg-[#180C34]/80 border border-[#A855F7]/30 text-xs flex items-start gap-3 shadow-md">
        <Info className="w-4 h-4 text-[#E879F9] mt-0.5 shrink-0" />
        <div className="space-y-1 text-purple-200/80">
          <span className="font-bold text-white">Clinical Reference Note:</span>
          <p className="leading-relaxed">
            Reference intervals displayed below represent <strong className="text-white">illustrative clinical ranges</strong> based on standard consensus guidelines (ADA diabetes criteria, NCEP lipid thresholds, and KDIGO renal stages).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#9333EA] to-[#E879F9] text-white font-bold border-[#E879F9]'
                  : 'bg-[#180C34]/70 text-[#C084FC] border-[#A855F7]/30 hover:text-white hover:bg-[#25134E]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search analyte or explanation..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#180C34] border border-[#A855F7]/30 rounded-xl text-white placeholder:text-purple-400/50 focus:outline-none focus:ring-1 focus:ring-[#E879F9]"
          />
        </div>
      </div>

      {/* Main Table Card with Liquid Crystal Glassmorphism */}
      <div className="liquid-crystal-card rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D071E]/90 text-[#C084FC] font-mono uppercase text-[11px] border-b border-[#A855F7]/25">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Analyte / Test</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Measured Value</th>
                <th className="py-3.5 px-4 font-semibold">Unit</th>
                <th className="py-3.5 px-4 font-semibold">Reference Range (Illustrative)</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold min-w-[280px]">Understandable Explanation</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A855F7]/20">
              {filteredTests.map((test) => {
                const isEditing = editingId === test.id;

                if (isEditing) {
                  return (
                    <tr key={test.id} className="bg-[#25134E]/90">
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editFormData.name || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          className="w-full px-2 py-1 text-xs bg-[#0D071E] border border-[#A855F7]/40 rounded text-white"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={editFormData.category || 'Metabolic'}
                          onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value as any })}
                          className="px-2 py-1 text-xs bg-[#0D071E] border border-[#A855F7]/40 rounded text-white"
                        >
                          <option value="Metabolic">Metabolic</option>
                          <option value="Lipid">Lipid</option>
                          <option value="Renal">Renal</option>
                          <option value="Hepatic">Hepatic</option>
                          <option value="Hematology">Hematology</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          step="any"
                          value={editFormData.value ?? 0}
                          onChange={(e) => setEditFormData({ ...editFormData, value: parseFloat(e.target.value) })}
                          className="w-20 px-2 py-1 text-xs bg-[#0D071E] border border-[#A855F7]/40 rounded text-white font-mono"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editFormData.unit || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                          className="w-16 px-2 py-1 text-xs bg-[#0D071E] border border-[#A855F7]/40 rounded text-white"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-mono">
                          <input
                            type="number"
                            value={editFormData.referenceLow ?? 0}
                            onChange={(e) => setEditFormData({ ...editFormData, referenceLow: parseFloat(e.target.value) })}
                            className="w-14 px-1 py-1 text-xs bg-[#0D071E] border border-[#A855F7]/40 rounded text-white"
                          />
                          <span>-</span>
                          <input
                            type="number"
                            value={editFormData.referenceHigh ?? 0}
                            onChange={(e) => setEditFormData({ ...editFormData, referenceHigh: parseFloat(e.target.value) })}
                            className="w-14 px-1 py-1 text-xs bg-[#0D071E] border border-[#A855F7]/40 rounded text-white"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] text-purple-300 font-mono">Auto-evaluated</span>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editFormData.notes || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                          placeholder="Explanation..."
                          className="w-full px-2 py-1 text-xs bg-[#0D071E] border border-[#A855F7]/40 rounded text-white"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => saveEdit(test.id)}
                            className="p-1 text-emerald-400 hover:bg-emerald-950/50 rounded"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-slate-400 hover:bg-slate-800 rounded"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={test.id} className="hover:bg-[#25134E]/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {test.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0D071E] text-[#C084FC] border border-[#A855F7]/30">
                        {test.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-base text-white">
                      {test.value}
                    </td>
                    <td className="py-3.5 px-4 text-[#C084FC] font-mono">
                      {test.unit}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-purple-200/90">
                      <span>{test.referenceLow} - {test.referenceHigh}</span>
                      <span className="text-[10px] text-purple-400/60 ml-1.5">(Illustrative)</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          test.flag === 'NORMAL'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            : 'bg-red-950/80 text-red-300 border-red-500/40'
                        }`}
                      >
                        {test.flag}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-purple-100/90 leading-relaxed text-xs">
                      {test.notes || 'Normal clinical baseline.'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(test)}
                          className="p-1 text-[#E879F9] hover:bg-purple-950/50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTest(test.id)}
                          className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-950/50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add New Row Panel */}
        {isAddingNew && (
          <div className="p-5 bg-[#0D071E] border-t border-[#A855F7]/30 space-y-3">
            <div className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-[#E879F9]" />
              <span>Add Custom Laboratory Measurement</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
              <input
                type="text"
                placeholder="Test Name (e.g. Serum Creatinine)"
                value={newTest.name || ''}
                onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                className="px-3 py-1.5 text-xs bg-[#180C34] border border-[#A855F7]/40 rounded-xl text-white col-span-2"
              />
              <select
                value={newTest.category || 'Metabolic'}
                onChange={(e) => setNewTest({ ...newTest, category: e.target.value as any })}
                className="px-3 py-1.5 text-xs bg-[#180C34] border border-[#A855F7]/40 rounded-xl text-white"
              >
                <option value="Metabolic">Metabolic</option>
                <option value="Lipid">Lipid</option>
                <option value="Renal">Renal</option>
                <option value="Hepatic">Hepatic</option>
                <option value="Hematology">Hematology</option>
              </select>
              <input
                type="number"
                step="any"
                placeholder="Value"
                value={newTest.value || ''}
                onChange={(e) => setNewTest({ ...newTest, value: parseFloat(e.target.value) })}
                className="px-3 py-1.5 text-xs bg-[#180C34] border border-[#A855F7]/40 rounded-xl text-white font-mono"
              />
              <input
                type="text"
                placeholder="Unit (mg/dL)"
                value={newTest.unit || ''}
                onChange={(e) => setNewTest({ ...newTest, unit: e.target.value })}
                className="px-3 py-1.5 text-xs bg-[#180C34] border border-[#A855F7]/40 rounded-xl text-white"
              />
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  placeholder="Low"
                  value={newTest.referenceLow || ''}
                  onChange={(e) => setNewTest({ ...newTest, referenceLow: parseFloat(e.target.value) })}
                  className="w-16 px-2 py-1.5 text-xs bg-[#180C34] border border-[#A855F7]/40 rounded-xl text-white"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="High"
                  value={newTest.referenceHigh || ''}
                  onChange={(e) => setNewTest({ ...newTest, referenceHigh: parseFloat(e.target.value) })}
                  className="w-16 px-2 py-1.5 text-xs bg-[#180C34] border border-[#A855F7]/40 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <input
                type="text"
                placeholder="Understandable clinical explanation of what this test measures..."
                value={newTest.notes || ''}
                onChange={(e) => setNewTest({ ...newTest, notes: e.target.value })}
                className="w-2/3 px-3 py-1.5 text-xs bg-[#180C34] border border-[#A855F7]/40 rounded-xl text-white"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 text-xs text-purple-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewTest}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#C084FC] to-[#E879F9] rounded-xl hover:opacity-95"
                >
                  Save Measurement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
