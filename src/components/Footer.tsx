import React from 'react';
import { ShieldCheck, HardDrive, Lock } from 'lucide-react';

interface FooterProps {
  storageOptIn: boolean;
  onToggleStorageOptIn: () => void;
  systemMode?: string;
}

export const Footer: React.FC<FooterProps> = ({
  storageOptIn,
  onToggleStorageOptIn,
  systemMode,
}) => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white py-12 dark:border-slate-800/80 dark:bg-slate-900/90 text-xs text-slate-500 dark:text-slate-400 no-print transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Legal Disclaimer Box */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-850/60 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <p className="font-bold text-slate-800 dark:text-slate-200 font-heading">
                Decision Support & Statutory Disclaimer
              </p>
              <p className="leading-relaxed">
                Decision support, not legal advice. Have HR/legal review for your jurisdiction (e.g., NYC Local Law 144, EU AI Act, EEOC Uniform Guidelines on Employee Selection Procedures).
              </p>
            </div>
          </div>
        </div>

        {/* Data Privacy & Storage Opt-In */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span>
              Ephemeral by default. Job descriptions, custom templates, and interview sessions are stored in memory or client-side only.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-slate-700 dark:text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={storageOptIn}
                onChange={onToggleStorageOptIn}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
              />
              <span className="flex items-center gap-1.5">
                <HardDrive className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                Store Templates & Kits in Local Storage (Opt-in)
              </span>
            </label>
          </div>
        </div>

        {/* Bottom Credits & Engine Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-5 text-[11px] text-slate-400 dark:text-slate-500">
          <div>
            <span className="font-semibold text-slate-600 dark:text-slate-400">FairHire Interview Assistant</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Version 3.5 Redesign</span>
            {systemMode && (
              <>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>Proxy Engine: {systemMode}</span>
              </>
            )}
          </div>
          <div>
            <span>Engineered for structured, equitable interview panels and audit gates</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
