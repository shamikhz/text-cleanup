import React, { useState, useMemo } from 'react';
import { 
  GitCompare, 
  Split, 
  Layers, 
  Plus, 
  Minus,
  CheckCircle,
  Eye
} from 'lucide-react';
import { computeDiff } from '../utils/diff';

export default function ComparisonView({ original, cleaned }) {
  const [diffMode, setDiffMode] = useState('words'); // 'words' | 'lines'
  const [mobileTab, setMobileTab] = useState('diff'); // 'original' | 'cleaned' | 'diff'

  // Memoized diff computation to avoid heavy re-renders
  const diffParts = useMemo(() => {
    if (!original && !cleaned) return [];
    return computeDiff(original || '', cleaned || '', diffMode);
  }, [original, cleaned, diffMode]);

  const diffCounts = useMemo(() => {
    let addedCount = 0;
    let removedCount = 0;
    for (const part of diffParts) {
      if (part.added) addedCount++;
      if (part.removed) removedCount++;
    }
    return { addedCount, removedCount };
  }, [diffParts]);

  if (!original && !cleaned) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-xs sm:text-sm text-slate-800">
            Original vs Cleaned Comparison
          </span>
          <div className="flex items-center gap-2 ml-2 text-xs">
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/60 text-[11px]">
              <Plus className="w-3 h-3 text-emerald-600" /> {diffCounts.addedCount} additions
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium border border-rose-200/60 text-[11px]">
              <Minus className="w-3 h-3 text-rose-600" /> {diffCounts.removedCount} removals
            </span>
          </div>
        </div>

        {/* Diff Granularity Switcher */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setDiffMode('words')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              diffMode === 'words'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Word Diff
          </button>
          <button
            type="button"
            onClick={() => setDiffMode('lines')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              diffMode === 'lines'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Line Diff
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="sm:hidden px-4 py-2 border-b border-slate-200 bg-slate-100/60 flex items-center justify-around text-xs font-medium">
        <button
          onClick={() => setMobileTab('diff')}
          className={`py-1 px-3 rounded-lg ${mobileTab === 'diff' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
        >
          Visual Diff
        </button>
        <button
          onClick={() => setMobileTab('original')}
          className={`py-1 px-3 rounded-lg ${mobileTab === 'original' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
        >
          Original
        </button>
        <button
          onClick={() => setMobileTab('cleaned')}
          className={`py-1 px-3 rounded-lg ${mobileTab === 'cleaned' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
        >
          Cleaned
        </button>
      </div>

      {/* Diff Content View */}
      <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto max-h-[420px] bg-slate-50/20">
        {/* On Mobile, respect mobile tab */}
        {mobileTab === 'original' && (
          <div className="sm:hidden whitespace-pre-wrap text-slate-800">
            {original || <span className="text-slate-400 italic">No original text</span>}
          </div>
        )}
        {mobileTab === 'cleaned' && (
          <div className="sm:hidden whitespace-pre-wrap text-slate-800">
            {cleaned || <span className="text-slate-400 italic">No cleaned text</span>}
          </div>
        )}
        <div className={`${mobileTab === 'diff' ? 'block' : 'hidden'} sm:block whitespace-pre-wrap`}>
          {diffParts.length === 0 ? (
            <span className="text-slate-400 italic">No differences detected.</span>
          ) : (
              diffParts.map((part, index) => {
                if (part.added) {
                  return (
                    <span
                      key={index}
                      className="bg-emerald-100 text-emerald-950 px-0.5 rounded font-medium border-b-2 border-emerald-500"
                      title="Added in cleaned version"
                    >
                      {part.value}
                    </span>
                  );
                }
                if (part.removed) {
                  return (
                    <span
                      key={index}
                      className="bg-rose-100 text-rose-950 px-0.5 rounded line-through opacity-75 border-b-2 border-rose-400"
                      title="Removed in cleaned version"
                    >
                      {part.value}
                    </span>
                  );
                }
                return (
                  <span key={index} className="text-slate-700">
                    {part.value}
                  </span>
                );
              })
            )}
          </div>
      </div>

      {/* Comparison Legend */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-300 inline-block" /> Added
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-300 inline-block" /> Removed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 inline-block" /> Unchanged
          </span>
        </div>
        <span className="hidden md:inline">Differences calculated safely in-browser</span>
      </div>
    </div>
  );
}
