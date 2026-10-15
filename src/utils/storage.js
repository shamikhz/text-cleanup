/**
 * Local Storage & State Persistence Manager
 * 
 * Strict Privacy & Safety Guarantees:
 * - Text history is DISABLED by default. Never stored without explicit user opt-in.
 * - All data is kept 100% locally on the user's device. No sync or network transmission.
 * - Graceful fallbacks for Private/Incognito modes and QuotaExceeded errors.
 */

import { DEFAULT_PRESETS } from './textProcessors';

const STORAGE_KEYS = {
  PRESETS: 'tcs_user_presets',
  ACTIVE_PRESET_ID: 'tcs_active_preset_id',
  HISTORY_ENABLED: 'tcs_history_enabled',
  HISTORY_ITEMS: 'tcs_history_items',
  THEME_PREF: 'tcs_theme_pref',
};

const MAX_HISTORY_ITEMS = 15;
const MAX_ITEM_CHAR_LENGTH = 30000; // ~30KB text limit per history item to prevent quota exhaustion

/**
 * Checks if localStorage is available and functional.
 * @returns {boolean}
 */
export function isStorageAvailable() {
  try {
    const testKey = '__tcs_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Loads custom presets combined with defaults.
 * @returns {Array<Object>}
 */
export function getSavedPresets() {
  if (!isStorageAvailable()) return DEFAULT_PRESETS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.PRESETS);
    if (!raw) return DEFAULT_PRESETS;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_PRESETS;

    // Filter valid custom presets
    const custom = parsed.filter(p => p && p.id && p.name && p.config && !p.isSystem);
    return [...DEFAULT_PRESETS, ...custom];
  } catch (err) {
    console.warn('Failed to parse saved presets:', err);
    return DEFAULT_PRESETS;
  }
}

/**
 * Saves a new or updated custom preset.
 * @param {Object} preset 
 * @returns {boolean} success
 */
export function savePreset(preset) {
  if (!isStorageAvailable() || !preset || !preset.name || !preset.config) return false;

  try {
    const current = getSavedPresets();
    const customOnly = current.filter(p => !p.isSystem);

    const existingIndex = customOnly.findIndex(p => p.id === preset.id);
    if (existingIndex >= 0) {
      customOnly[existingIndex] = { ...preset, isSystem: false, updatedAt: Date.now() };
    } else {
      customOnly.push({
        ...preset,
        id: preset.id || 'preset_' + Date.now(),
        isSystem: false,
        createdAt: Date.now(),
      });
    }

    window.localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(customOnly));
    return true;
  } catch (err) {
    console.error('Failed to save preset to localStorage:', err);
    return false;
  }
}

/**
 * Deletes a custom preset by ID.
 * @param {string} presetId 
 * @returns {boolean}
 */
export function deletePreset(presetId) {
  if (!isStorageAvailable() || !presetId) return false;

  try {
    const current = getSavedPresets();
    const customOnly = current.filter(p => !p.isSystem && p.id !== presetId);
    window.localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(customOnly));
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Resets presets to initial system defaults.
 */
export function resetPresetsToDefault() {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.PRESETS);
  } catch (e) {}
}

/**
 * Checks whether user has enabled local text history.
 * Default is FALSE (privacy first).
 * @returns {boolean}
 */
export function isHistoryEnabled() {
  if (!isStorageAvailable()) return false;
  try {
    return window.localStorage.getItem(STORAGE_KEYS.HISTORY_ENABLED) === 'true';
  } catch (e) {
    return false;
  }
}

/**
 * Sets whether user has opted into local history.
 * @param {boolean} enabled 
 */
export function setHistoryEnabled(enabled) {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.HISTORY_ENABLED, enabled ? 'true' : 'false');
    if (!enabled) {
      // Clear history when disabling for user privacy
      clearAllHistory();
    }
  } catch (e) {}
}

/**
 * Gets local history items.
 * @returns {Array<Object>}
 */
export function getHistoryItems() {
  if (!isStorageAvailable() || !isHistoryEnabled()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.HISTORY_ITEMS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

/**
 * Adds an item to history if enabled.
 * @param {Object} item 
 * @param {string} item.originalText
 * @param {string} item.cleanedText
 * @param {string} [item.presetName]
 * @param {Array<string>} [item.operationsApplied]
 */
export function addHistoryEntry(item) {
  if (!isStorageAvailable() || !isHistoryEnabled()) return false;
  if (!item || (!item.originalText && !item.cleanedText)) return false;

  // Truncate if individual text is gigantic to prevent quota explosion
  const original = item.originalText.slice(0, MAX_ITEM_CHAR_LENGTH);
  const cleaned = item.cleanedText.slice(0, MAX_ITEM_CHAR_LENGTH);

  try {
    const history = getHistoryItems();
    const newEntry = {
      id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
      originalText: original,
      cleanedText: cleaned,
      presetName: item.presetName || 'Custom Cleanup',
      operationsApplied: item.operationsApplied || [],
      originalLength: item.originalText.length,
      cleanedLength: item.cleanedText.length,
    };

    // Prepend and limit count
    const updated = [newEntry, ...history].slice(0, MAX_HISTORY_ITEMS);
    window.localStorage.setItem(STORAGE_KEYS.HISTORY_ITEMS, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.warn('Storage quota reached while saving history entry:', err);
    return false;
  }
}

/**
 * Deletes a single history entry by ID.
 * @param {string} id 
 */
export function deleteHistoryEntry(id) {
  if (!isStorageAvailable()) return false;
  try {
    const history = getHistoryItems();
    const filtered = history.filter(item => item.id !== id);
    window.localStorage.setItem(STORAGE_KEYS.HISTORY_ITEMS, JSON.stringify(filtered));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Clears all history entries.
 */
export function clearAllHistory() {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.HISTORY_ITEMS);
  } catch (e) {}
}
