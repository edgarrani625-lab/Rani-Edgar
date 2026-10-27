import React from 'react';
import { Layers, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl hero-gradient p-8 sm:p-10 text-white shadow-xl mb-8 no-print">
      {/* Subtle background ornamentation */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4">
        {/* Top small kicker */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/20 text-white shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-teal-200" aria-hidden="true" />
          <span>Industrial-Organizational DE&I Audit Engine</span>
        </div>

        {/* Bold Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading leading-tight text-white">
          Fair interviews, built from the job description
        </h1>

        {/* One-line subtext */}
        <p className="text-sm sm:text-base text-indigo-100 font-normal leading-relaxed max-w-2xl">
          Generate objective, structured interview kits and calibrate scoring rubrics while an automated bias audit shields your hiring panels.
        </p>

        {/* 3 small feature chips */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium backdrop-blur-md border border-white/15 text-white">
            <Layers className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" />
            <span>Structured questions</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium backdrop-blur-md border border-white/15 text-white">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
            <span>Bias audit built in</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium backdrop-blur-md border border-white/15 text-white">
            <UserCheck className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
            <span>Human approval required</span>
          </div>
        </div>
      </div>
    </div>
  );
};
