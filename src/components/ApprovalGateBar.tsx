import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle,
  AlertOctagon,
  FileDown,
  Printer,
  Copy,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { InterviewKit } from '../types/fairhire';

interface ApprovalGateBarProps {
  kit: InterviewKit;
  onApprove: () => void;
  onRevokeApproval: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onCopyMarkdown: () => void;
  onRequestChanges: (feedbackText: string) => void;
  isRegenerating: boolean;
}

export const ApprovalGateBar: React.FC<ApprovalGateBarProps> = ({
  kit,
  onApprove,
  onRevokeApproval,
  onExportDocx,
  onExportPdf,
  onCopyMarkdown,
  onRequestChanges,
  isRegenerating,
}) => {
  const [hasReviewedAudit, setHasReviewedAudit] = useState(kit.reviewedAudit || kit.approved);
  const [showRequestChanges, setShowRequestChanges] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [copiedMd, setCopiedMd] = useState(false);

  const isFail = kit.auditStatus === 'FAIL';
  const canApprove = hasReviewedAudit && !isFail && !kit.approved;

  const handleApproveClick = () => {
    if (canApprove) {
      onApprove();
    }
  };

  const handleCopyMdClick = () => {
    onCopyMarkdown();
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInput.trim()) return;
    onRequestChanges(feedbackInput.trim());
    setFeedbackInput('');
    setShowRequestChanges(false);
  };

  return (
    <>
      {/* Sticky Bottom Glassmorphism Bar */}
      <div className="sticky bottom-0 z-40 w-full border-t border-slate-200/80 dark:border-slate-800/80 glass-bar shadow-xl transition-all no-print">
        <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5 px-4 py-3 sm:px-6 lg:px-8 max-w-7xl">
          {/* Left: Status Pill & Review Checkbox Gate */}
          <div className="flex flex-wrap items-center gap-3.5 w-full md:w-auto">
            {/* Status Pill (Red "NOT APPROVED" -> Green "APPROVED") */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-xs shrink-0 ${
                kit.approved
                  ? 'bg-[#16A34A] text-white ring-2 ring-[#16A34A]/30'
                  : 'bg-[#DC2626] text-white ring-2 ring-[#DC2626]/30'
              }`}
            >
              {kit.approved ? (
                <>
                  <CheckCircle className="h-4 w-4" aria-hidden="true" />
                  <span>APPROVED</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  <span>NOT APPROVED</span>
                </>
              )}
            </div>

            {/* Checkbox Gate */}
            {!kit.approved ? (
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200 select-none">
                <input
                  type="checkbox"
                  checked={hasReviewedAudit}
                  onChange={e => setHasReviewedAudit(e.target.checked)}
                  className="h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                <span>I have reviewed the bias audit and verified competency alignment</span>
              </label>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span>Audit reviewed & kit unlocked for panel delivery</span>
                {kit.approvedAt && (
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    ({new Date(kit.approvedAt).toLocaleTimeString()})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: Actions (Request Changes, Approve, Locked Exports) */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 w-full md:w-auto">
            {/* Request Changes Button */}
            <button
              type="button"
              onClick={() => setShowRequestChanges(!showRequestChanges)}
              disabled={isRegenerating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <MessageSquare className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <span>Request Changes</span>
            </button>

            {/* Approve Kit Button */}
            {!kit.approved ? (
              <div className="relative group">
                <button
                  type="button"
                  onClick={handleApproveClick}
                  disabled={!canApprove}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-xl bg-indigo-600 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-40 transition-all shadow-md hover:shadow-lg card-lift"
                >
                  <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Approve Kit</span>
                </button>

                {!canApprove && (
                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-64 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl z-50 pointer-events-none">
                    {isFail
                      ? 'Cannot approve: The audit status is FAIL due to critical exclusionary risks. Remediate flagged items or request changes.'
                      : 'Please check "I have reviewed the bias audit" to unlock approval.'}
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onRevokeApproval}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
              >
                <span>Revoke Approval</span>
              </button>
            )}

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

            {/* Export Buttons (Locked until approved) */}
            <div className="flex items-center gap-2">
              {/* PDF Export */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={onExportPdf}
                  disabled={!kit.approved}
                  aria-label="Export or Print PDF"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                    kit.approved
                      ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs card-lift'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                  }`}
                >
                  {kit.approved ? (
                    <Printer className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" aria-hidden="true" />
                  )}
                  <span>PDF</span>
                </button>
                {!kit.approved && (
                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-[11px] rounded-xl shadow-lg z-50 pointer-events-none">
                    Locked until kit is approved by reviewer.
                  </div>
                )}
              </div>

              {/* Word DOCX Export */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={onExportDocx}
                  disabled={!kit.approved}
                  aria-label="Export to Microsoft Word DOCX"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                    kit.approved
                      ? 'border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 shadow-2xs card-lift'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                  }`}
                >
                  {kit.approved ? (
                    <FileDown className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" aria-hidden="true" />
                  )}
                  <span>DOCX</span>
                </button>
                {!kit.approved && (
                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-[11px] rounded-xl shadow-lg z-50 pointer-events-none">
                    Locked until kit is approved by reviewer.
                  </div>
                )}
              </div>

              {/* Copy Markdown */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={handleCopyMdClick}
                  disabled={!kit.approved}
                  aria-label="Copy kit as Markdown"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                    kit.approved
                      ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs card-lift'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                  }`}
                >
                  {kit.approved ? (
                    copiedMd ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                    )
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" aria-hidden="true" />
                  )}
                  <span>{copiedMd ? 'Copied!' : 'Markdown'}</span>
                </button>
                {!kit.approved && (
                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-[11px] rounded-xl shadow-lg z-50 pointer-events-none">
                    Locked until kit is approved by reviewer.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Request Changes Slide-out Feedback Panel */}
        {showRequestChanges && (
          <div className="border-t border-slate-200/80 bg-white/95 dark:border-slate-800/80 dark:bg-slate-900/95 p-4">
            <div className="mx-auto max-w-7xl">
              <form onSubmit={handleSubmitFeedback} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 font-heading">
                    <Sparkles className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                    Request Changes & Re-Audit (Session: {kit.sessionId.slice(-8)})
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowRequestChanges(false)}
                    className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={feedbackInput}
                    onChange={e => setFeedbackInput(e.target.value)}
                    placeholder="e.g. 'Tone down aggressive language check and strengthen behavioral probes on mentorship'"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!feedbackInput.trim() || isRegenerating}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-bold text-white disabled:opacity-50 transition-colors shrink-0 shadow-xs"
                  >
                    {isRegenerating ? 'Regenerating...' : 'Submit Revision'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
