import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  AlignJustify, 
  CopyCheck, 
  Type, 
  Smile, 
  Search,
  AlertTriangle,
  Info,
  RotateCcw
} from 'lucide-react';

export default function AdvancedSettings({ 
  config, 
  onChange, 
  onResetDefaults 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('whitespace'); // 'whitespace' | 'duplicates' | 'case' | 'characters' | 'findreplace'

  const updateConfig = (key, value) => {
    onChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateDuplicateOption = (key, value) => {
    onChange(prev => ({
      ...prev,
      duplicateOptions: {
        ...prev.duplicateOptions,
        [key]: value
      }
    }));
  };

  const updateFindReplace = (key, value) => {
    onChange(prev => ({
      ...prev,
      findAndReplace: {
        ...prev.findAndReplace,
        [key]: value
      }
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden transition-all">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 sm:px-6 py-3.5 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between text-left transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-sm text-slate-800">Advanced Cleanup Settings & Rules</span>
            <p className="text-xs text-slate-500 hidden sm:block">
              Fine-tune whitespace, duplicate lines, character filtering, case, and find-replace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">
            {isOpen ? 'Collapse' : 'Expand Settings'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-slate-200 animate-fadeIn">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('whitespace')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeTab === 'whitespace'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span>Whitespace & Lines</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('duplicates')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeTab === 'duplicates'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CopyCheck className="w-3.5 h-3.5" />
              <span>Duplicate Lines</span>
              {config.removeDuplicateLines && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('case')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeTab === 'case'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Case Conversion</span>
              {config.caseConversion !== 'none' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('characters')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeTab === 'characters'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Characters & Emojis</span>
              {(config.removeEmojis || config.removePunctuation || config.removeSpecialChars || config.removeNumbers) && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('findreplace')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                activeTab === 'findreplace'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find & Replace</span>
              {config.findAndReplaceActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

          {/* Tab 1: Whitespace & Lines */}
          {activeTab === 'whitespace' && (
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={config.trimLeadingTrailing}
                  onChange={(e) => updateConfig('trimLeadingTrailing', e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Trim Document Whitespace</span>
                  <span className="text-xs text-slate-500">Remove spaces and blank lines from start and end of document.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={config.replaceRepeatedSpaces}
                  onChange={(e) => updateConfig('replaceRepeatedSpaces', e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Collapse Repeated Spaces</span>
                  <span className="text-xs text-slate-500">Replace 2 or more horizontal spaces with a single space.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={config.trimEachLine}
                  onChange={(e) => updateConfig('trimEachLine', e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Trim Each Line</span>
                  <span className="text-xs text-slate-500">Strip leading and trailing spaces from every individual line.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={config.removeExtraBlankLines}
                  disabled={config.removeEmptyLines}
                  onChange={(e) => updateConfig('removeExtraBlankLines', e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 disabled:opacity-40"
                />
                <div className={config.removeEmptyLines ? 'opacity-40' : ''}>
                  <span className="text-xs font-semibold text-slate-800 block">Collapse Extra Blank Lines</span>
                  <span className="text-xs text-slate-500">Reduce multiple consecutive empty lines down to a single blank line.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={config.removeEmptyLines}
                  onChange={(e) => updateConfig('removeEmptyLines', e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Remove All Empty Lines</span>
                  <span className="text-xs text-slate-500">Completely strip out any blank or whitespace-only lines.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={config.normalizeParagraphBreaks}
                  onChange={(e) => updateConfig('normalizeParagraphBreaks', e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Normalize Paragraph Breaks</span>
                  <span className="text-xs text-slate-500">Combine wrapped paragraph lines into smooth single paragraphs.</span>
                </div>
              </label>
            </div>
          )}

          {/* Tab 2: Duplicate Lines */}
          {activeTab === 'duplicates' && (
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Enable Duplicate Line Removal</span>
                  <span className="text-xs text-slate-500">Scans lines and eliminates identical duplicates while preserving order.</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.removeDuplicateLines}
                  onChange={(e) => updateConfig('removeDuplicateLines', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-5 h-5"
                />
              </div>

              {config.removeDuplicateLines && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 sm:pl-4 border-l-2 border-blue-500">
                  <label className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.duplicateOptions?.caseSensitive ?? true}
                      onChange={(e) => updateDuplicateOption('caseSensitive', e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">Case-Sensitive Matching</span>
                      <span className="text-xs text-slate-500">Treat "Apple" and "apple" as different lines.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.duplicateOptions?.ignoreWhitespace ?? true}
                      onChange={(e) => updateDuplicateOption('ignoreWhitespace', e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">Ignore Whitespace in Comparison</span>
                      <span className="text-xs text-slate-500">Match lines regardless of leading/trailing indentation.</span>
                    </div>
                  </label>

                  <div className="sm:col-span-2 p-3 rounded-lg border border-slate-200 bg-white">
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Blank Lines Treatment:
                    </label>
                    <select
                      value={config.duplicateOptions?.blankLinesMode ?? 'dedupe'}
                      onChange={(e) => updateDuplicateOption('blankLinesMode', e.target.value)}
                      className="w-full text-xs p-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="dedupe">Deduplicate (keep only 1 blank line)</option>
                      <option value="keepAll">Keep all blank lines intact</option>
                      <option value="removeAll">Remove all blank lines</option>
                    </select>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Always preserves the first occurrence of duplicate lines in their original relative position.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Case Conversion */}
          {activeTab === 'case' && (
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'none', label: 'No Change', desc: 'Preserve original casing' },
                  { id: 'uppercase', label: 'UPPERCASE', desc: 'Convert all letters to caps' },
                  { id: 'lowercase', label: 'lowercase', desc: 'Convert all letters to lower' },
                  { id: 'sentence', label: 'Sentence case', desc: 'Capitalize start of sentences' },
                  { id: 'title', label: 'Title Case', desc: 'Capitalize major words' },
                ].map((item) => {
                  const isSelected = config.caseConversion === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => updateConfig('caseConversion', item.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block leading-snug">{item.desc}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-blue-800">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Unicode Support:</strong> Supports accented characters (é, ü, ç, ñ), Cyrillic, Greek, and other Unicode alphabets. Title Case respects standard English minor words (a, an, the, and, in, of).
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: Characters & Emojis */}
          {activeTab === 'characters' && (
            <div className="pt-4 space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Warning:</strong> Removing punctuation or symbols will modify mathematical notation, currencies, URLs, and code blocks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.removeEmojis}
                    onChange={(e) => updateConfig('removeEmojis', e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Remove Emojis</span>
                    <span className="text-xs text-slate-500">Eliminates pictographs, smileys, and symbols (e.g. 🚀, 🎉, 😊).</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.removePunctuation}
                    onChange={(e) => updateConfig('removePunctuation', e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Remove Punctuation</span>
                    <span className="text-xs text-slate-500">Removes commas, periods, quotes, dashes, exclamation marks, etc.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.removeSpecialChars}
                    onChange={(e) => updateConfig('removeSpecialChars', e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Remove Special Symbols</span>
                    <span className="text-xs text-slate-500">Removes currency signs ($ € £), math symbols (± × ÷), and icons.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.removeNumbers}
                    onChange={(e) => updateConfig('removeNumbers', e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Remove Numbers</span>
                    <span className="text-xs text-slate-500">Strips all numeric digits (0-9).</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Tab 5: Find & Replace */}
          {activeTab === 'findreplace' && (
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Enable Find & Replace in Pipeline</span>
                  <span className="text-xs text-slate-500">Automatically searches and replaces patterns as part of text cleaning.</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.findAndReplaceActive}
                  onChange={(e) => updateConfig('findAndReplaceActive', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-5 h-5"
                />
              </div>

              {config.findAndReplaceActive && (
                <div className="space-y-3 p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Find (Search text):
                      </label>
                      <input
                        type="text"
                        value={config.findAndReplace?.search || ''}
                        onChange={(e) => updateFindReplace('search', e.target.value)}
                        placeholder="e.g. oldWord or pattern"
                        className="w-full p-2 text-xs font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Replace with:
                      </label>
                      <input
                        type="text"
                        value={config.findAndReplace?.replace || ''}
                        onChange={(e) => updateFindReplace('replace', e.target.value)}
                        placeholder="e.g. newWord (leave blank to delete)"
                        className="w-full p-2 text-xs font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.findAndReplace?.caseSensitive ?? true}
                        onChange={(e) => updateFindReplace('caseSensitive', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span className="text-slate-700">Case-sensitive</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.findAndReplace?.matchAll ?? true}
                        onChange={(e) => updateFindReplace('matchAll', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span className="text-slate-700">Replace all occurrences</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.findAndReplace?.isRegex ?? false}
                        onChange={(e) => updateFindReplace('isRegex', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span className="text-slate-700">Regular expression (Advanced)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reset to Default Settings CTA */}
          <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={onResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Settings to Default</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
