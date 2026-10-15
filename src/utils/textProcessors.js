/**
 * Text Cleanup Studio — Deterministic Text Processing Pipeline & Utilities
 * 
 * All transformations execute purely client-side without external dependencies.
 * Operations handle Unicode, multilingual scripts, emojis, and varied line endings.
 */

/**
 * Normalizes line endings across platforms (\r\n, \r -> \n).
 * @param {string} text 
 * @returns {string}
 */
export function normalizeLineEndings(text) {
  if (!text) return '';
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Trims leading and trailing whitespace from the entire document.
 * @param {string} text 
 * @returns {string}
 */
export function trimLeadingTrailing(text) {
  if (!text) return '';
  return text.trim();
}

/**
 * Replaces consecutive spaces or tabs on lines with a single space.
 * Preserves newlines.
 * @param {string} text 
 * @returns {string}
 */
export function replaceRepeatedSpaces(text) {
  if (!text) return '';
  // Replace 2 or more horizontal spaces/tabs with a single space
  return text.replace(/[^\S\r\n]{2,}/g, ' ');
}

/**
 * Trims whitespace from the beginning and end of each individual line.
 * @param {string} text 
 * @returns {string}
 */
export function trimEachLine(text) {
  if (!text) return '';
  return text
    .split('\n')
    .map(line => line.trim())
    .join('\n');
}

/**
 * Removes multiple consecutive blank lines, condensing them into a single blank line.
 * @param {string} text 
 * @returns {string}
 */
export function removeExtraBlankLines(text) {
  if (!text) return '';
  return text.replace(/\n{3,}/g, '\n\n');
}

/**
 * Completely removes empty lines or lines containing only whitespace.
 * @param {string} text 
 * @returns {string}
 */
export function removeEmptyLines(text) {
  if (!text) return '';
  return text
    .split('\n')
    .filter(line => line.trim().length > 0)
    .join('\n');
}

/**
 * Normalizes line breaks into clean paragraph separators without merging paragraph text.
 * Trims lines and condenses spacing between non-empty paragraphs.
 * @param {string} text 
 * @returns {string}
 */
export function normalizeParagraphBreaks(text) {
  if (!text) return '';
  const lines = text.split('\n').map(l => l.trim());
  const paragraphs = [];
  let currentPara = [];

  for (const line of lines) {
    if (line.length === 0) {
      if (currentPara.length > 0) {
        paragraphs.push(currentPara.join(' '));
        currentPara = [];
      }
    } else {
      currentPara.push(line);
    }
  }

  if (currentPara.length > 0) {
    paragraphs.push(currentPara.join(' '));
  }

  return paragraphs.join('\n\n');
}

/**
 * Removes duplicate lines from text.
 * Configurable for case sensitivity, whitespace tolerance, and blank line handling.
 * 
 * @param {string} text 
 * @param {Object} options
 * @param {boolean} [options.caseSensitive=true]
 * @param {boolean} [options.ignoreWhitespace=true]
 * @param {boolean} [options.preserveFirst=true]
 * @param {'keepAll'|'dedupe'|'removeAll'} [options.blankLinesMode='dedupe']
 * @returns {string}
 */
export function removeDuplicateLines(text, options = {}) {
  if (!text) return '';
  const {
    caseSensitive = false,
    ignoreWhitespace = true,
    preserveFirst = true,
    blankLinesMode = 'dedupe'
  } = options;

  // Always normalize line endings first so CRLF differences don't break line matching
  const normalized = normalizeLineEndings(text);
  const lines = normalized.split('\n');
  const seen = new Set();
  let hasBlankLine = false;

  const processLine = (rawLine) => {
    const isBlank = rawLine.trim().length === 0;

    if (isBlank) {
      if (blankLinesMode === 'removeAll') {
        return null;
      } else if (blankLinesMode === 'dedupe') {
        if (!hasBlankLine) {
          hasBlankLine = true;
          return '';
        }
        return null;
      } else {
        // 'keepAll'
        return rawLine;
      }
    }

    let key = ignoreWhitespace ? rawLine.trim() : rawLine;
    if (!caseSensitive) {
      key = key.toLocaleLowerCase();
    }

    if (!seen.has(key)) {
      seen.add(key);
      return rawLine;
    }
    return null;
  };

  const filtered = [];
  if (preserveFirst) {
    for (let i = 0; i < lines.length; i++) {
      const res = processLine(lines[i]);
      if (res !== null) filtered.push(res);
    }
  } else {
    // Preserve last occurrence
    for (let i = lines.length - 1; i >= 0; i--) {
      const res = processLine(lines[i]);
      if (res !== null) filtered.unshift(res);
    }
  }

  return filtered.join('\n');
}

/**
 * Calculates the number of duplicate lines that would be removed.
 * @param {string} text 
 * @param {Object} [options]
 * @returns {number}
 */
export function countDuplicateLines(text, options = {}) {
  if (!text) return 0;
  const normalized = normalizeLineEndings(text);
  const beforeCount = normalized.split('\n').length;
  const after = removeDuplicateLines(normalized, options);
  const afterCount = after.split('\n').length;
  return Math.max(0, beforeCount - afterCount);
}

/**
 * Removes duplicate words from text.
 * Can remove consecutive repeated words (e.g., "the the" -> "the")
 * or all duplicate words per line.
 * 
 * @param {string} text 
 * @param {Object} [options]
 * @param {boolean} [options.caseSensitive=false]
 * @param {'consecutive'|'allInLine'} [options.mode='consecutive']
 * @returns {string}
 */
export function removeDuplicateWords(text, options = {}) {
  if (!text) return '';
  const { caseSensitive = false, mode = 'consecutive' } = options;

  if (mode === 'consecutive') {
    const lines = text.split('\n');
    const processedLines = lines.map(line => {
      const pattern = caseSensitive
        ? /\b([\p{L}\p{N}]+)(?:\s+\1\b)+/gu
        : /\b([\p{L}\p{N}]+)(?:\s+\1\b)+/giu;
      return line.replace(pattern, (match, word) => word);
    });
    return processedLines.join('\n');
  } else {
    const lines = text.split('\n');
    const processedLines = lines.map(line => {
      const tokens = line.split(/([\p{L}\p{N}]+)/u);
      const seen = new Set();
      const output = [];

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (i % 2 === 1) {
          // Word token
          const key = caseSensitive ? token : token.toLocaleLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            output.push(token);
          } else {
            // Duplicate word - omit token and trim preceding space token if present
            if (output.length > 0 && /^[^\S\r\n]+$/.test(output[output.length - 1])) {
              output.pop();
            }
          }
        } else {
          output.push(token);
        }
      }
      return output.join('').replace(/[^\S\r\n]{2,}/g, ' ');
    });
    return processedLines.join('\n');
  }
}

/**
 * Calculates the number of duplicate words that would be removed.
 * @param {string} text 
 * @param {Object} [options]
 * @returns {number}
 */
export function countDuplicateWords(text, options = {}) {
  if (!text) return 0;
  const { caseSensitive = false, mode = 'consecutive' } = options;
  let count = 0;

  if (mode === 'consecutive') {
    const lines = text.split('\n');
    for (const line of lines) {
      const pattern = caseSensitive
        ? /\b([\p{L}\p{N}]+)(?:\s+\1\b)+/gu
        : /\b([\p{L}\p{N}]+)(?:\s+\1\b)+/giu;
      const matches = line.matchAll(pattern);
      for (const match of matches) {
        const words = match[0].trim().split(/\s+/);
        count += Math.max(0, words.length - 1);
      }
    }
  } else {
    const lines = text.split('\n');
    for (const line of lines) {
      const words = line.match(/[\p{L}\p{N}]+/gu) || [];
      const seen = new Set();
      for (const w of words) {
        const key = caseSensitive ? w : w.toLocaleLowerCase();
        if (seen.has(key)) {
          count++;
        } else {
          seen.add(key);
        }
      }
    }
  }
  return count;
}

/**
 * Case conversion utility supporting Unicode.
 * 
 * @param {string} text 
 * @param {'none'|'uppercase'|'lowercase'|'sentence'|'title'} mode 
 * @returns {string}
 */
export function convertCase(text, mode = 'none') {
  if (!text || mode === 'none') return text;

  switch (mode) {
    case 'uppercase':
      return text.toLocaleUpperCase();

    case 'lowercase':
      return text.toLocaleLowerCase();

    case 'sentence': {
      // Capitalize first character of text, and after punctuation (. ? !) followed by whitespace or newline
      // Lowercase remaining letters within the sentence safely
      const lower = text.toLocaleLowerCase();
      return lower.replace(/(^\s*|\.\s+|\?\s+|!\s+|\n\s*)([\p{L}])/gu, (match, prefix, char) => {
        return prefix + char.toLocaleUpperCase();
      });
    }

    case 'title': {
      // Minor words that remain lowercase unless at the very start of a sentence or line
      const minorWords = new Set([
        'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with', 'in', 'of'
      ]);

      return text
        .toLocaleLowerCase()
        .replace(/[\p{L}\p{N}'’]+/gu, (word, offset) => {
          // If it's a minor word and not at the start of line/sentence
          const isAtStart = offset === 0 || /[.?!\\n]\s*$/.test(text.slice(0, offset));
          if (!isAtStart && minorWords.has(word.toLowerCase())) {
            return word;
          }
          // Capitalize first letter
          const firstChar = word.charAt(0).toLocaleUpperCase();
          return firstChar + word.slice(1);
        });
    }

    default:
      return text;
  }
}

/**
 * Emoji and character filtering with Unicode property escapes.
 * 
 * @param {string} text 
 * @param {Object} options
 * @param {boolean} [options.removeEmojis=false]
 * @param {boolean} [options.removePunctuation=false]
 * @param {boolean} [options.removeSpecialChars=false]
 * @param {boolean} [options.removeNumbers=false]
 * @returns {string}
 */
export function filterCharacters(text, options = {}) {
  if (!text) return '';
  let result = text;

  if (options.removeEmojis) {
    // Unicode Extended Pictographic & Emoji Presentation
    result = result.replace(/\p{Extended_Pictographic}/gu, '');
    result = result.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
  }

  if (options.removePunctuation) {
    // Preserves letters, numbers, spaces, and line breaks, removes Unicode punctuation
    result = result.replace(/[\p{P}]/gu, '');
  }

  if (options.removeSpecialChars) {
    // Unicode Symbols (currency, math, modifier symbols, dingbats)
    result = result.replace(/[\p{S}]/gu, '');
  }

  if (options.removeNumbers) {
    result = result.replace(/[\p{N}]/gu, '');
  }

  return result;
}

/**
 * Escapes special characters for literal regular expression matching.
 * @param {string} str 
 * @returns {string}
 */
export function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Find and replace utility.
 * Literal search by default, with optional safe regex mode.
 * 
 * @param {string} text 
 * @param {Object} options
 * @param {string} options.search
 * @param {string} options.replace
 * @param {boolean} [options.caseSensitive=true]
 * @param {boolean} [options.matchAll=true]
 * @param {boolean} [options.isRegex=false]
 * @returns {{ result: string, matchCount: number, error?: string }}
 */
export function findAndReplace(text, options = {}) {
  const {
    search = '',
    replace = '',
    caseSensitive = true,
    matchAll = true,
    isRegex = false
  } = options;

  if (!text || search === '') {
    return { result: text || '', matchCount: 0, totalMatches: 0 };
  }

  try {
    let flags = matchAll ? 'g' : '';
    if (!caseSensitive) flags += 'i';

    let pattern;
    if (isRegex) {
      pattern = new RegExp(search, flags);
    } else {
      pattern = new RegExp(escapeRegex(search), flags);
    }

    const countFlags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g';
    const matches = text.match(new RegExp(pattern.source, countFlags));
    const matchCount = matches ? matches.length : 0;
    const replacedCount = matchAll ? matchCount : (matchCount > 0 ? 1 : 0);

    const result = isRegex ? text.replace(pattern, replace) : text.replace(pattern, () => replace);
    return { result, matchCount, replacedCount, totalMatches: matchCount };
  } catch (err) {
    return { result: text, matchCount: 0, replacedCount: 0, totalMatches: 0, error: err.message };
  }
}

/**
 * Default preset configurations
 */
export const DEFAULT_PRESETS = [
  {
    id: 'quick-clean',
    name: 'Quick Clean',
    description: 'Trims leading/trailing spaces, replaces repeated spaces with single space, and normalizes line endings.',
    isSystem: true,
    config: {
      normalizeLineEndings: true,
      trimLeadingTrailing: true,
      replaceRepeatedSpaces: true,
      trimEachLine: true,
      removeExtraBlankLines: true,
      removeEmptyLines: false,
      normalizeParagraphBreaks: false,
      removeDuplicateLines: false,
      caseConversion: 'none',
      removeEmojis: false,
      removePunctuation: false,
      removeSpecialChars: false,
      removeNumbers: false,
    }
  },
  {
    id: 'remove-duplicates',
    name: 'Remove Duplicate Lines',
    description: 'Removes duplicate lines while preserving order and first occurrence.',
    isSystem: true,
    config: {
      normalizeLineEndings: true,
      trimLeadingTrailing: false,
      replaceRepeatedSpaces: false,
      trimEachLine: true,
      removeExtraBlankLines: false,
      removeEmptyLines: false,
      normalizeParagraphBreaks: false,
      removeDuplicateLines: true,
      duplicateOptions: {
        caseSensitive: false,
        ignoreWhitespace: true,
        preserveFirst: true,
        blankLinesMode: 'dedupe'
      },
      caseConversion: 'none',
      removeEmojis: false,
      removePunctuation: false,
      removeSpecialChars: false,
      removeNumbers: false,
    }
  },
  {
    id: 'clean-blank-lines',
    name: 'Clean Blank Lines',
    description: 'Removes extra blank lines and normalizes line endings across the document.',
    isSystem: true,
    config: {
      normalizeLineEndings: true,
      trimLeadingTrailing: true,
      replaceRepeatedSpaces: false,
      trimEachLine: true,
      removeExtraBlankLines: true,
      removeEmptyLines: true,
      normalizeParagraphBreaks: false,
      removeDuplicateLines: false,
      caseConversion: 'none',
      removeEmojis: false,
      removePunctuation: false,
      removeSpecialChars: false,
      removeNumbers: false,
    }
  },
  {
    id: 'content-formatting',
    name: 'Content Formatting',
    description: 'Formats paragraphs, cleans up spacing, and formats text into clean sentence case.',
    isSystem: true,
    config: {
      normalizeLineEndings: true,
      trimLeadingTrailing: true,
      replaceRepeatedSpaces: true,
      trimEachLine: true,
      removeExtraBlankLines: true,
      removeEmptyLines: false,
      normalizeParagraphBreaks: true,
      removeDuplicateLines: false,
      caseConversion: 'sentence',
      removeEmojis: false,
      removePunctuation: false,
      removeSpecialChars: false,
      removeNumbers: false,
    }
  },
  {
    id: 'remove-emojis',
    name: 'Remove Emojis',
    description: 'Strips out all emojis and symbols while preserving text, numbers, and formatting.',
    isSystem: true,
    config: {
      normalizeLineEndings: true,
      trimLeadingTrailing: true,
      replaceRepeatedSpaces: true,
      trimEachLine: false,
      removeExtraBlankLines: false,
      removeEmptyLines: false,
      normalizeParagraphBreaks: false,
      removeDuplicateLines: false,
      caseConversion: 'none',
      removeEmojis: true,
      removePunctuation: false,
      removeSpecialChars: false,
      removeNumbers: false,
    }
  }
];

export const DEFAULT_CONFIG = {
  // Whitespace and lines
  normalizeLineEndings: true,
  trimLeadingTrailing: true,
  replaceRepeatedSpaces: true,
  trimEachLine: true,
  removeExtraBlankLines: true,
  removeEmptyLines: false,
  normalizeParagraphBreaks: false,

  // Duplicate lines and words
  removeDuplicateLines: false,
  removeDuplicateWords: false,
  duplicateOptions: {
    caseSensitive: false,
    ignoreWhitespace: true,
    preserveFirst: true,
    blankLinesMode: 'dedupe', // 'keepAll' | 'dedupe' | 'removeAll'
    duplicateWordsMode: 'consecutive', // 'consecutive' | 'allInLine'
  },

  // Case conversion
  caseConversion: 'none', // 'none' | 'uppercase' | 'lowercase' | 'sentence' | 'title'

  // Emoji and character removal
  removeEmojis: false,
  removePunctuation: false,
  removeSpecialChars: false,
  removeNumbers: false,

  // Find & Replace
  findAndReplaceActive: false,
  findAndReplace: {
    search: '',
    replace: '',
    caseSensitive: true,
    matchAll: true,
    isRegex: false,
  }
};

/**
 * Deterministic Text Processing Pipeline
 * 
 * Order of operations:
 * 1. Normalize line endings (\r\n -> \n)
 * 2. Trim each line (if enabled)
 * 3. Replace repeated spaces (if enabled)
 * 4. Duplicate line removal (if enabled)
 * 5. Remove empty lines (if enabled) OR Remove extra blank lines (if enabled)
 * 6. Normalize paragraph breaks (if enabled)
 * 7. Character and emoji filtering (if enabled)
 * 8. Case conversion (if enabled)
 * 9. Find & Replace (if configured)
 * 10. Trim document leading/trailing whitespace (if enabled)
 * 
 * @param {string} text 
 * @param {typeof DEFAULT_CONFIG} config 
 * @returns {{ cleanedText: string, operationsApplied: string[], findReplaceMatches?: number }}
 */
export function processText(text, config = DEFAULT_CONFIG) {
  if (text === null || text === undefined) {
    return { cleanedText: '', operationsApplied: [] };
  }
  if (text === '') {
    return { cleanedText: '', operationsApplied: [] };
  }

  let result = text;
  const operationsApplied = [];

  // Step 1: Normalize Line Endings
  if (config.normalizeLineEndings) {
    const before = result;
    result = normalizeLineEndings(result);
    if (before !== result) operationsApplied.push('Normalized line endings');
  }

  // Step 2: Trim Each Line
  if (config.trimEachLine) {
    const before = result;
    result = trimEachLine(result);
    if (before !== result) operationsApplied.push('Trimmed line edges');
  }

  // Step 3: Replace Repeated Spaces
  if (config.replaceRepeatedSpaces) {
    const before = result;
    result = replaceRepeatedSpaces(result);
    if (before !== result) operationsApplied.push('Collapsed multiple spaces');
  }

  // Step 4: Remove Duplicate Lines
  if (config.removeDuplicateLines) {
    const before = result;
    result = removeDuplicateLines(result, config.duplicateOptions || {});
    if (before !== result) {
      const beforeCount = before.split('\n').length;
      const afterCount = result.split('\n').length;
      const removedCount = Math.max(0, beforeCount - afterCount);
      operationsApplied.push(`Removed duplicate lines (${removedCount} line${removedCount !== 1 ? 's' : ''} removed)`);
    }
  }

  // Step 4b: Remove Duplicate Words
  if (config.removeDuplicateWords) {
    const before = result;
    const wordOptions = {
      caseSensitive: config.duplicateOptions?.caseSensitive ?? false,
      mode: config.duplicateOptions?.duplicateWordsMode ?? 'consecutive',
    };
    result = removeDuplicateWords(result, wordOptions);
    if (before !== result) {
      const removedWords = countDuplicateWords(before, wordOptions);
      operationsApplied.push(`Removed duplicate words (${removedWords} word${removedWords !== 1 ? 's' : ''} removed)`);
    }
  }

  // Step 5: Empty / Blank Lines
  if (config.removeEmptyLines) {
    const before = result;
    result = removeEmptyLines(result);
    if (before !== result) operationsApplied.push('Removed all empty lines');
  } else if (config.removeExtraBlankLines) {
    const before = result;
    result = removeExtraBlankLines(result);
    if (before !== result) operationsApplied.push('Collapsed extra blank lines');
  }

  // Step 6: Normalize Paragraph Breaks
  if (config.normalizeParagraphBreaks) {
    const before = result;
    result = normalizeParagraphBreaks(result);
    if (before !== result) operationsApplied.push('Normalized paragraph breaks');
  }

  // Step 7: Filter Characters and Emojis
  if (config.removeEmojis || config.removePunctuation || config.removeSpecialChars || config.removeNumbers) {
    const before = result;
    result = filterCharacters(result, {
      removeEmojis: config.removeEmojis,
      removePunctuation: config.removePunctuation,
      removeSpecialChars: config.removeSpecialChars,
      removeNumbers: config.removeNumbers,
    });
    if (before !== result) operationsApplied.push('Filtered emojis/characters');
  }

  // Step 8: Case Conversion
  if (config.caseConversion && config.caseConversion !== 'none') {
    const before = result;
    result = convertCase(result, config.caseConversion);
    if (before !== result) operationsApplied.push(`Converted case (${config.caseConversion})`);
  }

  // Step 9: Find and Replace
  let findReplaceMatches = 0;
  let findReplaceSearched = false;
  const shouldRunFindReplace = Boolean(
    config.findAndReplace && 
    config.findAndReplace.search &&
    config.findAndReplace.search.length > 0 &&
    (config.findAndReplaceActive || config.findAndReplace.search.trim().length > 0)
  );
  if (shouldRunFindReplace) {
    findReplaceSearched = true;
    const { result: replaced, matchCount } = findAndReplace(result, config.findAndReplace);
    findReplaceMatches = matchCount;
    if (matchCount > 0) {
      operationsApplied.push(`Replaced ${matchCount} occurrence${matchCount !== 1 ? 's' : ''}`);
      result = replaced;
    }
  }

  // Step 10: Trim Leading and Trailing Whitespace of entire document
  if (config.trimLeadingTrailing) {
    const before = result;
    result = trimLeadingTrailing(result);
    if (before !== result) operationsApplied.push('Trimmed document whitespace');
  }

  return {
    cleanedText: result,
    operationsApplied,
    findReplaceMatches,
    findReplaceSearched,
  };
}
