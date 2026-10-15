import React, { useState, useMemo } from 'react';
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
  RotateCcw,
  X,
  Check,
  Play
} from 'lucide-react';
import { 
  findAndReplace, 
  countDuplicateLines, 
  removeDuplicateWords, 
  countDuplicateWords 
} from '../utils/textProcessors';

export default function AdvancedSettings({ 
  config, 
  onChange, 
  onResetDefaults,
  originalText = '',
  onDirectReplace,
  onDirectDeduplicate,
  onDirectDeduplicateWords
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('whitespace'); // 'whitespace' | 'duplicates' | 'case' | 'characters' | 'findreplace'

  const duplicateCount = useMemo(() => {
    return countDuplicateLines(originalText, config.duplicateOptions);
  }, [originalText, config.duplicateOptions]);

  const duplicateWordCount = useMemo(() => {
    return countDuplicateWords(originalText, {
      caseSensitive: config.duplicateOptions?.caseSensitive ?? false,
      mode: config.duplicateOptions?.duplicateWordsMode ?? 'consecutive',
    });
  }, [originalText, config.duplicateOptions]);

  const findMatches = useMemo(() => {
    if (!config.findAndReplace?.search) return { count: 0, error: null };
    const res = findAndReplace(originalText, config.findAndReplace);
    return { count: res.matchCount, error: res.error };
  }, [originalText, config.findAndReplace]);

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
              <span>Duplicate Lines & Words</span>
              {(config.removeDuplicateLines || config.removeDuplicateWords) && (
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
              {/* Header card with toggle and live duplicate count */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">Duplicate Line Removal</span>
                    {originalText && (
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        duplicateCount > 0 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {duplicateCount > 0 
                          ? `${duplicateCount} duplicate line${duplicateCount !== 1 ? 's' : ''} detected` 
                          : 'No duplicate lines'}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Eliminates identical lines while preserving the original sequence of non-duplicate content.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <span>Include in Clean Text:</span>
                    <input
                      type="checkbox"
                      checked={config.removeDuplicateLines}
                      onChange={(e) => updateConfig('removeDuplicateLines', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-5 h-5 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Direct Deduplicate Button */}
              {onDirectDeduplicate && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                  <div className="text-xs text-blue-900">
                    <span className="font-semibold block">Instant Deduplication</span>
                    <span className="text-blue-700 text-[11px]">Remove duplicate lines directly in the editor right now without running other rules.</span>
                  </div>
                  <button
                    type="button"
                    onClick={onDirectDeduplicate}
                    disabled={!originalText}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-sm transition-all shrink-0"
                  >
                    <CopyCheck className="w-3.5 h-3.5" />
                    <span>Deduplicate Now</span>
                  </button>
                </div>
              )}

              {/* Configuration options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 sm:pl-4 border-l-2 border-blue-500">
                <label className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.duplicateOptions?.caseSensitive ?? false}
                    onChange={(e) => updateDuplicateOption('caseSensitive', e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Case-Sensitive Matching</span>
                    <span className="text-xs text-slate-500">Unchecked treats "Apple" and "apple" as duplicates.</span>
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
                    <span className="text-xs font-semibold text-slate-800 block">Ignore Line Edge Whitespace</span>
                    <span className="text-xs text-slate-500">Match lines regardless of leading/trailing indentation.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.duplicateOptions?.preserveFirst ?? true}
                    onChange={(e) => updateDuplicateOption('preserveFirst', e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Keep First Occurrence</span>
                    <span className="text-xs text-slate-500">Checked keeps the first instance; unchecked keeps the last.</span>
                  </div>
                </label>

                <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Blank Lines Treatment:
                  </label>
                  <select
                    value={config.duplicateOptions?.blankLinesMode ?? 'dedupe'}
                    onChange={(e) => updateDuplicateOption('blankLinesMode', e.target.value)}
                    className="w-full text-xs p-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="dedupe">Deduplicate (keep only 1 blank line)</option>
                    <option value="keepAll">Keep all blank lines intact</option>
                    <option value="removeAll">Remove all blank lines</option>
                  </select>
                </div>
              </div>

              {/* Divider between Lines and Words */}
              <div className="border-t border-slate-200/80 my-2" />

              {/* Duplicate Words Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">Duplicate Word Removal</span>
                    {originalText && (
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        duplicateWordCount > 0 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {duplicateWordCount > 0 
                          ? `${duplicateWordCount} duplicate word${duplicateWordCount !== 1 ? 's' : ''} detected` 
                          : 'No duplicate words'}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Eliminates repeated words (e.g. repeated typing errors like "the the") or duplicate words per line.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <span>Include in Clean Text:</span>
                    <input
                      type="checkbox"
                      checked={config.removeDuplicateWords || false}
                      onChange={(e) => updateConfig('removeDuplicateWords', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-5 h-5 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Direct Deduplicate Words Button */}
              {onDirectDeduplicateWords && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                  <div className="text-xs text-blue-900">
                    <span className="font-semibold block">Instant Word Deduplication</span>
                    <span className="text-blue-700 text-[11px]">Remove duplicate words directly in the editor text right now.</span>
                  </div>
                  <button
                    type="button"
                    onClick={onDirectDeduplicateWords}
                    disabled={!originalText}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-sm transition-all shrink-0"
                  >
                    <CopyCheck className="w-3.5 h-3.5" />
                    <span>Deduplicate Words Now</span>
                  </button>
                </div>
              )}

              {/* Word Removal Mode Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 sm:pl-4 border-l-2 border-indigo-500">
                <div className="p-2.5 rounded-lg border border-slate-200 bg-white sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Word Deduplication Mode:
                  </label>
                  <select
                    value={config.duplicateOptions?.duplicateWordsMode ?? 'consecutive'}
                    onChange={(e) => updateDuplicateOption('duplicateWordsMode', e.target.value)}
                    className="w-full text-xs p-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="consecutive">Consecutive duplicates only (e.g. "the the" → "the", "is is" → "is")</option>
                    <option value="allInLine">All duplicate words per line (keep only unique words in each line)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Respects the Case-Sensitive Matching toggle above for case tolerance.
                  </p>
                </div>
              </div>
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
              {/* Header card with pipeline toggle and live match indicator */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">Find & Replace</span>
                    {config.findAndReplace?.search && (
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        findMatches.error
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : findMatches.count > 0 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {findMatches.error 
                          ? 'Invalid regex pattern' 
                          : `${findMatches.count} match${findMatches.count !== 1 ? 'es' : ''} in editor`}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Search for specific text or regex patterns and replace them or strip them out.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <span>Include in Clean Text:</span>
                    <input
                      type="checkbox"
                      checked={config.findAndReplaceActive}
                      onChange={(e) => updateConfig('findAndReplaceActive', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-5 h-5 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Direct Replace Actions Bar */}
              {onDirectReplace && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                  <div className="text-xs text-blue-900">
                    <span className="font-semibold block">Instant Editor Actions</span>
                    <span className="text-blue-700 text-[11px]">Directly execute replacement in the text editor without running the full clean pipeline.</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onDirectReplace('first')}
                      disabled={!config.findAndReplace?.search || findMatches.count === 0}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg shadow-sm transition-all"
                    >
                      <span>Replace First</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDirectReplace('all')}
                      disabled={!config.findAndReplace?.search || findMatches.count === 0}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Replace All ({findMatches.count})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Search & Replace Inputs */}
              <div className="space-y-3 p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Find (Search text):
                      </label>
                      {config.findAndReplace?.search && (
                        <button
                          type="button"
                          onClick={() => updateFindReplace('search', '')}
                          className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={config.findAndReplace?.search || ''}
                        onChange={(e) => updateFindReplace('search', e.target.value)}
                        placeholder="Search word or pattern..."
                        className="w-full pl-3 pr-8 py-2 text-xs font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {config.findAndReplace?.search && (
                        <button
                          type="button"
                          onClick={() => updateFindReplace('search', '')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Replace with:
                      </label>
                      {config.findAndReplace?.replace && (
                        <button
                          type="button"
                          onClick={() => updateFindReplace('replace', '')}
                          className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={config.findAndReplace?.replace || ''}
                        onChange={(e) => updateFindReplace('replace', e.target.value)}
                        placeholder="Replacement text (leave empty to delete)"
                        className="w-full pl-3 pr-8 py-2 text-xs font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {config.findAndReplace?.replace && (
                        <button
                          type="button"
                          onClick={() => updateFindReplace('replace', '')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Regex Error Notice */}
                {findMatches.error && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Regex syntax error: {findMatches.error}</span>
                  </div>
                )}

                {/* Options */}
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.findAndReplace?.caseSensitive ?? true}
                      onChange={(e) => updateFindReplace('caseSensitive', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="text-slate-700 font-medium">Case-sensitive</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.findAndReplace?.matchAll ?? true}
                      onChange={(e) => updateFindReplace('matchAll', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="text-slate-700 font-medium">Replace all occurrences</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.findAndReplace?.isRegex ?? false}
                      onChange={(e) => updateFindReplace('isRegex', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="text-slate-700 font-medium">Regular expression (Regex)</span>
                  </label>
                </div>
              </div>
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
