# MediSense AI — Portable Point-of-Care Diagnosis Platform
### B.Tech Computer Science & Engineering Final-Year Capstone Project

MediSense AI is a full-stack, AI-assisted point-of-care laboratory diagnostic and medical report intelligence platform. It bridges portable microfluidic analyzer telemetry with multimodal OCR document extraction, automated data quality auditing, evidence-based clinical risk prediction models, and verified generative AI decision support.

---

## 🔬 Core Workflow Architecture
```
[ POCT Cartridge / Scanned Report / PDF / Image ]
                        │
                        ▼
           1. Report Scanner & Multimodal OCR
              (Gemini 3.8 Flash Vision + High-Precision Clinical Heuristic)
                        │
                        ▼
          2. Laboratory Interpreter Table
             (Editable Analyte Table with Category, Unit & Flag Recalculation)
                        │
                        ▼
          3. Data Quality Guardian
             (Audits Missing Data, Unit Inconsistencies, OCR Confidence & Plausibility)
                        │
                        ▼
          4. AI/ML Clinical Risk Engine
             (ACC/AHA ASCVD, CKD-EPI 2021 eGFR, Hepatic FIB-4, Metabolic Syndrome)
                        │
                        ▼
          5. Longitudinal Health Trends & AI Assistant
             (Multi-Visit Trajectories & Grounded Clinical Explanations)
                        │
                        ▼
          6. One-Click Certified PDF Export
             (Automated jsPDF Generation with Demographics, Audit Badge & Disclaimers)
```

---

## 🎨 UI & Aesthetics
- **Argentine-Inspired Palette:**
  - Sky Blue `#74ACDF`
  - Deep Blue `#4B9FE8`
  - White `#FFFFFF`
  - Midnight Navy `#10182F`
  - Violet `#8172E8`
  - Cyan `#43D9E8`
  - Teal `#36C9B4`
  - Gold `#F5C75E`
- **Typographic Pairings:** Plus Jakarta Sans & Manrope with JetBrains Mono for precision tabular numerals (`tabular-nums`).
- **Photorealistic 3D Assets:** Custom raytraced biological crystal heart sculpture, handheld POCT analyzer hardware, and cellular plasma biomarkers.

---

## 📊 Implemented Clinical Prediction Models
1. **10-Year ASCVD Risk Score:** ACC/AHA Pooled Cohort Equations calculating 10-year probability of hard atherosclerotic cardiovascular events.
2. **eGFR & Renal Disease Staging:** 2021 CKD-EPI Creatinine Equation without race modifier, classifying kidney function across KDIGO Stages G1 to G5.
3. **Hepatic Fibrosis FIB-4 Index:** Non-invasive ratio: `(Age × AST) / (Platelets × √ALT)` to predict liver fibrosis.
4. **Metabolic Syndrome Triad:** NCEP ATP III 4-point criteria evaluation for insulin resistance and metabolic hazard.
5. **Systemic Inflammatory Score:** Synthesis of hs-CRP, WBC count, and High-Sensitivity Troponin I.
6. **Explainable Feature Attribution:** SHAP-inspired positive/negative weight ranking explaining each biomarker's clinical impact.

---

## 🚀 Running the Platform
```bash
# Install dependencies
npm install

# Start full-stack development server (Express + Vite on port 3000)
npm run dev

# Build production bundle
npm run build
```

---

## ⚠️ Regulatory & Clinical Decision Support Disclaimer
MediSense AI is an investigational clinical decision support system designed for academic and demonstration purposes. It does not replace independent professional medical judgment, licensed diagnostic evaluation, or clinical laboratory standard-of-care verification.
