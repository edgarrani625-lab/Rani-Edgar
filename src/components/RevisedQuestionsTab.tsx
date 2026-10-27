import React, { useState } from 'react';
import { Check, Copy, ArrowRight, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { InterviewKit, QuestionItem } from '../types/fairhire';

interface RevisedQuestionsTabProps {
  kit: InterviewKit;
  onCopyQuestion: (text: string) => void;
}

export const RevisedQuestionsTab: React.FC<RevisedQuestionsTabProps> = ({
  kit,
  onCopyQuestion,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'changed' | 'unchanged'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const displayedQuestions = kit.questions.filter(q => {
    if (filterMode === 'changed') return q.status === 'Changed';
    if (filterMode === 'unchanged') return q.status === 'Unchanged';
    return true;
  });

  const changedCount = kit.questions.filter(q => q.status === 'Changed').length;
  const unchangedCount = kit.questions.filter(q => q.status === 'Unchanged').length;

  const handleCopy = (q: QuestionItem) => {
    onCopyQuestion(`"${q.question}" (Competency: ${q.competency})`);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            Remediated Question Inventory
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare flagged JD exclusionary assumptions directly against their equitable, competency-anchored inquiries.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-full shrink-0">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
              filterMode === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({kit.questions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('changed')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
              filterMode === 'changed'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Changed ({changedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('unchanged')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
              filterMode === 'unchanged'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Unchanged ({unchangedCount})
          </button>
        </div>
      </div>

      {/* List of Questions */}
      <div className="space-y-3.5">
        {displayedQuestions.map((q, idx) => {
          const isChanged = q.status === 'Changed';
          return (
            <div
              key={q.id}
              className={`rounded-2xl border p-5 text-xs transition-all shadow-2xs card-lift ${
                isChanged
                  ? 'border-amber-200 bg-amber-50/20 dark:border-amber-900/40 dark:bg-amber-950/10'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-400 dark:text-slate-500">
                    Q{idx + 1}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white font-heading">
                    {q.category}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Competency: {q.competency}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isChanged
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                    }`}
                  >
                    {isChanged ? 'Changed & Remediated' : 'Unchanged (Standard)'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(q)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Copy revised question"
                  >
                    {copiedId === q.id ? (
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {isChanged ? (
                <div className="space-y-3">
                  {q.originalQuestion && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 text-xs dark:border-rose-900/50 dark:bg-rose-950/30">
                      <span className="font-bold text-rose-800 dark:text-rose-300 block mb-1">
                        Original Flawed Premise / Flagged Requirement:
                      </span>
                      <p className="italic text-rose-900 dark:text-rose-200 font-serif leading-relaxed">
                        "{q.originalQuestion}"
                      </p>
                    </div>
                  )}

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs dark:border-emerald-900/50 dark:bg-emerald-950/30">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                      Final Remediated Question:
                    </span>
                    <p className="font-semibold text-emerald-950 dark:text-emerald-100 text-sm leading-relaxed">
                      "{q.question}"
                    </p>
                  </div>

                  {q.changeRationale && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <strong className="text-slate-800 dark:text-slate-200">Fairness Rationale: </strong>
                      {q.changeRationale}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm leading-relaxed">
                    "{q.question}"
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Meets standard objective fairness criteria. Anchored directly to core job responsibilities.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
