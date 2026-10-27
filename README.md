# FairHire Interview Assistant

A responsive, high-fidelity web application that generates structured, competency-anchored interview kits from job descriptions and enforces an automated bias audit gate before any questions can be approved or exported.

## Features
- **Job Description Analysis**: Synthesizes 4–10 structured interview questions with:
  - Job competency mapping
  - 3–4 strong answer indicators (look for)
  - 5-point Behaviorally Anchored Rating Scale (BARS)
  - Standard follow-up probes
- **Automated Bias & DE&I Audit**:
  - Scans for gender-coded language, ageism ("digital native"), vague "culture fit", ableist physical requirements, and educational pedigree bias.
  - Overall status evaluation: **PASS**, **PASS WITH CHANGES**, or **FAIL**.
  - Flagged risk table with affected groups and applied remediations.
  - Demographic impact cards (Gender, Age, Disability/Accessibility, Socioeconomic).
- **Statistical Adverse Impact (EEOC 4/5ths Rule)**:
  - Upload historical candidate outcome CSV (`group,interviewed,selected`) to calculate Adverse Impact Ratios (AIR).
  - Automatically flags violations where selection rates drop below 80% of the benchmark demographic group.
  - Informational fallback when no CSV is provided: *"Qualitative review only, not a statistical validation."*
- **Strict Approval Gate (Sticky Bottom Bar)**:
  - Questions and export actions remain visibly locked under **"NOT APPROVED"** status.
  - Approval is disabled if the user hasn't ticked *"I have reviewed the bias audit"* or if the audit status is **FAIL**.
  - Interactive "Request Changes" text box sending feedback to the session to regenerate.
  - Unlocks PDF export (print-optimized), Microsoft Word (`.docx`), and Markdown export once approved.
- **Privacy & Safety Safeguards**:
  - PII warning: warns users never to enter candidate names or personal identifiers.
  - Local storage opt-in: ephemeral by default; does not persist JD or candidate data unless opted in.
  - Server-side rate limiting on `/api/generate`.
  - Regulatory disclaimer banner for NYC Local Law 144, EU AI Act, and EEOC guidelines.

---

## Setup & Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Lyzr Agent API credentials (kept strictly server-side):
```env
LYZR_API_KEY="your-lyzr-api-key"
LYZR_AGENT_ID="your-lyzr-agent-id"
```
*Note: If `LYZR_API_KEY` and `LYZR_AGENT_ID` are left blank, FairHire seamlessly falls back to its built-in local Industrial-Organizational compliance engine so you can test all features immediately.*

### 3. Start Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

---

## Project Structure
```
fairhire-interview-assistant/
├── .env.example               # Lyzr API placeholders
├── index.html                 # HTML entry point with Plus Jakarta Sans & JetBrains Mono
├── metadata.json              # Applet metadata
├── package.json               # Dependencies and scripts (full-stack Express + Vite)
├── server.ts                  # Node/Express backend proxy calling Lyzr API with rate-limiting
├── src/
│   ├── App.tsx                # Main application state, multi-step flow, 4 tabs, approval gate
│   ├── index.css              # Tailwind styles & print-optimized PDF layout
│   ├── main.tsx               # React root mount
│   ├── components/
│   │   ├── ApprovalGateBar.tsx    # Sticky bottom bar with approval checkbox & locked exports
│   │   ├── BiasAuditTab.tsx       # PASS/FAIL banner, flagged items, 4/5ths statistical table
│   │   ├── FairnessChecklistTab.tsx # 8 structured interviewing best practices checklist
│   │   ├── Footer.tsx             # Regulatory disclaimers & local storage opt-in
│   │   ├── Header.tsx             # Brand, decision support badge, light/dark mode toggle
│   │   ├── InputPanel.tsx         # JD textarea, sample buttons, CSV upload, parameters
│   │   ├── InterviewKitTab.tsx    # Table with category chips, expandable BARS rubrics, search
│   │   ├── MarkdownModal.tsx      # Raw markdown inspector and .md file downloader
│   │   ├── RevisedQuestionsTab.tsx # Side-by-side diff of changed vs unchanged questions
│   │   └── Toast.tsx              # User feedback toasts (copied, approved, alerts)
│   ├── data/
│   │   └── sampleJds.ts           # 3 authentic sample JDs (Normal, Biased, Technical) + sample CSV
│   ├── services/
│   │   └── biasEngine.ts          # Lyzr prompt builder, parser, and local compliance engine
│   ├── types/
│   │   └── fairhire.ts            # TypeScript interfaces
│   └── utils/
│       ├── csvParser.ts           # Adverse impact ratio & EEOC 4/5ths rule calculation
│       └── exportUtils.ts         # DOCX binary generator and print PDF utilities
└── tsconfig.json
```
