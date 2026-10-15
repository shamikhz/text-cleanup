import React, { useState } from 'react';
import { 
  Bookmark, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Check, 
  X,
  BookmarkCheck,
  AlertCircle
} from 'lucide-react';

export default function PresetManager({ 
  presets, 
  activePresetId, 
  currentConfig, 
  onSelectPreset, 
  onSavePreset, 
  onDeletePreset,
  onResetPresets,
  onNotify
}) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');
  const [presetToDelete, setPresetToDelete] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    if (!newPresetName.trim()) {
      if (onNotify) onNotify('Please enter a name for your preset', 'warning');
      return;
    }

    const newPreset = {
      id: 'custom_' + Date.now(),
      name: newPresetName.trim(),
      description: newPresetDesc.trim() || 'Custom user configuration',
      isSystem: false,
      config: currentConfig,
    };

    const success = onSavePreset(newPreset);
    if (success) {
      if (onNotify) onNotify(`Preset "${newPreset.name}" saved!`, 'success');
      setNewPresetName('');
      setNewPresetDesc('');
      setShowSaveModal(false);
    } else {
      if (onNotify) onNotify('Failed to save preset to storage', 'error');
    }
  };

  const confirmDelete = () => {
    if (presetToDelete) {
      onDeletePreset(presetToDelete.id);
      if (onNotify) onNotify(`Preset "${presetToDelete.name}" deleted`, 'info');
      setPresetToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-4 sm:p-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-800">Custom Cleanup Presets</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSaveModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Save Current as Preset</span>
          </button>

          <button
            type="button"
            onClick={onResetPresets}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="Reset presets to initial factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Preset List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {presets.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-500 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isActive ? (
                    <BookmarkCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className={`text-xs font-bold ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                    {preset.name}
                  </span>
                </div>

                {!preset.isSystem && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPresetToDelete(preset);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete preset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>

              <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>{preset.isSystem ? 'System Preset' : 'Custom Preset'}</span>
                {isActive && <span className="font-semibold text-blue-600">Active</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Preset Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated w-full max-w-md p-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Save Custom Preset</h3>
              </div>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preset Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="e.g. My Markdown Cleaner"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={newPresetDesc}
                  onChange={(e) => setNewPresetDesc(e.target.value)}
                  placeholder="e.g. Cleans extra spaces and formats sentences"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  Save Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {presetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated w-full max-w-sm p-5 animate-scaleUp">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">Delete Preset?</h3>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete preset <strong>"{presetToDelete.name}"</strong>? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPresetToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
