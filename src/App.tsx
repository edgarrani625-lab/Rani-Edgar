import React, { useState, useEffect } from 'react';
import {
  FileText,
  ShieldAlert,
  Sparkles,
  CheckSquare,
  Eye,
  AlertCircle,
  RefreshCw,
  Scale,
  Award,
} from 'lucide-react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { StepProgressBar } from './components/StepProgressBar';
import { InputPanel } from './components/InputPanel';
import { InterviewKitTab } from './components/InterviewKitTab';
import { BiasAuditTab } from './components/BiasAuditTab';
import { RevisedQuestionsTab } from './components/RevisedQuestionsTab';
import { FairnessChecklistTab } from './components/FairnessChecklistTab';
import { ApprovalGateBar } from './components/ApprovalGateBar';
import { MarkdownModal } from './components/MarkdownModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';
import { InterviewKit, SeniorityLevel } from './types/fairhire';
import { JobTemplate, InterviewStyleOption, INTERVIEW_STYLES } from './data/jobTemplates';
import { exportKitToDocx, printOrExportPdf } from './utils/exportUtils';
import { generateLocalAuditKit } from './services/biasEngine';

type ActiveTab = 'kit' | 'audit' | 'revised' | 'checklist';

export default function App() {
  // Theme state (Inter for body, Plus Jakarta Sans for headings)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fairhire_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Data storage opt-in
  const [storageOptIn, setStorageOptIn] = useState<boolean>(() => {
    return localStorage.getItem('fairhire_storage_opt_in') === 'true';
  });

  // Custom Templates in LocalStorage
  const [customTemplates, setCustomTemplates] = useState<JobTemplate[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fairhire_custom_templates');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Input states
  const [jd, setJd] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [seniority, setSeniority] = useState<SeniorityLevel>('Senior');
  const [numQuestions, setNumQuestions] = useState<number>(8);
  const [csvData, setCsvData] = useState<string>('');
  const [csvFileName, setCsvFileName] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<InterviewStyleOption>(INTERVIEW_STYLES[0]);

  // App processing states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [systemMode, setSystemMode] = useState<string>('FairHire Intelligence');
  const [showMarkdownModal, setShowMarkdownModal] = useState<boolean>(false);

  // Generated Kit and Navigation
  const [kit, setKit] = useState<InterviewKit | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('kit');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Calculate current workflow step for the 3-step progress bar
  const currentWorkflowStep: 1 | 2 | 3 = !kit ? 1 : kit.approved ? 3 : 2;

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fairhire_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fairhire_theme', 'light');
    }
  }, [darkMode]);

  // Backend mode detection & saved kit restoration
  useEffect(() => {
    fetch('/api/config-status')
      .then(res => res.json())
      .then(data => {
        if (data.mode) {
          setSystemMode(data.mode);
        }
      })
      .catch(() => {
        setSystemMode('FairHire Local Engine');
      });

    if (storageOptIn) {
      const saved = localStorage.getItem('fairhire_saved_kit');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setKit(parsed);
        } catch {
          // ignore corrupted local state
        }
      }
    }
  }, [storageOptIn]);

  // Save kit to local storage if opted in
  useEffect(() => {
    if (storageOptIn && kit) {
      localStorage.setItem('fairhire_saved_kit', JSON.stringify(kit));
    } else if (!storageOptIn) {
      localStorage.removeItem('fairhire_saved_kit');
    }
  }, [kit, storageOptIn]);

  // Save custom templates to local storage
  const handleSaveCustomTemplate = (newTemplate: JobTemplate) => {
    const updated = [newTemplate, ...customTemplates];
    setCustomTemplates(updated);
    if (storageOptIn) {
      localStorage.setItem('fairhire_custom_templates', JSON.stringify(updated));
    }
    addToast('success', `Saved custom template "${newTemplate.title}".`);
  };

  const handleDeleteCustomTemplate = (id: string) => {
    const updated = customTemplates.filter(t => t.id !== id);
    setCustomTemplates(updated);
    if (storageOptIn) {
      localStorage.setItem('fairhire_custom_templates', JSON.stringify(updated));
    }
    addToast('info', 'Custom template removed.');
  };

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleToggleStorageOptIn = () => {
    const nextVal = !storageOptIn;
    setStorageOptIn(nextVal);
    localStorage.setItem('fairhire_storage_opt_in', String(nextVal));
    if (!nextVal) {
      localStorage.removeItem('fairhire_saved_kit');
      localStorage.removeItem('fairhire_custom_templates');
      addToast('info', 'Local storage persistence cleared.');
    } else {
      localStorage.setItem('fairhire_custom_templates', JSON.stringify(customTemplates));
      addToast('success', 'Local storage persistence enabled.');
    }
  };

  // Template selection handler
  const handleSelectTemplate = (template: JobTemplate) => {
    setSelectedTemplateId(template.id);
    setJd(template.content);
    setJobTitle(template.title);
    setSeniority(template.seniority);
    addToast('success', 'Template applied. Edit freely.');
  };

  // Interview style handler
  const handleSelectStyle = (style: InterviewStyleOption) => {
    setSelectedStyle(style);
    setNumQuestions(style.questionCount);
    addToast('info', `Selected style: ${style.title} (${style.duration}).`);
  };

  const handleReset = () => {
    setJd('');
    setJobTitle('');
    setSeniority('Senior');
    setNumQuestions(8);
    setCsvData('');
    setCsvFileName('');
    setSelectedTemplateId(null);
    setKit(null);
    setError(null);
    addToast('info', 'Input parameters reset.');
  };

  // Generate Kit
  const handleGenerate = async () => {
    if (!jd.trim()) return;

    setIsGenerating(true);
    setError(null);

    // Combine style instruction prompt with feedback
    const styleInstruction = selectedStyle ? selectedStyle.instructionPrompt : '';

    const payload = {
      jd: jd.trim(),
      jobTitle: jobTitle.trim() || undefined,
      seniority,
      numQuestions,
      pastOutcomeCsv: csvData.trim() || undefined,
      sessionId: `session-${Date.now()}`,
      feedback: styleInstruction,
    };

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const errData = await response.json();
          throw new Error(errData.error || 'Rate limit reached. Please wait a minute.');
        }
        const errText = await response.text();
        throw new Error(`Server returned error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      if (!data.kit) {
        throw new Error('Invalid response structure received from proxy.');
      }

      setKit(data.kit);
      setActiveTab('kit');
      addToast('success', 'Structured interview kit & bias audit generated.');

      if (data.warning) {
        console.info('Proxy notice:', data.warning);
      }
    } catch (err: any) {
      console.warn('API error, falling back to local IO compliance engine:', err.message);
      try {
        const fallbackKit = generateLocalAuditKit(payload);
        setKit(fallbackKit);
        setActiveTab('kit');
        addToast('info', 'Generated using FairHire Local Compliance Engine.');
      } catch (fallbackErr: any) {
        setError(err.message || 'Failed to generate interview kit. Please check inputs and retry.');
        addToast('error', 'Generation error. Click retry below.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Request Changes / Regenerate with feedback
  const handleRequestChanges = async (feedbackText: string) => {
    if (!kit) return;

    setIsRegenerating(true);
    setError(null);

    const payload = {
      jd: jd.trim(),
      jobTitle: kit.jobTitle,
      seniority: kit.seniority,
      numQuestions: kit.questions.length,
      pastOutcomeCsv: csvData.trim() || undefined,
      sessionId: kit.sessionId,
      feedback: feedbackText,
    };

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to regenerate (${response.status})`);
      }

      const data = await response.json();
      if (data.kit) {
        setKit(data.kit);
        addToast('success', 'Kit regenerated with requested changes.');
      }
    } catch (err: any) {
      console.warn('Regeneration API error, updating locally', err);
      const fallbackKit = generateLocalAuditKit(payload);
      setKit(fallbackKit);
      addToast('info', 'Kit refreshed with local compliance engine.');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Kit Approval Gate
  const handleApprove = () => {
    if (!kit) return;
    if (kit.auditStatus === 'FAIL') {
      addToast('error', 'Cannot approve kit while Audit Status is FAIL.');
      return;
    }

    setKit(prev => {
      if (!prev) return null;
      return {
        ...prev,
        reviewedAudit: true,
        approved: true,
        approvedAt: new Date().toISOString(),
        approvedBy: 'Verified Hiring Lead',
      };
    });

    addToast('success', 'Interview Kit APPROVED! Export controls unlocked.');
  };

  const handleRevokeApproval = () => {
    setKit(prev => {
      if (!prev) return null;
      return {
        ...prev,
        approved: false,
        approvedAt: undefined,
      };
    });
    addToast('info', 'Approval revoked. Export controls locked.');
  };

  // Export handlers
  const handleExportDocx = async () => {
    if (!kit || !kit.approved) {
      addToast('error', 'Kit must be approved before exporting.');
      return;
    }
    try {
      await exportKitToDocx(kit);
      addToast('success', 'Word document (.docx) downloaded.');
    } catch (err: any) {
      addToast('error', `DOCX export failed: ${err.message}`);
    }
  };

  const handleExportPdf = () => {
    if (!kit || !kit.approved) {
      addToast('error', 'Kit must be approved before exporting.');
      return;
    }
    addToast('info', 'Opening print / save as PDF dialog...');
    printOrExportPdf();
  };

  const handleCopyMarkdown = () => {
    if (!kit || !kit.approved) {
      addToast('error', 'Kit must be approved before copying.');
      return;
    }
    if (kit.rawMarkdown) {
      navigator.clipboard.writeText(kit.rawMarkdown);
      addToast('success', 'Full interview kit copied as Markdown.');
    }
  };

  const handleCopySingleQuestion = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('success', 'Question copied to clipboard.');
  };

  const handleToggleRecommendation = (id: string) => {
    if (!kit) return;
    setKit(prev => {
      if (!prev) return null;
      return {
        ...prev,
        fairnessRecommendations: prev.fairnessRecommendations.map(r =>
          r.id === id ? { ...r, checked: !r.checked } : r
        ),
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-[#E5E7EB] flex flex-col font-sans transition-colors">
      {/* Top Bar Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        systemMode={systemMode}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section with custom gradient & feature chips */}
        <HeroSection />

        {/* 3-Step Progress Bar */}
        <StepProgressBar
          currentStep={currentWorkflowStep}
          hasKit={Boolean(kit)}
          isApproved={Boolean(kit?.approved)}
          onNavigateStep={step => {
            if (step === 1 && kit) {
              window.scrollTo({ top: 400, behavior: 'smooth' });
            } else if (step === 2 && kit) {
              setActiveTab('audit');
            } else if (step === 3 && kit) {
              setActiveTab('kit');
            }
          }}
        />

        {/* Error Alert with Retry */}
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200 flex items-start justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold font-heading">Generation Issue Encountered</p>
                <p className="mt-0.5 text-rose-800 dark:text-rose-300">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors shrink-0 shadow-2xs"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Retry
            </button>
          </div>
        )}

        {/* Step 1: Input Panel with Template Gallery */}
        <InputPanel
          jd={jd}
          setJd={setJd}
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          seniority={seniority}
          setSeniority={setSeniority}
          numQuestions={numQuestions}
          setNumQuestions={setNumQuestions}
          csvData={csvData}
          setCsvData={setCsvData}
          csvFileName={csvFileName}
          setCsvFileName={setCsvFileName}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
          onReset={handleReset}
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={handleSelectTemplate}
          customTemplates={customTemplates}
          onSaveCustomTemplate={handleSaveCustomTemplate}
          onDeleteCustomTemplate={handleDeleteCustomTemplate}
          selectedStyleId={selectedStyle.id}
          onSelectStyle={handleSelectStyle}
          storageOptIn={storageOptIn}
        />

        {/* Step 2: Results Section with Pill-Style Segmented Tabs */}
        {kit && (
          <section className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    2
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                    Audited Kit: {kit.jobTitle}
                  </h2>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{kit.seniority}</span>
                  <span aria-hidden="true">·</span>
                  <span>{kit.questions.length} Structured Questions</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-[11px]">Session: {kit.sessionId.slice(-8)}</span>
                </div>
              </div>

              {/* View Raw Markdown Button */}
              {kit.rawMarkdown && (
                <button
                  type="button"
                  onClick={() => setShowMarkdownModal(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs self-start sm:self-auto"
                >
                  <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  <span>View Raw Markdown</span>
                </button>
              )}
            </div>

            {/* Pill-Style Segmented Controls Tab Bar */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-2xs">
              {/* Tab 1: Interview Kit */}
              <button
                type="button"
                onClick={() => setActiveTab('kit')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap font-heading ${
                  activeTab === 'kit'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>Interview Kit ({kit.questions.length})</span>
              </button>

              {/* Tab 2: Bias Audit */}
              <button
                type="button"
                onClick={() => setActiveTab('audit')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap font-heading ${
                  activeTab === 'audit'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                <span>Bias Audit</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    kit.auditStatus === 'PASS'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : kit.auditStatus === 'PASS_WITH_CHANGES'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {kit.auditStatus === 'PASS_WITH_CHANGES' ? 'Changes Needed' : kit.auditStatus}
                </span>
              </button>

              {/* Tab 3: Final Revised Questions */}
              <button
                type="button"
                onClick={() => setActiveTab('revised')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap font-heading ${
                  activeTab === 'revised'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>Final Revised Questions</span>
                {kit.questions.some(q => q.status === 'Changed') && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    {kit.questions.filter(q => q.status === 'Changed').length} Changed
                  </span>
                )}
              </button>

              {/* Tab 4: Fairness Recommendations */}
              <button
                type="button"
                onClick={() => setActiveTab('checklist')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap font-heading ${
                  activeTab === 'checklist'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CheckSquare className="h-4 w-4" aria-hidden="true" />
                <span>Fairness Recommendations</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  ({kit.fairnessRecommendations.filter(r => r.checked).length}/{kit.fairnessRecommendations.length})
                </span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {activeTab === 'kit' && (
                <InterviewKitTab kit={kit} onCopyQuestion={handleCopySingleQuestion} />
              )}
              {activeTab === 'audit' && <BiasAuditTab kit={kit} />}
              {activeTab === 'revised' && (
                <RevisedQuestionsTab kit={kit} onCopyQuestion={handleCopySingleQuestion} />
              )}
              {activeTab === 'checklist' && (
                <FairnessChecklistTab
                  recommendations={kit.fairnessRecommendations}
                  onToggleRecommendation={handleToggleRecommendation}
                />
              )}
            </div>
          </section>
        )}

        {/* Clean Print Representation for PDF Generation */}
        {kit && (
          <div className="hidden print-only text-black p-4 space-y-6">
            <div className="border-b-2 border-black pb-3">
              <h1 className="text-2xl font-bold">FairHire Structured Interview Kit</h1>
              <p className="text-sm font-semibold">
                Role: {kit.jobTitle} ({kit.seniority}) · Audit Status: {kit.auditStatus} · Approval: {kit.approved ? 'APPROVED' : 'NOT APPROVED'}
              </p>
              <p className="text-xs text-gray-700">Date: {new Date().toLocaleDateString()}</p>
            </div>

            <div>
              <h2 className="text-base font-bold mb-1">Executive Bias Audit Summary</h2>
              <p className="text-xs leading-relaxed">{kit.auditSummary}</p>
            </div>

            <div>
              <h2 className="text-base font-bold mb-2">Structured Interview Questions & Rubrics</h2>
              {kit.questions.map((q, i) => (
                <div key={q.id} className="mb-4 pb-3 border-b border-gray-300 page-break-inside-avoid">
                  <p className="text-xs font-bold">Question {i + 1}: {q.category} [{q.status}]</p>
                  <p className="text-sm italic my-1 font-serif">"{q.question}"</p>
                  <p className="text-xs font-semibold">Competency: {q.competency}</p>
                  <p className="text-xs font-semibold mt-1">5-Point Rubric (BARS):</p>
                  <p className="text-xs">1: {q.scoringRubric[1]}</p>
                  <p className="text-xs">2: {q.scoringRubric[2]}</p>
                  <p className="text-xs">3: {q.scoringRubric[3]}</p>
                  <p className="text-xs">4: {q.scoringRubric[4]}</p>
                  <p className="text-xs">5: {q.scoringRubric[5]}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-gray-500 pt-4">
              Decision support, not legal advice. Have HR/legal review for your jurisdiction.
            </p>
          </div>
        )}
      </main>

      {/* Step 3: Approval Gate (Sticky Glassmorphic Bottom Bar) */}
      {kit && (
        <ApprovalGateBar
          kit={kit}
          onApprove={handleApprove}
          onRevokeApproval={handleRevokeApproval}
          onExportDocx={handleExportDocx}
          onExportPdf={handleExportPdf}
          onCopyMarkdown={handleCopyMarkdown}
          onRequestChanges={handleRequestChanges}
          isRegenerating={isRegenerating}
        />
      )}

      {/* Footer with Disclaimer */}
      <Footer
        storageOptIn={storageOptIn}
        onToggleStorageOptIn={handleToggleStorageOptIn}
        systemMode={systemMode}
      />

      {/* Markdown Inspector Modal */}
      {kit && (
        <MarkdownModal
          isOpen={showMarkdownModal}
          onClose={() => setShowMarkdownModal(false)}
          markdownContent={kit.rawMarkdown || ''}
          jobTitle={kit.jobTitle}
        />
      )}

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
