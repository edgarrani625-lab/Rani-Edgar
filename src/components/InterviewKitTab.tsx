import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Search,
  Award,
  HelpCircle,
  ListFilter,
  FileSearch,
} from 'lucide-react';
import { InterviewKit, QuestionItem } from '../types/fairhire';

interface InterviewKitTabProps {
  kit: InterviewKit;
  onCopyQuestion: (text: string) => void;
}

export const InterviewKitTab: React.FC<InterviewKitTabProps> = ({
  kit,
  onCopyQuestion,
}) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    kit.questions.forEach(q => set.add(q.category));
    return ['all', ...Array.from(set)];
  }, [kit.questions]);

  const filteredQuestions = useMemo(() => {
    return kit.questions.filter(q => {
      const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
      const qLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        q.question.toLowerCase().includes(qLower) ||
        q.competency.toLowerCase().includes(qLower) ||
        q.category.toLowerCase().includes(qLower);
      return matchesCategory && matchesSearch;
    });
  }, [kit.questions, selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    kit.questions.forEach(q => (all[q.id] = true));
    setExpandedIds(all);
  };

  const collapseAll = () => {
    setExpandedIds({});
  };

  const handleCopy = (q: QuestionItem) => {
    const fullText = `[Question: ${q.category}]\n"${q.question}"\n\nCompetency: ${q.competency}\n\nStrong Answer Indicators:\n${q.strongAnswerIndicators.map(i => `- ${i}`).join('\n')}\n\n5-Point Rubric:\n1: ${q.scoringRubric[1]}\n2: ${q.scoringRubric[2]}\n3: ${q.scoringRubric[3]}\n4: ${q.scoringRubric[4]}\n5: ${q.scoringRubric[5]}\n\nFollow-up Probes:\n${q.followUpProbes.map(p => `- ${p}`).join('\n')}`;
    onCopyQuestion(fullText);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryBadgeClass = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('behavioral') || lower.includes('collaboration') || lower.includes('empathy')) {
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900';
    }
    if (lower.includes('situational') || lower.includes('problem') || lower.includes('execution') || lower.includes('ambiguity')) {
      return 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-900';
    }
    if (lower.includes('technical') || lower.includes('architecture') || lower.includes('code') || lower.includes('system')) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-900';
    }
    if (lower.includes('role') || lower.includes('fit') || lower.includes('leadership') || lower.includes('growth')) {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-900';
    }
    return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';
  };

  return (
    <div className="space-y-4">
      {/* Category filter pills & Search & Bulk controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1 font-heading">
            <ListFilter className="h-3.5 w-3.5" aria-hidden="true" />
            Category:
          </span>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            );
          })}
        </div>

        {/* Search & Bulk expand */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search competencies or questions..."
              className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <button
            type="button"
            onClick={expandAll}
            className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1"
          >
            Expand All
          </button>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <button
            type="button"
            onClick={collapseAll}
            className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Zebra Rows Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-850 font-bold text-slate-700 dark:text-slate-200 font-heading">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-44">Category</th>
                <th className="py-3 px-4 min-w-[300px]">Structured Question</th>
                <th className="py-3 px-4 w-48">Core Competency</th>
                <th className="py-3 px-4 w-28 text-center">Audit Tag</th>
                <th className="py-3 px-4 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileSearch className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        No interview questions match your filter
                      </p>
                      <p className="text-xs text-slate-400">
                        Try clearing your search query or selecting "All Categories".
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((q, index) => {
                  const isExpanded = Boolean(expandedIds[q.id]);
                  const isEven = index % 2 === 1;

                  return (
                    <React.Fragment key={q.id}>
                      {/* Zebra Row Styling */}
                      <tr
                        className={`transition-colors ${
                          isEven
                            ? 'bg-slate-50/50 dark:bg-slate-850/30'
                            : 'bg-white dark:bg-slate-900'
                        } hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20`}
                      >
                        <td className="py-3 px-4 text-center font-mono font-medium text-slate-400 dark:text-slate-500">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${getCategoryBadgeClass(
                              q.category
                            )}`}
                          >
                            {q.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                          <p className="line-clamp-2 leading-relaxed">{q.question}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                          {q.competency}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                              q.status === 'Changed'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {q.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleCopy(q)}
                              title="Copy structured question and BARS rubric"
                              aria-label={`Copy question ${index + 1}`}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-300 dark:hover:bg-slate-800 transition-colors"
                            >
                              {copiedId === q.id ? (
                                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                              ) : (
                                <Copy className="h-4 w-4" aria-hidden="true" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleExpand(q.id)}
                              aria-expanded={isExpanded}
                              aria-label={`Expand question ${index + 1} details`}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-300 dark:hover:bg-slate-800 transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" aria-hidden="true" />
                              ) : (
                                <ChevronDown className="h-4 w-4" aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable In-Depth Row with smooth spacing */}
                      {isExpanded && (
                        <tr className="bg-slate-50/95 dark:bg-slate-850/70">
                          <td colSpan={6} className="py-5 px-6 border-t border-b border-slate-200 dark:border-slate-800">
                            <div className="space-y-4">
                              {/* Full Question Banner */}
                              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-heading">
                                    Structured Interview Question
                                  </span>
                                  {q.status === 'Changed' && (
                                    <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                                      Flagged from JD & rewritten for fairness
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                                  "{q.question}"
                                </p>
                                {q.status === 'Changed' && q.originalQuestion && (
                                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">Original flawed premise: </span>
                                    <span className="italic text-rose-700 dark:text-rose-300 font-medium">"{q.originalQuestion}"</span>
                                    <p className="mt-1 text-slate-600 dark:text-slate-300">
                                      <strong className="text-slate-800 dark:text-slate-200">Remediation:</strong> {q.changeRationale}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Strong Answer Indicators */}
                                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
                                  <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 dark:text-white font-heading">
                                    <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                    <span>Strong Answer Indicators (Look For)</span>
                                  </div>
                                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                                    {q.strongAnswerIndicators.map((ind, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-emerald-500 font-bold mt-0.5">•</span>
                                        <span>{ind}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Follow-up Probes */}
                                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
                                  <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 dark:text-white font-heading">
                                    <HelpCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                                    <span>Standard Follow-Up Probes</span>
                                  </div>
                                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                                    {q.followUpProbes.map((probe, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-teal-500 font-bold mt-0.5">•</span>
                                        <span className="italic">"{probe}"</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              {/* 5-Point Scoring Rubric (BARS) */}
                              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-3 font-heading">
                                  5-Point Behaviorally Anchored Rating Scale (BARS)
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
                                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 dark:bg-rose-950/20 dark:border-rose-900/40">
                                    <div className="font-bold text-rose-800 dark:text-rose-300 mb-1">
                                      1 - Unsatisfactory
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 leading-snug">
                                      {q.scoringRubric[1]}
                                    </p>
                                  </div>
                                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 dark:bg-amber-950/20 dark:border-amber-900/40">
                                    <div className="font-bold text-amber-800 dark:text-amber-300 mb-1">
                                      2 - Needs Imp.
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 leading-snug">
                                      {q.scoringRubric[2]}
                                    </p>
                                  </div>
                                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                    <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                                      3 - Meets Target
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 leading-snug">
                                      {q.scoringRubric[3]}
                                    </p>
                                  </div>
                                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/80 dark:bg-indigo-950/20 dark:border-indigo-900/40">
                                    <div className="font-bold text-indigo-800 dark:text-indigo-300 mb-1">
                                      4 - Exceeds
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 leading-snug">
                                      {q.scoringRubric[4]}
                                    </p>
                                  </div>
                                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 dark:bg-emerald-950/20 dark:border-emerald-900/40">
                                    <div className="font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                                      5 - Outstanding
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 leading-snug">
                                      {q.scoringRubric[5]}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
