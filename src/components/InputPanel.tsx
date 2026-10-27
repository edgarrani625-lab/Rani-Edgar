import React, { useRef } from 'react';
import {
  Sparkles,
  Upload,
  FileText,
  AlertCircle,
  FileCheck2,
  X,
  RotateCcw,
  Info,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { JobTemplate, InterviewStyleOption } from '../data/jobTemplates';
import { SeniorityLevel } from '../types/fairhire';
import { TemplateGallery } from './TemplateGallery';

interface InputPanelProps {
  jd: string;
  setJd: (val: string) => void;
  jobTitle: string;
  setJobTitle: (val: string) => void;
  seniority: SeniorityLevel;
  setSeniority: (val: SeniorityLevel) => void;
  numQuestions: number;
  setNumQuestions: (val: number) => void;
  csvData: string;
  setCsvData: (val: string) => void;
  csvFileName: string;
  setCsvFileName: (val: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onReset: () => void;
  selectedTemplateId: string | null;
  onSelectTemplate: (template: JobTemplate) => void;
  customTemplates: JobTemplate[];
  onSaveCustomTemplate: (template: JobTemplate) => void;
  onDeleteCustomTemplate: (id: string) => void;
  selectedStyleId: string;
  onSelectStyle: (style: InterviewStyleOption) => void;
  storageOptIn: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  jd,
  setJd,
  jobTitle,
  setJobTitle,
  seniority,
  setSeniority,
  numQuestions,
  setNumQuestions,
  csvData,
  setCsvData,
  csvFileName,
  setCsvFileName,
  isGenerating,
  onGenerate,
  onReset,
  selectedTemplateId,
  onSelectTemplate,
  customTemplates,
  onSaveCustomTemplate,
  onDeleteCustomTemplate,
  selectedStyleId,
  onSelectStyle,
  storageOptIn,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      setCsvData(content || '');
    };
    reader.readAsText(file);
  };

  const handleLoadSampleCsv = () => {
    const sampleCsv = `group,interviewed,selected\nMale,120,48\nFemale,90,18\nNon-Binary,15,2\nUndisclosed,20,5`;
    setCsvData(sampleCsv);
    setCsvFileName('candidate_demographic_outcomes.csv');
  };

  const handleClearCsv = () => {
    setCsvData('');
    setCsvFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const wordCount = jd.trim() ? jd.trim().split(/\s+/).length : 0;
  const charCount = jd.length;

  return (
    <section className="space-y-6">
      {/* 1. Template Gallery Component */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <TemplateGallery
          onSelectTemplate={onSelectTemplate}
          selectedTemplateId={selectedTemplateId}
          customTemplates={customTemplates}
          onSaveCustomTemplate={onSaveCustomTemplate}
          onDeleteCustomTemplate={onDeleteCustomTemplate}
          currentJd={jd}
          currentTitle={jobTitle}
          currentSeniority={seniority}
          selectedStyleId={selectedStyleId}
          onSelectStyle={onSelectStyle}
          storageOptIn={storageOptIn}
        />
      </div>

      {/* 2. Main Job Description & Parameter Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
        {/* Panel Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                1
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Job Description & Role Parameters
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Customize role parameters or edit your job description to synthesize structured questions and calibrate rubrics.
            </p>
          </div>

          {/* Reset Action */}
          {(jd || jobTitle || csvData) && (
            <button
              type="button"
              onClick={onReset}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 self-start sm:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset All Fields
            </button>
          )}
        </div>

        {/* Privacy Safeguard Notice */}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" aria-hidden="true" />
          <div className="leading-relaxed">
            <span className="font-bold text-amber-900 dark:text-amber-300">
              Privacy Notice: Non-PII Safeguard ·{' '}
            </span>
            <span>
              Never enter candidate names, personal demographic identifiers, or confidential data. FairHire only evaluates job specifications and aggregated demographic rates.
            </span>
          </div>
        </div>

        {/* Form Fields: Job Title, Seniority, Target Questions */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="job-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Job Title
            </label>
            <input
              id="job-title"
              type="text"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="e.g. Backend Developer"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="seniority-level" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Seniority Level
            </label>
            <select
              id="seniority-level"
              value={seniority}
              onChange={e => setSeniority(e.target.value as SeniorityLevel)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="Entry-Level">Entry-Level (0–2 years)</option>
              <option value="Mid-Level">Mid-Level (3–5 years)</option>
              <option value="Senior">Senior (5–8 years)</option>
              <option value="Staff / Principal">Staff / Principal (8+ years)</option>
              <option value="Executive / Director">Executive / Director</option>
            </select>
          </div>

          <div>
            <label htmlFor="num-questions" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Number of Questions
            </label>
            <select
              id="num-questions"
              value={numQuestions}
              onChange={e => setNumQuestions(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value={4}>4 Questions (Quick Screen)</option>
              <option value={6}>6 Questions (Standard 30–45m)</option>
              <option value={8}>8 Questions (In-Depth 45–60m)</option>
              <option value={10}>10 Questions (Comprehensive Panel)</option>
              <option value={12}>12 Questions (Extended Bank)</option>
            </select>
          </div>
        </div>

        {/* Textarea for Job Description */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="jd-textarea" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Job Description Content <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              {wordCount} words · {charCount} chars
            </span>
          </div>
          <textarea
            id="jd-textarea"
            rows={9}
            value={jd}
            onChange={e => setJd(e.target.value)}
            placeholder="Paste complete job specification, core competencies, minimum qualifications, and team requirements here..."
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Optional Candidate Outcome Data (CSV) for 4/5ths Rule */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-850/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-heading">
                Optional: Historical Outcome CSV for Statistical Adverse Impact Audit
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {!csvData ? (
                <button
                  type="button"
                  onClick={handleLoadSampleCsv}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline"
                >
                  Load Sample 4/5ths Rule CSV
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleClearCsv}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                  Remove Attached CSV
                </button>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
            Attach historical selection counts by demographic group to evaluate the EEOC Four-Fifths (80%) Rule adverse impact threshold.
            Format: <code className="font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">group,interviewed,selected</code>.
          </p>

          {csvData ? (
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-2.5 text-xs text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span className="font-semibold">{csvFileName || 'candidate_outcomes.csv'}</span>
                <span className="text-[11px] opacity-75">
                  ({csvData.trim().split(/\r?\n/).length - 1} demographic groups recorded)
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                Ready for Statistical Validation
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 transition-colors shadow-2xs">
                <Upload className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                Upload CSV File
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                If omitted, FairHire conducts an in-depth qualitative bias audit and generates structured questions.
              </span>
            </div>
          )}
        </div>

        {/* Generate Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
            <span>Questions and exports remain locked behind the audit gate until verified by human review.</span>
          </div>

          <button
            type="button"
            onClick={onGenerate}
            disabled={!jd.trim() || isGenerating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-7 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all shrink-0 card-lift"
          >
            {isGenerating ? (
              <>
                <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Auditing & Synthesizing Kit...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-teal-300" aria-hidden="true" />
                <span>Generate Structured Interview Kit</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
