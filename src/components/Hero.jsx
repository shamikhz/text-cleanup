import React from 'react';
import { Sparkles, Lock, Zap, FileCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-6 pb-4 sm:pt-10 sm:pb-6 text-center max-w-4xl mx-auto px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-medium mb-3">
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        <span>Fast, Local & Privacy-First Text Formatter</span>
      </div>
      
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
        Clean, Format & Normalize Text <span className="text-blue-600">Instantly</span>
      </h1>
      
      <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
        Paste unformatted or messy text to strip extra spaces, remove duplicate lines, convert cases, eliminate unwanted emojis, and compare changes with zero server uploads.
      </p>

      {/* Feature Pills */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600" /> No server uploads
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" /> Instant local execution
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-blue-600" /> Visual diff comparison
        </span>
      </div>
    </section>
  );
}
