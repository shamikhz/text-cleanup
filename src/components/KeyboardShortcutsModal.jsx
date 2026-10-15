import React from 'react';
import { Keyboard, X } from 'lucide-react';

export default function KeyboardShortcutsModal({ isOpen, onClose, isMac }) {
  if (!isOpen) return null;

  const metaKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    {
      keys: [metaKey, 'Enter'],
      action: 'Clean Text',
      desc: 'Executes the active cleanup pipeline and generates cleaned results.',
    },
    {
      keys: [metaKey, 'F'],
      action: 'Find & Replace',
      desc: 'Opens the inline Find & Replace bar inside the text editor.',
    },
    {
      keys: [metaKey, 'Shift', 'C'],
      action: 'Copy Cleaned Result',
      desc: 'Copies the cleaned text directly to your system clipboard.',
    },
    {
      keys: [metaKey, 'Shift', 'X'],
      action: 'Clear Input',
      desc: 'Prompts to clear the original input text.',
    },
    {
      keys: [metaKey, 'Z'],
      action: 'Undo Text Edit',
      desc: 'Reverts the most recent input change inside the text editor.',
    },
    {
      keys: ['Esc'],
      action: 'Close Modal',
      desc: 'Dismisses active dialogs, overlays, and drawer panels.',
    },
    {
      keys: ['?'],
      action: 'Show Shortcuts',
      desc: 'Opens this keyboard shortcuts overview dialog.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated w-full max-w-lg p-5 sm:p-6 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="mt-4 divide-y divide-slate-100 text-xs">
          {shortcuts.map((sc, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-800 block">{sc.action}</span>
                <span className="text-slate-500 text-[11px] mt-0.5 block">{sc.desc}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {sc.keys.map((k, kidx) => (
                  <kbd
                    key={kidx}
                    className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-semibold shadow-xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
          <span>Platform: {isMac ? 'Apple macOS' : 'Windows / Linux'}</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
