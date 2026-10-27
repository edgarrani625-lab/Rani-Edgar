import React, { useState } from 'react';
import { X, Copy, Check, FileDown } from 'lucide-react';
import { downloadMarkdownFile } from '../utils/exportUtils';

interface MarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdownContent: string;
  jobTitle: string;
}

export const MarkdownModal: React.FC<MarkdownModalProps> = ({
  isOpen,
  onClose,
  markdownContent,
  jobTitle,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadMarkdownFile(
      markdownContent,
      `FairHire_Kit_${jobTitle.replace(/[^a-zA-Z0-9]/g, '_')}.md`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Raw Markdown & Clean Renderer View
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Parsed from inference payload with structured tables and anchored BARS rubrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <FileDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>Download .md</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50/70 dark:bg-slate-950/60 selection:bg-blue-100 dark:selection:bg-blue-900">
          <pre className="whitespace-pre-wrap">{markdownContent}</pre>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-3 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
