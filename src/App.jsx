import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TextEditor from './components/TextEditor';
import QuickToolbar from './components/QuickToolbar';
import AdvancedSettings from './components/AdvancedSettings';
import PresetManager from './components/PresetManager';
import CleanedResult from './components/CleanedResult';
import ComparisonView from './components/ComparisonView';
import TextStats from './components/TextStats';
import HistoryDrawer from './components/HistoryDrawer';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import AdSlot from './components/AdSlot';
import InfoSections from './components/InfoSections';
import Footer from './components/Footer';

import { 
  DEFAULT_CONFIG, 
  DEFAULT_PRESETS, 
  processText 
} from './utils/textProcessors';
import { calculateTextStats } from './utils/textStats';
import { 
  getSavedPresets, 
  savePreset, 
  deletePreset, 
  resetPresetsToDefault,
  isHistoryEnabled,
  addHistoryEntry,
  setHistoryEnabled
} from './utils/storage';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function App() {
  // State
  const [originalText, setOriginalText] = useState('');
  const [cleanedText, setCleanedText] = useState('');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [presets, setPresets] = useState(DEFAULT_PRESETS);
  const [activePresetId, setActivePresetId] = useState('quick-clean');
  const [operationsApplied, setOperationsApplied] = useState([]);
  const [findReplaceMatches, setFindReplaceMatches] = useState(0);

  // Modals & Drawers
  const [historyOpen, setHistoryOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [historyActive, setHistoryActive] = useState(false);

  // Notifications / Toast
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Undo history for input text
  const [undoHistory, setUndoHistory] = useState([]);

  // PWA Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Platform detection
  const isMac = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent || '');
  }, []);

  // Show Toast
  const notify = useCallback((message, type = 'info') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type, id: Date.now() });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  }, []);

  // Initialize presets and history status from storage
  useEffect(() => {
    setPresets(getSavedPresets());
    setHistoryActive(isHistoryEnabled());

    // PWA beforeinstallprompt handler
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      notify('Text Cleanup Studio installed successfully!', 'success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [notify]);

  // Handle PWA Install trigger
  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  // Text changes with undo snapshot
  const handleOriginalTextChange = (newText) => {
    setUndoHistory(prev => [...prev.slice(-20), originalText]);
    setOriginalText(newText);
  };

  // Undo action
  const handleUndo = useCallback(() => {
    if (undoHistory.length === 0) {
      notify('Nothing to undo', 'info');
      return;
    }
    const previous = undoHistory[undoHistory.length - 1];
    setUndoHistory(prev => prev.slice(0, -1));
    setOriginalText(previous);
    notify('Undo applied', 'info');
  }, [undoHistory, notify]);

  // Clean Text Execution
  const executeClean = useCallback(() => {
    if (!originalText) {
      notify('Please enter or paste text to clean', 'warning');
      return;
    }

    const { cleanedText: result, operationsApplied: ops, findReplaceMatches: matches } = processText(originalText, config);
    setCleanedText(result);
    setOperationsApplied(ops);
    setFindReplaceMatches(matches || 0);

    // Save to local history if enabled
    if (isHistoryEnabled()) {
      const activePreset = presets.find(p => p.id === activePresetId);
      addHistoryEntry({
        originalText,
        cleanedText: result,
        presetName: activePreset ? activePreset.name : 'Custom Cleanup',
        operationsApplied: ops,
      });
    }

    notify(
      ops.length > 0 
        ? `Cleaned successfully (${ops.length} operation${ops.length > 1 ? 's' : ''} applied)`
        : 'Clean complete (no modifications needed)',
      'success'
    );
  }, [originalText, config, activePresetId, presets, notify]);

  // Select Preset
  const handleSelectPreset = (preset) => {
    setActivePresetId(preset.id);
    setConfig(prev => ({
      ...DEFAULT_CONFIG,
      ...preset.config,
      findAndReplace: prev.findAndReplace,
      findAndReplaceActive: prev.findAndReplaceActive,
    }));
    notify(`Applied preset: ${preset.name}`, 'info');
  };

  // Save Preset
  const handleSavePreset = (newPreset) => {
    const success = savePreset(newPreset);
    if (success) {
      setPresets(getSavedPresets());
      setActivePresetId(newPreset.id);
    }
    return success;
  };

  // Delete Preset
  const handleDeletePreset = (id) => {
    const success = deletePreset(id);
    if (success) {
      setPresets(getSavedPresets());
      if (activePresetId === id) {
        setActivePresetId('quick-clean');
        setConfig(DEFAULT_CONFIG);
      }
    }
    return success;
  };

  // Reset Presets
  const handleResetPresets = () => {
    resetPresetsToDefault();
    setPresets(DEFAULT_PRESETS);
    setActivePresetId('quick-clean');
    setConfig(DEFAULT_CONFIG);
    notify('Presets reset to factory defaults', 'info');
  };

  // Restore Original Text into Cleaned Output
  const handleRestoreOriginal = () => {
    setCleanedText(originalText);
    notify('Reset cleaned output to match original text', 'info');
  };

  // Swap Cleaned into Original
  const handleSwap = () => {
    if (!cleanedText) return;
    const temp = originalText;
    setOriginalText(cleanedText);
    setCleanedText(temp);
    notify('Swapped cleaned text into original editor', 'success');
  };

  // Restore entry from history drawer
  const handleRestoreHistoryEntry = (item) => {
    setOriginalText(item.originalText);
    setCleanedText(item.cleanedText);
    setOperationsApplied(item.operationsApplied || []);
    notify('Restored history entry into editor', 'success');
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isModifier = isMac ? e.metaKey : e.ctrlKey;

      // Escape to close modals
      if (e.key === 'Escape') {
        if (shortcutsOpen) setShortcutsOpen(false);
        if (historyOpen) setHistoryOpen(false);
        return;
      }

      // '?' key to open shortcuts (when not typing in textarea or input)
      if (e.key === '?' && !['TEXTAREA', 'INPUT'].includes(e.target?.tagName)) {
        e.preventDefault();
        setShortcutsOpen(prev => !prev);
        return;
      }

      // Ctrl/Cmd + Enter : Clean text
      if (isModifier && e.key === 'Enter') {
        e.preventDefault();
        executeClean();
        return;
      }

      // Ctrl/Cmd + Shift + C : Copy Cleaned Result
      if (isModifier && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        if (cleanedText) {
          navigator.clipboard?.writeText(cleanedText);
          notify('Cleaned text copied to clipboard!', 'success');
        } else {
          notify('No cleaned text to copy', 'warning');
        }
        return;
      }

      // Ctrl/Cmd + Shift + X : Clear input
      if (isModifier && e.shiftKey && (e.key === 'X' || e.key === 'x')) {
        e.preventDefault();
        if (originalText) {
          if (window.confirm('Clear all original text?')) {
            handleOriginalTextChange('');
            notify('Original text cleared', 'info');
          }
        }
        return;
      }

      // Ctrl/Cmd + Z : Undo text edit (when not inside textarea's native undo)
      if (isModifier && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        if (e.target?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleUndo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMac, executeClean, cleanedText, originalText, shortcutsOpen, historyOpen, handleUndo, notify]);

  // Statistics
  const originalStats = useMemo(() => calculateTextStats(originalText), [originalText]);
  const cleanedStats = useMemo(() => calculateTextStats(cleanedText), [cleanedText]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Header */}
      <Header
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
        isHistoryEnabled={historyActive}
        canInstallPwa={Boolean(deferredPrompt)}
        onInstallPwa={handleInstallPwa}
        isInstalled={isInstalled}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8" id="editor">
        {/* Hero Section */}
        <Hero />

        {/* Text Editors Grid: Original & Cleaned */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
          {/* Left Column: Original Editor */}
          <div className="space-y-4">
            <TextEditor
              value={originalText}
              onChange={handleOriginalTextChange}
              stats={originalStats}
              onNotify={notify}
            />
          </div>

          {/* Right Column: Cleaned Result */}
          <div className="space-y-4">
            <CleanedResult
              value={cleanedText}
              originalValue={originalText}
              operationsApplied={operationsApplied}
              findReplaceMatches={findReplaceMatches}
              onRestoreOriginal={handleRestoreOriginal}
              onSwapOriginalAndCleaned={handleSwap}
              onNotify={notify}
              stats={cleanedStats}
            />
          </div>
        </div>

        {/* Quick Toolbar (Presets + Clean Text Button) */}
        <QuickToolbar
          presets={presets}
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
          onExecuteClean={executeClean}
          isProcessing={false}
          hasText={Boolean(originalText)}
          isMac={isMac}
        />

        {/* Expandable Advanced Cleanup Settings */}
        <AdvancedSettings
          config={config}
          onChange={(newConf) => {
            setConfig(newConf);
            setActivePresetId(null); // Custom config mode
          }}
          onResetDefaults={() => {
            setConfig(DEFAULT_CONFIG);
            setActivePresetId('quick-clean');
            notify('Settings restored to defaults', 'info');
          }}
        />

        {/* Custom Preset Selector & Management Controls */}
        <PresetManager
          presets={presets}
          activePresetId={activePresetId}
          currentConfig={config}
          onSelectPreset={handleSelectPreset}
          onSavePreset={handleSavePreset}
          onDeletePreset={handleDeletePreset}
          onResetPresets={handleResetPresets}
          onNotify={notify}
        />

        {/* Original-versus-Cleaned Comparison (Visual Diff) */}
        {(originalText || cleanedText) && (
          <ComparisonView
            original={originalText}
            cleaned={cleanedText}
          />
        )}

        {/* Text Statistics Comparison Card */}
        <TextStats
          originalStats={originalStats}
          cleanedStats={cleanedStats}
          hasCleaned={Boolean(cleanedText)}
        />

        {/* Non-intrusive AdSlot #1 (Policy-compliant reserved container) */}
        <AdSlot slotId="" format="horizontal" />

        {/* How it Works, Privacy & FAQs Sections */}
        <InfoSections />

        {/* Non-intrusive AdSlot #2 (Within informational content) */}
        <AdSlot slotId="" format="horizontal" />
      </main>

      {/* Footer */}
      <Footer
        canInstallPwa={Boolean(deferredPrompt)}
        onInstallPwa={handleInstallPwa}
        isInstalled={isInstalled}
        onNotify={notify}
      />

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onRestoreEntry={handleRestoreHistoryEntry}
        onNotify={notify}
        onHistoryStatusChange={setHistoryActive}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        isMac={isMac}
      />

      {/* Accessible Live Toast Notification */}
      {toast && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-elevated border border-slate-700/80 text-xs sm:text-sm font-medium animate-slideUp"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
          {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
