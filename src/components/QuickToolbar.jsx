import React from 'react';
import { 
  Sparkles, 
  CopyCheck, 
  AlignLeft, 
  Smile, 
  Trash2,
  Sliders,
  Play
} from 'lucide-react';

export default function QuickToolbar({ 
  presets, 
  activePresetId, 
  onSelectPreset, 
  onExecuteClean, 
  isProcessing,
  hasText,
  isMac
}) {
  const getPresetIcon = (id) => {
    switch (id) {
      case 'quick-clean':
        return <Sparkles className="w-3.5 h-3.5 text-blue-600" />;
      case 'remove-duplicates':
        return <CopyCheck className="w-3.5 h-3.5 text-indigo-600" />;
      case 'clean-blank-lines':
        return <AlignLeft className="w-3.5 h-3.5 text-teal-600" />;
      case 'content-formatting':
        return <Sliders className="w-3.5 h-3.5 text-purple-600" />;
      case 'remove-emojis':
        return <Smile className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-3 sm:p-4 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Preset Pills */}
        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Presets:
          </span>
          {presets.slice(0, 5).map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700'
                    : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/80 border border-transparent'
                }`}
                title={preset.description}
              >
                {!isActive && getPresetIcon(preset.id)}
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Primary Clean Text CTA Button */}
        <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
          <button
            type="button"
            onClick={onExecuteClean}
            disabled={!hasText || isProcessing}
            className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              hasText && !isProcessing
                ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-blue-500/20 hover:shadow-blue-500/30'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title={`Clean Text (${isMac ? '⌘+Enter' : 'Ctrl+Enter'})`}
            aria-label="Clean Text"
          >
            <Play className={`w-4 h-4 fill-current ${isProcessing ? 'animate-spin' : ''}`} />
            <span>Clean Text</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/20 text-white/90">
              {isMac ? '⌘⏎' : 'Ctrl+↵'}
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
