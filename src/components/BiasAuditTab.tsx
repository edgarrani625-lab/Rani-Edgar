import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  Users,
  BarChart3,
  Info,
  Scale,
  Sparkles,
} from 'lucide-react';
import { InterviewKit } from '../types/fairhire';

interface BiasAuditTabProps {
  kit: InterviewKit;
}

export const BiasAuditTab: React.FC<BiasAuditTabProps> = ({ kit }) => {
  const { auditStatus, auditSummary, flaggedItems, demographicImpacts, statisticalAudit } = kit;

  const getBorderLeftColor = (severity: string) => {
    switch (severity) {
      case 'alert': return 'border-l-4 border-l-[#DC2626]';
      case 'warning': return 'border-l-4 border-l-[#F59E0B]';
      default: return 'border-l-4 border-l-[#14B8A6]';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Large Status Banner with explicit icon & text */}
      <div
        className={`rounded-2xl border p-6 transition-all shadow-sm ${
          auditStatus === 'PASS'
            ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100'
            : auditStatus === 'PASS_WITH_CHANGES'
            ? 'border-amber-200 bg-amber-50/70 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100'
            : 'border-rose-200 bg-rose-50/70 text-rose-950 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {auditStatus === 'PASS' && (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#16A34A] text-white shadow-md">
                <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
              </div>
            )}
            {auditStatus === 'PASS_WITH_CHANGES' && (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F59E0B] text-white shadow-md">
                <AlertTriangle className="h-7 w-7" aria-hidden="true" />
              </div>
            )}
            {auditStatus === 'FAIL' && (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#DC2626] text-white shadow-md">
                <XCircle className="h-7 w-7" aria-hidden="true" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg font-bold tracking-tight font-heading">
                  {auditStatus === 'PASS' && 'AUDIT STATUS: PASS'}
                  {auditStatus === 'PASS_WITH_CHANGES' && 'AUDIT STATUS: PASS WITH CHANGES'}
                  {auditStatus === 'FAIL' && 'AUDIT STATUS: FAIL — ACTION REQUIRED'}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold border border-current opacity-85">
                  {flaggedItems.length} Flagged {flaggedItems.length === 1 ? 'Risk' : 'Risks'}
                </span>
              </div>
              <p className="mt-1 text-xs opacity-90 max-w-3xl leading-relaxed">
                {auditSummary}
              </p>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider opacity-75">
              EEOC & Uniform Guidelines Audit
            </span>
          </div>
        </div>
      </div>

      {/* 2. Flagged Items Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              Bias & Discrimination Audit Findings
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {flaggedItems.length} {flaggedItems.length === 1 ? 'risk issue' : 'risk issues'} evaluated
          </span>
        </div>

        {flaggedItems.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
            No exclusionary bias patterns detected in the provided job specification.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 dark:border-slate-800 dark:bg-slate-800/60 font-bold text-slate-700 dark:text-slate-200 font-heading">
                  <th className="py-3 px-3.5 w-28">Source / Ref</th>
                  <th className="py-3 px-3.5 w-44">Issue Type</th>
                  <th className="py-3 px-3.5 w-48">Groups Affected</th>
                  <th className="py-3 px-3.5 w-24 text-center">Risk Level</th>
                  <th className="py-3 px-3.5">Remediation / Fix Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {flaggedItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-medium text-slate-800 dark:text-slate-200">
                      {item.questionNum}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-slate-900 dark:text-white">
                      {item.issueType}
                    </td>
                    <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400">
                      {item.groupsAffected}
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.risk === 'High'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                            : item.risk === 'Medium'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {item.risk}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.fixApplied}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Cards for Demographic-Group Impact Notes with colored left borders */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
            Demographic Impact Analysis & Mitigations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demographicImpacts.map(card => (
            <div
              key={card.id}
              className={`rounded-2xl border bg-white p-5 text-xs shadow-2xs dark:bg-slate-900 dark:border-slate-800 card-lift ${getBorderLeftColor(
                card.severity
              )}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 dark:text-white text-xs font-heading">
                  {card.group}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    card.severity === 'alert'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : card.severity === 'warning'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                  }`}
                >
                  {card.title}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                <strong className="text-slate-800 dark:text-slate-200">Potential Disparate Impact: </strong>
                {card.potentialImpact}
              </p>
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <strong className="text-indigo-600 dark:text-indigo-400">Enforced Mitigation: </strong>
                {card.mitigation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Statistical Audit (Four-Fifths Rule) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              Statistical Adverse Impact Audit (EEOC 80% / 4/5ths Rule)
            </h3>
          </div>
          {statisticalAudit.hasData && (
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold ${
                statisticalAudit.adverseImpactDetected
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
              }`}
            >
              {statisticalAudit.adverseImpactDetected ? 'Adverse Impact Detected' : 'Compliance Threshold Met'}
            </span>
          )}
        </div>

        {!statisticalAudit.hasData ? (
          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
            <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 font-heading">
                Qualitative review only, not a statistical validation.
              </p>
              <p className="mt-1 leading-relaxed">
                No past candidate selection data was provided. To conduct an empirical disparate impact test under EEOC Uniform Guidelines (29 C.F.R. § 1607.4D), upload historical interview counts by demographic group in Step 1.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {statisticalAudit.message}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 dark:border-slate-800 dark:bg-slate-800/60 font-bold text-slate-700 dark:text-slate-300 font-heading">
                    <th className="py-2.5 px-3">Demographic Group</th>
                    <th className="py-2.5 px-3 text-right">Interviewed</th>
                    <th className="py-2.5 px-3 text-right">Selected / Advanced</th>
                    <th className="py-2.5 px-3 text-right">Selection Rate</th>
                    <th className="py-2.5 px-3 text-right">Adverse Impact Ratio (AIR)</th>
                    <th className="py-2.5 px-3 text-center">4/5ths Rule Violation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {statisticalAudit.groups?.map(group => {
                    const isBenchmark = group.groupName === statisticalAudit.benchmarkGroup;
                    return (
                      <tr
                        key={group.groupName}
                        className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 ${
                          group.isAdverseImpact ? 'bg-rose-50/30 dark:bg-rose-950/15' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1.5">
                            <span>{group.groupName}</span>
                            {isBenchmark && (
                              <span className="text-[10px] text-indigo-700 bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.2 rounded-full font-bold">
                                Benchmark
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                          {group.interviewed}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                          {group.selected}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                          {(group.selectionRate * 100).toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                          {isBenchmark ? (
                            <span className="text-slate-400 font-medium">100.0% (Ref)</span>
                          ) : (
                            <span
                              className={`font-bold ${
                                group.isAdverseImpact
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : 'text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              {(group.adverseImpactRatio * 100).toFixed(1)}%
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {group.isAdverseImpact ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626] bg-rose-100 dark:bg-rose-950/80 px-2.5 py-0.5 rounded-full">
                              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                              VIOLATION (&lt; 80%)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                              Compliant
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
              <Scale className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span>
                Under EEOC guidelines, a selection rate for any group that is less than four-fifths (80%) of the rate for the benchmark group is regarded as evidence of adverse impact.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
