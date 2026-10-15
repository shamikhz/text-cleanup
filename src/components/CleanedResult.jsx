import React, { useRef, useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  ArrowLeftRight, 
  RotateCcw, 
  FileCheck2,
  CheckCircle2
} from 'lucide-react';

export default function CleanedResult({ 
  value, 
  originalValue,
  operationsApplied = [], 
  findReplaceMatches = 0,
  onCopySuccess,
  onRestoreOriginal,
  onSwapOriginalAndCleaned,
  onNotify,
  stats
}) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  // Copy with Clipboard API + textarea fallback
  const handleCopy = async () => {
    if (!value) return;

    let success = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
        success = true;
      }
    } catch (err) {
      console.warn('Clipboard writeText failed, attempting execCommand fallback:', err);
    }

    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (e) {
        success = false;
      }
    }

    if (success) {
      setCopied(true);
      if (onNotify) onNotify('Cleaned text copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } else {
      if (onNotify) onNotify('Unable to copy text automatically. Please select and copy manually.', 'error');
    }
  };

  // Download as UTF-8 .txt file
  const handleDownload = () => {
    if (!value) return;

    try {
      // Prepend UTF-8 BOM (\uFEFF) for universal compatibility with text editors
      const blob = new Blob(['\uFEFF' + value], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `cleaned-text-${timestamp}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (onNotify) onNotify('Text file downloaded successfully', 'success');
    } catch (err) {
      if (onNotify) onNotify('Failed to initiate download', 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden flex flex-col transition-all">
      {/* Panel Header */}
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          <span>Cleaned Result</span>
          <span className="text-slate-400 font-normal">|</span>
          <span className="text-slate-500 font-normal">
            {stats.characters.toLocaleString()} chars • {stats.words.toLocaleString()} words
          </span>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            className={`inline-flex items-center gap-1 px-3 py-1 font-medium rounded-md transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
            title="Copy cleaned result (Ctrl+Shift+C)"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!value}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Download as .txt file"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download</span>
          </button>

          <button
            type="button"
            onClick={onSwapOriginalAndCleaned}
            disabled={!value}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Swap cleaned result back into original input"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Swap</span>
          </button>

          <button
            type="button"
            onClick={onRestoreOriginal}
            disabled={!originalValue}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Restore original text into result"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Applied Operations Badges */}
      {operationsApplied.length > 0 && (
        <div className="px-4 py-2 bg-emerald-50/60 border-b border-emerald-100/80 flex items-center gap-2 overflow-x-auto text-[11px] text-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-semibold shrink-0">Applied:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {operationsApplied.map((op, idx) => (
              <span 
                key={idx}
                className="px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200/50"
              >
                {op}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Textarea */}
      <div className="relative flex-1 min-h-[260px] sm:min-h-[320px]">
        <textarea
          ref={textareaRef}
          value={value}
          readOnly
          placeholder="Cleaned output will appear here after clicking 'Clean Text'..."
          className="w-full h-full p-4 sm:p-5 text-sm sm:text-base font-mono text-slate-800 placeholder-slate-400 bg-slate-50/30 resize-y min-h-[260px] sm:min-h-[320px] focus:outline-none focus:ring-0 border-0 leading-relaxed"
          spellCheck="false"
          aria-label="Cleaned text result"
        />

        {/* Empty state overlay */}
        {!value && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <FileCheck2 className="w-10 h-10 text-slate-300 mb-2 stroke-[1.5]" />
            <p className="text-sm font-medium text-slate-500">No cleaned text yet</p>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Select your desired cleanup operations or click <span className="font-semibold text-blue-600">Clean Text</span> to generate results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
