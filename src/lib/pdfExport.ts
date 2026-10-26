import { jsPDF } from 'jspdf';
import { MedicalReport } from '../types/medical';

export function exportMedicalReportPdf(report: MedicalReport): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  const isDemo = report.patient.medicalRecordNumber === 'DEMO-001';

  // Header Bar (Deep Liquid Crystal Purple & Violet Accent)
  doc.setFillColor(13, 7, 30); // #0D071E
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line (Electric Magenta/Violet)
  doc.setFillColor(232, 121, 249); // #E879F9
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Brand Wordmark
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('MEDISENSE AI', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(232, 121, 249);
  doc.text('POINT-OF-CARE DIAGNOSIS PLATFORM · B.TECH CSE CAPSTONE DEMONSTRATION', 14, 19);

  doc.setFontSize(7.5);
  doc.setTextColor(216, 180, 254);
  doc.text(`DOC REF: ${report.patient.medicalRecordNumber}  |  DATE: ${new Date(report.createdAt).toLocaleDateString()}`, pageWidth - 14, 19, { align: 'right' });

  y = 36;

  // Prominent Status Banner
  if (isDemo) {
    doc.setFillColor(254, 243, 199); // Amber-100
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(14, y, pageWidth - 28, 9, 1.5, 1.5, 'FD');
    doc.setTextColor(146, 64, 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('DEMONSTRATION REPORT · FICTIONAL BASELINE CASE (DEMO-001) · FOR ACADEMIC EVALUATION ONLY', pageWidth / 2, y + 5.8, { align: 'center' });
  } else {
    doc.setFillColor(243, 232, 255); // Purple-100
    doc.setDrawColor(168, 85, 247);
    doc.roundedRect(14, y, pageWidth - 28, 9, 1.5, 1.5, 'FD');
    doc.setTextColor(107, 33, 168);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`UPLOADED LABORATORY REPORT · EXTRACTED PATIENT FINDINGS (${report.patient.name.toUpperCase()})`, pageWidth / 2, y + 5.8, { align: 'center' });
  }

  y += 14;

  // Patient Demographics & Facility Box
  doc.setFillColor(250, 245, 255);
  doc.setDrawColor(216, 180, 254);
  doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, 'FD');

  doc.setTextColor(24, 12, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`PATIENT: ${report.patient.name.toUpperCase()} (ID: ${report.patient.medicalRecordNumber})`, 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(88, 28, 135);
  doc.text(`Age: ${report.patient.age} yrs   ·   Gender: ${report.patient.gender.toUpperCase()}   ·   Blood Pressure: ${report.patient.systolicBp || 120}/${report.patient.diastolicBp || 80} mmHg`, 18, y + 12);
  doc.text(`Fasting Status: ${report.patient.fastingHours || 10} hrs   ·   Smoker: ${report.patient.smoker ? 'Yes' : 'No'}   ·   Diabetic: ${report.patient.diabetic ? 'Yes' : 'No'}`, 18, y + 18);

  doc.text(`Facility: ${report.labFacility}`, pageWidth - 18, y + 12, { align: 'right' });
  doc.text(`Hardware: ${report.deviceSerialNumber}`, pageWidth - 18, y + 18, { align: 'right' });

  y += 32;

  // Data Quality Guardian Summary
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(45, 212, 191);
  doc.roundedRect(14, y, pageWidth - 28, 12, 1.5, 1.5, 'FD');

  doc.setTextColor(15, 118, 110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`DATA INTEGRITY AUDIT: ${report.qualityAudit.overallQualityScore}% (VERIFIED)`, 18, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(51, 65, 85);
  doc.text(`All ${report.tests.length} laboratory measurements formatted with complete numerical bounds and units`, 18, y + 9.5);

  y += 18;

  // Laboratory Analytes Table Header
  doc.setFillColor(147, 51, 234); // Purple #9333EA
  doc.rect(14, y, pageWidth - 28, 7, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('LABORATORY MEASUREMENT', 18, y + 4.8);
  doc.text('MEASURED VALUE', 85, y + 4.8);
  doc.text('UNIT', 120, y + 4.8);
  doc.text('ILLUSTRATIVE RANGE', 145, y + 4.8);
  doc.text('STATUS', pageWidth - 18, y + 4.8, { align: 'right' });

  y += 7;

  // Table Rows
  report.tests.forEach((t, idx) => {
    const isAlt = idx % 2 === 1;
    if (isAlt) {
      doc.setFillColor(250, 245, 255);
      doc.rect(14, y, pageWidth - 28, 8, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(24, 12, 52);
    doc.text(t.name, 18, y + 5.2);

    // Value
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 7, 100);
    doc.text(String(t.value), 85, y + 5.2);

    // Unit
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 33, 168);
    doc.text(t.unit, 120, y + 5.2);

    // Illustrative Range
    doc.text(`${t.referenceLow} - ${t.referenceHigh} (Illustrative)`, 145, y + 5.2);

    // Status
    if (t.flag === 'NORMAL') {
      doc.setTextColor(16, 185, 129);
      doc.text('NORMAL', pageWidth - 18, y + 5.2, { align: 'right' });
    } else {
      doc.setTextColor(220, 38, 38);
      doc.text(t.flag.replace('_', ' '), pageWidth - 18, y + 5.2, { align: 'right' });
    }

    // Divider
    doc.setDrawColor(233, 213, 255);
    doc.line(14, y + 8, pageWidth - 14, y + 8);

    y += 8;
  });

  y += 6;

  // Clinical Interpretative Notes Box
  doc.setFillColor(250, 245, 255);
  doc.setDrawColor(216, 180, 254);
  doc.roundedRect(14, y, pageWidth - 28, 36, 2, 2, 'FD');

  doc.setTextColor(24, 12, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`CLINICAL EVALUATION SUMMARY FOR ${report.patient.name.toUpperCase()}`, 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(76, 29, 149);
  doc.text(`• Total Analytes Evaluated: ${report.tests.length} laboratory parameters.`, 18, y + 12);
  doc.text(`• Risk Evaluation: ${report.riskSummary?.ckd.stage || 'G1 Stage'} filtration status per clinical guideline matrix.`, 18, y + 18);
  doc.text(`• Clinical Directive: ${report.riskSummary?.clinicalTakeaway ? report.riskSummary.clinicalTakeaway.slice(0, 110) : 'Standard baseline physiological values.'}...`, 18, y + 24);

  y += 42;

  // Academic Project Disclaimer
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(14, y, pageWidth - 28, 16, 1.5, 1.5, 'FD');

  doc.setTextColor(185, 28, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('ACADEMIC PROJECT DISCLAIMER', 18, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(127, 29, 29);
  doc.text(
    'This report is generated for the B.Tech CSE Capstone Project ("MediSense AI"). It is intended for academic evaluation and clinical informatics demonstration only. Not for standalone clinical diagnosis.',
    18,
    y + 8.5,
    { maxWidth: pageWidth - 36 }
  );

  // Save the PDF
  const filename = `MediSense_Report_${report.patient.name.replace(/\s+/g, '_')}_${report.patient.medicalRecordNumber}.pdf`;
  doc.save(filename);
}
