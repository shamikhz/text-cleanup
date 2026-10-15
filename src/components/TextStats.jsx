import React from 'react';
import { 
  BarChart2, 
  FileText, 
  Hash, 
  Clock, 
  Pilcrow, 
  AlignLeft,
  TrendingDown,
  TrendingUp,
  Minus
} from 'lucide-react';

export default function TextStats({ originalStats, cleanedStats, hasCleaned }) {
  const getChangeBadge = (originalVal, cleanedVal) => {
    if (!hasCleaned || originalVal === 0) return null;
    const diff = cleanedVal - originalVal;
    if (diff === 0) {
      return (
        <span className="inline-flex items-center text-[10px] text-slate-500 font-medium ml-1">
          <Minus className="w-2.5 h-2.5" /> 0
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="inline-flex items-center text-[10px] text-emerald-600 font-semibold ml-1">
          <TrendingDown className="w-2.5 h-2.5 mr-0.5" /> {diff}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[10px] text-blue-600 font-semibold ml-1">
        <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +{diff}
      </span>
    );
  };

  const statItems = [
    {
      label: 'Words',
      icon: <FileText className="w-4 h-4 text-blue-600" />,
      original: originalStats.words,
      cleaned: cleanedStats.words,
    },
    {
      label: 'Characters (Total)',
      icon: <Hash className="w-4 h-4 text-indigo-600" />,
      original: originalStats.characters,
      cleaned: cleanedStats.characters,
    },
    {
      label: 'Chars (No Whitespace)',
      icon: <Hash className="w-4 h-4 text-purple-600" />,
      original: originalStats.charactersNoSpaces,
      cleaned: cleanedStats.charactersNoSpaces,
    },
    {
      label: 'Lines',
      icon: <AlignLeft className="w-4 h-4 text-teal-600" />,
      original: originalStats.lines,
      cleaned: cleanedStats.lines,
    },
    {
      label: 'Paragraphs',
      icon: <Pilcrow className="w-4 h-4 text-amber-600" />,
      original: originalStats.paragraphs,
      cleaned: cleanedStats.paragraphs,
    },
    {
      label: 'Reading Time',
      icon: <Clock className="w-4 h-4 text-rose-600" />,
      original: originalStats.readingTime,
      cleaned: cleanedStats.readingTime,
      isTime: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-4 sm:p-5 transition-all">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-800">Text Statistics & Metrics</h2>
        </div>
        {hasCleaned && originalStats.characters > 0 && (
          <div className="text-xs text-slate-500 font-medium">
            Reduction:{' '}
            <span className="font-semibold text-emerald-600">
              {Math.max(0, Math.round(((originalStats.characters - cleanedStats.characters) / originalStats.characters) * 100))}%
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statItems.map((item, index) => (
          <div 
            key={index} 
            className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-medium truncate">{item.label}</span>
              {item.icon}
            </div>

            <div className="mt-1">
              <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-baseline">
                {hasCleaned ? (
                  <>
                    <span>{typeof item.cleaned === 'number' ? item.cleaned.toLocaleString() : item.cleaned}</span>
                    {!item.isTime && getChangeBadge(item.original, item.cleaned)}
                  </>
                ) : (
                  <span>{typeof item.original === 'number' ? item.original.toLocaleString() : item.original}</span>
                )}
              </div>

              {hasCleaned && !item.isTime && item.original !== item.cleaned && (
                <div className="text-[11px] text-slate-400 mt-0.5">
                  was {item.original.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
        <span>* Paragraphs are counted as distinct text blocks separated by one or more blank lines.</span>
        <span>* Reading time estimated at 200 words per minute.</span>
      </div>
    </div>
  );
}
