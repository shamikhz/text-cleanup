import React, { useRef, useState } from 'react';
import { 
  Clipboard, 
  Trash2, 
  FileText, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

const SAMPLE_TEXT = `   TEXT CLEANUP STUDIO SAMPLE DEMO   🚀🎉

This is an example of messy,   unformatted   text that you might copy from a PDF or a webpage!
Notice the    awkward horizontal spaces     and repeated blank lines below:



• Item 1: Apples 🍎
• Item 2: Bananas 🍌
• Item 1: Apples 🍎   (this is a duplicate line)
• Item 3: Oranges 🍊
• Item 2: Bananas 🍌   (another duplicate line)



Here is a paragraph with   multiple irregular spaces   and inconsistent capitalisation.
ANOTHER SENTENCE IN ALL CAPS THAT SHOULD BE SENTENCE CASE.
another sentence in all lowercase.

Windows carriage returns \r\n and tabs \t can also mess up formatting.
Use the quick presets or customize your own pipeline to clean this up instantly!`;

export default function TextEditor({ 
  value, 
  onChange, 
  onPasteSuccess, 
  stats,
  onNotify
}) {
  const textareaRef = useRef(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Paste from clipboard
  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          onChange(text);
          if (onNotify) onNotify('Text pasted from clipboard', 'success');
        } else {
          if (onNotify) onNotify('Clipboard is empty', 'info');
        }
      } else {
        // Fallback: focus textarea for standard Ctrl+V
        textareaRef.current?.focus();
        if (onNotify) onNotify('Press Ctrl+V / ⌘+V to paste', 'info');
      }
    } catch (err) {
      textareaRef.current?.focus();
      if (onNotify) onNotify('Clipboard access blocked. Please press Ctrl+V to paste.', 'warning');
    }
  };

  // Select all text
  const handleSelectAll = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      if (onNotify) onNotify('All text selected', 'info');
    }
  };

  // Load sample text
  const handleLoadSample = () => {
    onChange(SAMPLE_TEXT);
    if (onNotify) onNotify('Sample text loaded', 'success');
  };

  // Clear text
  const handleClear = () => {
    if (!value) return;
    if (value.length > 50) {
      setShowClearConfirm(true);
    } else {
      onChange('');
      if (onNotify) onNotify('Text cleared', 'info');
    }
  };

  const confirmClear = () => {
    onChange('');
    setShowClearConfirm(false);
    if (onNotify) onNotify('Text cleared', 'info');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden flex flex-col transition-all">
      {/* Editor Header Bar */}
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Original Text</span>
          <span className="text-slate-400 font-normal">|</span>
          <span className="text-slate-500 font-normal">
            {stats.characters.toLocaleString()} chars • {stats.words.toLocaleString()} words • {stats.lines.toLocaleString()} lines
          </span>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5 text-slate-500" />
            <span>Paste</span>
          </button>

          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/70 rounded-md transition-colors"
            title="Load demo sample text"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Sample Text</span>
          </button>

          <button
            type="button"
            onClick={handleSelectAll}
            disabled={!value}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Select all text"
          >
            <span>Select All</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={!value}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Clear all text"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Clear Confirmation Prompt */}
      {showClearConfirm && (
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Are you sure you want to clear {value.length.toLocaleString()} characters of text?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={confirmClear}
              className="px-2 py-0.5 bg-rose-600 text-white rounded font-medium hover:bg-rose-700 transition-colors"
            >
              Yes, Clear
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-2 py-0.5 bg-white border border-amber-300 rounded font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Textarea */}
      <div className="relative flex-1 min-h-[260px] sm:min-h-[320px]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste or type your messy text here to begin cleaning, formatting, or removing duplicates..."
          className="w-full h-full p-4 sm:p-5 text-sm sm:text-base font-mono text-slate-800 placeholder-slate-400 bg-transparent resize-y min-h-[260px] sm:min-h-[320px] focus:outline-none focus:ring-0 border-0 leading-relaxed"
          spellCheck="false"
          aria-label="Original text input"
        />

        {/* Empty state prompt overlay */}
        {!value && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <FileText className="w-10 h-10 text-slate-300 mb-2 stroke-[1.5]" />
            <p className="text-sm font-medium text-slate-500">Your original text will appear here</p>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Click <span className="font-semibold text-blue-600">Sample Text</span> above or paste your content from the clipboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
