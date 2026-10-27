import React, { useState } from 'react';
import {
  Server,
  Layout,
  BarChart2,
  Briefcase,
  Headphones,
  Compass,
  HeartHandshake,
  Activity,
  AlertOctagon,
  Plus,
  Trash2,
  Edit2,
  Check,
  Bookmark,
  Sparkles,
  Layers,
  Clock,
  Cpu,
  UserCheck,
  Users,
} from 'lucide-react';
import { JobTemplate, PRESET_JOB_TEMPLATES, InterviewStyleOption, INTERVIEW_STYLES } from '../data/jobTemplates';
import { SeniorityLevel } from '../types/fairhire';

interface TemplateGalleryProps {
  onSelectTemplate: (template: JobTemplate) => void;
  selectedTemplateId: string | null;
  customTemplates: JobTemplate[];
  onSaveCustomTemplate: (template: JobTemplate) => void;
  onDeleteCustomTemplate: (id: string) => void;
  currentJd: string;
  currentTitle: string;
  currentSeniority: SeniorityLevel;
  selectedStyleId: string;
  onSelectStyle: (style: InterviewStyleOption) => void;
  storageOptIn: boolean;
  onOpenStorageOptInNotice?: () => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplate,
  selectedTemplateId,
  customTemplates,
  onSaveCustomTemplate,
  onDeleteCustomTemplate,
  currentJd,
  currentTitle,
  currentSeniority,
  selectedStyleId,
  onSelectStyle,
  storageOptIn,
}) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTitle, setSaveTitle] = useState(currentTitle || '');
  const [saveSeniority, setSaveSeniority] = useState<SeniorityLevel>(currentSeniority || 'Senior');
  const [saveCategory, setSaveCategory] = useState('Custom');
  const [saveTagline, setSaveTagline] = useState('');
  const [saveError, setSaveError] = useState('');

  const renderIcon = (name: string, className = 'h-5 w-5') => {
    switch (name) {
      case 'Server': return <Server className={className} />;
      case 'Layout': return <Layout className={className} />;
      case 'BarChart2': return <BarChart2 className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'Headphones': return <Headphones className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'HeartHandshake': return <HeartHandshake className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'AlertOctagon': return <AlertOctagon className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Clock': return <Clock className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'UserCheck': return <UserCheck className={className} />;
      case 'Users': return <Users className={className} />;
      default: return <Bookmark className={className} />;
    }
  };

  const getAccentBorderClass = (color: string) => {
    switch (color) {
      case 'indigo': return 'border-t-indigo-600';
      case 'violet': return 'border-t-purple-600';
      case 'teal': return 'border-t-teal-500';
      case 'orange': return 'border-t-amber-500';
      case 'sky': return 'border-t-sky-500';
      case 'pink': return 'border-t-pink-500';
      case 'emerald': return 'border-t-emerald-500';
      case 'rose': return 'border-t-rose-500';
      case 'red': return 'border-t-red-600';
      default: return 'border-t-indigo-600';
    }
  };

  const getAccentIconBg = (color: string) => {
    switch (color) {
      case 'indigo': return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400';
      case 'violet': return 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400';
      case 'teal': return 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400';
      case 'orange': return 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400';
      case 'sky': return 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400';
      case 'pink': return 'bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400';
      case 'emerald': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400';
      case 'rose': return 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400';
      case 'red': return 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400';
      default: return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400';
    }
  };

  const handleOpenSaveModal = () => {
    if (!currentJd.trim()) {
      alert('Please enter or paste a job description first before saving as a template.');
      return;
    }
    setSaveTitle(currentTitle || 'Custom Role Template');
    setSaveSeniority(currentSeniority || 'Senior');
    setSaveTagline(currentJd.slice(0, 80).replace(/\n/g, ' ') + '...');
    setSaveError('');
    setShowSaveModal(true);
  };

  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveTitle.trim()) {
      setSaveError('Please provide a title for your template.');
      return;
    }
    const newTemplate: JobTemplate = {
      id: `custom-tmpl-${Date.now()}`,
      title: saveTitle.trim(),
      seniority: saveSeniority,
      roleCategory: saveCategory.trim() || 'Custom',
      accentColor: 'indigo',
      iconName: 'Bookmark',
      tagline: saveTagline.trim() || 'Custom saved team job description.',
      content: currentJd,
      isCustom: true,
    };
    onSaveCustomTemplate(newTemplate);
    setShowSaveModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Template Gallery Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 text-xs font-bold">
              ★
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              Start from a Job Template
            </h3>
            <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
              Click to autofill
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select a calibrated baseline role or run our deliberately biased test case to preview the audit system.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenSaveModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Save Current JD as Template</span>
        </button>
      </div>

      {/* 2. Responsive Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {PRESET_JOB_TEMPLATES.map(tmpl => {
          const isSelected = selectedTemplateId === tmpl.id;
          const isBiased = Boolean(tmpl.isSpecial);

          return (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl)}
              tabIndex={0}
              role="button"
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTemplate(tmpl);
                }
              }}
              className={`group relative flex flex-col justify-between rounded-2xl p-4 text-left border-2 cursor-pointer transition-all card-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isBiased
                  ? isSelected
                    ? 'border-red-600 bg-red-50/70 dark:bg-red-950/30 shadow-md ring-2 ring-red-500'
                    : 'border-red-500/80 hover:border-red-600 bg-white dark:bg-slate-900 dark:border-red-800/80'
                  : isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-md ring-1 ring-indigo-500'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
              } border-t-4 ${getAccentBorderClass(tmpl.accentColor)}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${getAccentIconBg(tmpl.accentColor)}`}>
                    {renderIcon(tmpl.iconName, 'h-4 w-4')}
                  </div>

                  <div className="flex flex-col items-end">
                    {isBiased ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                        <AlertOctagon className="h-3 w-3" />
                        Test the auditor
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {tmpl.seniority}
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="font-heading font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tmpl.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {tmpl.tagline}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2 text-[11px]">
                <span className="text-slate-400 dark:text-slate-500 font-medium">
                  {tmpl.roleCategory}
                </span>
                {isSelected ? (
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Active
                  </span>
                ) : (
                  <span className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                    Apply →
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Custom Templates Row (if any exist) */}
      {customTemplates.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-3">
            <Bookmark className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-heading">
              My Saved Templates ({customTemplates.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {customTemplates.map(tmpl => {
              const isSelected = selectedTemplateId === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => onSelectTemplate(tmpl)}
                  tabIndex={0}
                  role="button"
                  className={`group relative flex flex-col justify-between rounded-2xl p-4 text-left border-2 cursor-pointer transition-all card-lift border-t-4 border-t-indigo-600 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                        <Bookmark className="h-4 w-4" />
                      </div>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          if (confirm(`Delete custom template "${tmpl.title}"?`)) {
                            onDeleteCustomTemplate(tmpl.id);
                          }
                        }}
                        title="Delete custom template"
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <h4 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                      {tmpl.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {tmpl.tagline}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2 text-[11px]">
                    <span className="text-slate-400">{tmpl.seniority}</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {isSelected ? 'Applied' : 'Use Template →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Interview Style Selector (Radio Cards) */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 font-heading">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            Interview Style & Calibration Archetype
          </label>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Influences question weighting and rubric focus
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {INTERVIEW_STYLES.map(style => {
            const isSelected = selectedStyleId === style.id;
            return (
              <div
                key={style.id}
                onClick={() => onSelectStyle(style)}
                tabIndex={0}
                role="radio"
                aria-checked={isSelected}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStyle(style);
                  }
                }}
                className={`relative flex flex-col justify-between rounded-xl p-3 border cursor-pointer transition-all card-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 dark:border-indigo-500 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {renderIcon(style.iconName, 'h-3.5 w-3.5')}
                    </div>
                    <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400">
                      {style.duration}
                    </span>
                  </div>

                  <p className="font-heading font-bold text-xs text-slate-900 dark:text-white leading-tight">
                    {style.title}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-snug">
                    {style.description}
                  </p>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="font-mono text-slate-400">{style.questionCount} Qs</span>
                  {isSelected && (
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                      <Check className="h-3 w-3" /> Selected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Custom Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Save as My Template
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Store this current job specification in your browser's local library for quick access.
            </p>

            <form onSubmit={handleConfirmSave} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Template Title *
                </label>
                <input
                  type="text"
                  value={saveTitle}
                  onChange={e => setSaveTitle(e.target.value)}
                  placeholder="e.g. Senior Staff Infrastructure Engineer"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Seniority Level
                  </label>
                  <select
                    value={saveSeniority}
                    onChange={e => setSaveSeniority(e.target.value as SeniorityLevel)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Entry-Level">Entry-Level</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Staff / Principal">Staff / Principal</option>
                    <option value="Executive / Director">Executive / Director</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={saveCategory}
                    onChange={e => setSaveCategory(e.target.value)}
                    placeholder="e.g. Platform"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={saveTagline}
                  onChange={e => setSaveTagline(e.target.value)}
                  placeholder="One-line summary..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {saveError && (
                <p className="text-xs text-rose-600">{saveError}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
