import React from 'react';
import { CheckSquare, Square, ShieldCheck, AlertCircle } from 'lucide-react';
import { FairnessRecommendation } from '../types/fairhire';

interface FairnessChecklistTabProps {
  recommendations: FairnessRecommendation[];
  onToggleRecommendation: (id: string) => void;
}

export const FairnessChecklistTab: React.FC<FairnessChecklistTabProps> = ({
  recommendations,
  onToggleRecommendation,
}) => {
  const completedCount = recommendations.filter(r => r.checked).length;
  const progressPercent = Math.round((completedCount / recommendations.length) * 100);

  return (
    <div className="space-y-5">
      {/* Overview and Progress */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
              <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              Structured Interviewing & DE&I Safeguards Checklist
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Evidence-based industrial-organizational safeguards to eliminate affinity bias, halo effects, and disparate impact.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {completedCount}/{recommendations.length} Verified ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              progressPercent === 100
                ? 'bg-emerald-500'
                : progressPercent >= 60
                ? 'bg-indigo-600'
                : 'bg-amber-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {recommendations.map(rec => {
          return (
            <div
              key={rec.id}
              onClick={() => onToggleRecommendation(rec.id)}
              className={`flex items-start gap-3.5 rounded-2xl border p-4 text-xs cursor-pointer select-none transition-all card-lift ${
                rec.checked
                  ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/20 shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                aria-checked={rec.checked}
                role="checkbox"
                aria-label={rec.title}
                className="mt-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus-visible:outline-none shrink-0"
              >
                {rec.checked ? (
                  <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                ) : (
                  <Square className="h-4 w-4 text-slate-400" aria-hidden="true" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`font-bold font-heading truncate ${
                      rec.checked
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {rec.title}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium shrink-0">
                    {rec.category}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {rec.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5 p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-850/60 dark:text-slate-400 shadow-2xs">
        <AlertCircle className="h-4 w-4 text-indigo-500 shrink-0" aria-hidden="true" />
        <span>
          Checking all safeguard items confirms the panel has committed to calibrated scoring benchmarks and independent scoring submissions prior to deliberation.
        </span>
      </div>
    </div>
  );
};
