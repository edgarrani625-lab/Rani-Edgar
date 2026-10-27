import React from 'react';
import { ShieldCheck, Moon, Sun, Scale, Sparkles } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  systemMode?: string;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  systemMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 transition-colors no-print">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl hero-gradient text-white shadow-md shadow-indigo-500/20">
            <Scale className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                FairHire
              </span>
              <span className="text-xs font-bold hero-gradient-text">
                Assistant
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Structured Interview Kits & Bias Audit Gate
            </p>
          </div>
        </div>

        {/* Center Zone: Decision Support Badge */}
        <div className="hidden md:flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-full px-3.5 py-1.5 bg-slate-50/80 dark:bg-slate-850/80 shadow-2xs">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Decision support, not legal advice
          </span>
          <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            EEOC & NYC Local Law 144 Aligned
          </span>
        </div>

        {/* Right Zone: System status & Dark/Light mode toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          {systemMode && (
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse"></span>
              <span className="truncate max-w-[170px]">{systemMode}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors shadow-2xs"
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
