import React, { useState, useEffect } from 'react';
import { 
  X, 
  History, 
  Trash2, 
  RotateCcw, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  getHistoryItems, 
  deleteHistoryEntry, 
  clearAllHistory, 
  setHistoryEnabled, 
  isHistoryEnabled 
} from '../utils/storage';

export default function HistoryDrawer({ 
  isOpen, 
  onClose, 
  onRestoreEntry, 
  onNotify,
  onHistoryStatusChange
}) {
  const [historyActive, setHistoryActive] = useState(false);
  const [items, setItems] = useState([]);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const loadData = () => {
    const active = isHistoryEnabled();
    setHistoryActive(active);
    if (active) {
      setItems(getHistoryItems());
    } else {
      setItems([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const toggleHistoryOptIn = (e) => {
    const enabled = e.target.checked;
    setHistoryEnabled(enabled);
    setHistoryActive(enabled);
    if (onHistoryStatusChange) onHistoryStatusChange(enabled);

    if (enabled) {
      if (onNotify) onNotify('Local history enabled. Recent sessions will be saved on this device.', 'info');
      setItems(getHistoryItems());
    } else {
      if (onNotify) onNotify('Local history disabled. All existing history cleared.', 'info');
      setItems([]);
    }
  };

  const handleDeleteItem = (id) => {
    deleteHistoryEntry(id);
    setItems(prev => prev.filter(item => item.id !== id));
    if (onNotify) onNotify('History entry removed', 'info');
  };

  const handleClearAll = () => {
    clearAllHistory();
    setItems([]);
    setConfirmClearAll(false);
    if (onNotify) onNotify('All text history cleared', 'info');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-800">Local Text History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Opt-in Banner */}
        <div className="p-4 bg-slate-100/70 border-b border-slate-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={historyActive}
              onChange={toggleHistoryOptIn}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Enable Local Text History
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Opt-in to remember your last 15 cleanup results locally on this browser. Disabled by default for maximum privacy.
              </p>
            </div>
          </label>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!historyActive ? (
            <div className="text-center py-12 px-4 text-slate-400">
              <ShieldCheck className="w-12 h-12 text-emerald-500/70 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">History is Disabled</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                No text is being saved to this browser. Check the box above if you want your recent sessions preserved locally.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 px-4 text-slate-400">
              <History className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No History Saved Yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Perform a text cleanup action to see your history entries appear here.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-subtle transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {item.presetName}
                  </span>
                </div>

                <div className="p-2 rounded bg-slate-50 font-mono text-xs text-slate-700 max-h-20 overflow-hidden line-clamp-3">
                  {item.cleanedText || item.originalText}
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] text-slate-500">
                    {item.cleanedLength.toLocaleString()} characters
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onRestoreEntry(item);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-xs"
                      title="Restore this version into the editor"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Delete this entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {historyActive && items.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            {confirmClearAll ? (
              <div className="flex items-center justify-between w-full text-xs">
                <span className="font-semibold text-rose-700">Clear all entries?</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearAll}
                    className="px-2.5 py-1 bg-rose-600 text-white rounded font-medium hover:bg-rose-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmClearAll(false)}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="text-xs text-slate-500">
                  {items.length} of 15 entries stored
                </span>
                <button
                  onClick={() => setConfirmClearAll(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
