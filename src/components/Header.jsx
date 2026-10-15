import React from 'react';
import { 
  History, 
  Keyboard, 
  ShieldCheck, 
  DownloadCloud
} from 'lucide-react';
import Logo from './Logo';

export default function Header({ 
  onOpenHistory, 
  onOpenShortcuts, 
  isHistoryEnabled, 
  canInstallPwa, 
  onInstallPwa,
  isInstalled 
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <Logo size={40} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">Text Cleanup Studio</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                100% Client-Side
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">Private in-browser text cleaning & formatting</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* PWA Install Button */}
          {canInstallPwa && !isInstalled && (
            <button
              onClick={onInstallPwa}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
              title="Install Text Cleanup Studio as an App"
              aria-label="Install App"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* Local History Toggle */}
          <button
            onClick={onOpenHistory}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              isHistoryEnabled
                ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Open local history"
            aria-label="Open local history"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">History</span>
            {isHistoryEnabled && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" title="History is active" />
            )}
          </button>

          {/* Keyboard Shortcuts Button */}
          <button
            onClick={onOpenShortcuts}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
            title="View keyboard shortcuts (or press ?)"
            aria-label="Keyboard Shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Shortcuts</span>
            <kbd className="hidden lg:inline-block px-1 py-0.2 bg-slate-100 text-slate-500 rounded text-[10px] font-mono border border-slate-200">?</kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
