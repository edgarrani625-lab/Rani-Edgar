import React from 'react';
import { Check, Edit3, ShieldAlert, Award } from 'lucide-react';

interface StepProgressBarProps {
  currentStep: 1 | 2 | 3;
  onNavigateStep?: (step: 1 | 2 | 3) => void;
  hasKit: boolean;
  isApproved: boolean;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  onNavigateStep,
  hasKit,
  isApproved,
}) => {
  const steps = [
    {
      step: 1,
      label: 'Input & Role Spec',
      subtitle: 'Paste JD or pick template',
      icon: Edit3,
    },
    {
      step: 2,
      label: 'Review Audit & Kit',
      subtitle: 'Examine bias checks & BARS',
      icon: ShieldAlert,
    },
    {
      step: 3,
      label: 'Approve & Export',
      subtitle: 'Unlock Word & PDF packages',
      icon: Award,
    },
  ];

  return (
    <nav aria-label="Workflow progress" className="mb-8 no-print">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map(s => {
          const isCompleted =
            (s.step === 1 && hasKit) ||
            (s.step === 2 && isApproved);
          const isActive = currentStep === s.step;
          const isUpcoming = !isActive && !isCompleted;

          const IconComponent = s.icon;

          return (
            <div
              key={s.step}
              onClick={() => {
                if (s.step === 1) onNavigateStep?.(1);
                else if (s.step === 2 && hasKit) onNavigateStep?.(2);
                else if (s.step === 3 && hasKit) onNavigateStep?.(3);
              }}
              role="button"
              tabIndex={hasKit || s.step === 1 ? 0 : -1}
              className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all ${
                isActive
                  ? 'border-indigo-600 bg-white dark:bg-slate-900 shadow-md ring-2 ring-indigo-500/20 dark:ring-indigo-500/30'
                  : isCompleted
                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-700 dark:text-slate-300'
                  : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 opacity-60'
              } ${hasKit || s.step === 1 ? 'cursor-pointer hover:border-indigo-400' : 'cursor-default'}`}
            >
              {/* Step indicator circle */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs transition-colors ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 stroke-[2.5]" aria-hidden="true" />
                ) : (
                  <IconComponent className="h-4 w-4" aria-hidden="true" />
                )}
              </div>

              {/* Text metadata */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Step {s.step}
                  </span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                  )}
                </div>
                <span
                  className={`text-xs font-bold font-heading truncate ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : isCompleted
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                  {s.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
