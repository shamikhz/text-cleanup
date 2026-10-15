import { describe, it, expect } from 'vitest';
import {
  normalizeLineEndings,
  trimLeadingTrailing,
  replaceRepeatedSpaces,
  trimEachLine,
  removeExtraBlankLines,
  removeEmptyLines,
  normalizeParagraphBreaks,
  removeDuplicateLines,
  removeDuplicateWords,
  countDuplicateWords,
  convertCase,
  filterCharacters,
  findAndReplace,
  processText,
  DEFAULT_PRESETS,
} from './textProcessors';
import { calculateTextStats } from './textStats';

describe('Whitespace and Line Cleanup', () => {
  it('normalizes Windows (CRLF) and legacy Mac (CR) line endings to LF', () => {
    const input = 'Line 1\r\nLine 2\rLine 3\nLine 4';
    expect(normalizeLineEndings(input)).toBe('Line 1\nLine 2\nLine 3\nLine 4');
  });

  it('trims leading and trailing whitespace from the document', () => {
    expect(trimLeadingTrailing('   hello world \t \n')).toBe('hello world');
    expect(trimLeadingTrailing('')).toBe('');
    expect(trimLeadingTrailing('   ')).toBe('');
  });

  it('replaces repeated horizontal spaces with a single space while keeping newlines', () => {
    const input = 'Hello     world! \t\t How   are   you?\nSecond   line.';
    const expected = 'Hello world! How are you?\nSecond line.';
    expect(replaceRepeatedSpaces(input)).toBe(expected);
  });

  it('trims leading and trailing whitespace from each line independently', () => {
    const input = '   alpha   \n\t beta \t\n   gamma   ';
    expect(trimEachLine(input)).toBe('alpha\nbeta\ngamma');
  });

  it('removes extra blank lines and collapses them to a single blank line', () => {
    const input = 'Para 1\n\n\n\n\nPara 2\n\nPara 3';
    expect(removeExtraBlankLines(input)).toBe('Para 1\n\nPara 2\n\nPara 3');
  });

  it('removes all empty and whitespace-only lines', () => {
    const input = 'Line 1\n   \n\t\nLine 2\n\nLine 3';
    expect(removeEmptyLines(input)).toBe('Line 1\nLine 2\nLine 3');
  });

  it('normalizes paragraph breaks without merging paragraph blocks', () => {
    const input = 'Para 1 line 1\nPara 1 line 2\n\n\nPara 2 line 1\nPara 2 line 2';
    expect(normalizeParagraphBreaks(input)).toBe('Para 1 line 1 Para 1 line 2\n\nPara 2 line 1 Para 2 line 2');
  });
});

describe('Duplicate Line Removal', () => {
  it('removes duplicate lines preserving the first occurrence', () => {
    const input = 'Apple\nBanana\nApple\nCherry\nBanana\nDate';
    expect(removeDuplicateLines(input)).toBe('Apple\nBanana\nCherry\nDate');
  });

  it('supports case-sensitive vs case-insensitive matching', () => {
    const input = 'Apple\napple\nAPPLE\nBanana';
    expect(removeDuplicateLines(input, { caseSensitive: true })).toBe('Apple\napple\nAPPLE\nBanana');
    expect(removeDuplicateLines(input, { caseSensitive: false })).toBe('Apple\nBanana');
  });

  it('handles whitespace tolerance when comparing lines', () => {
    const input = '  Apple  \nApple\n\tApple\nBanana';
    expect(removeDuplicateLines(input, { ignoreWhitespace: true })).toBe('  Apple  \nBanana');
    expect(removeDuplicateLines(input, { ignoreWhitespace: false })).toBe('  Apple  \nApple\n\tApple\nBanana');
  });

  it('handles blank lines properly according to mode', () => {
    const input = 'A\n\n\nB\n\nC';
    expect(removeDuplicateLines(input, { blankLinesMode: 'dedupe' })).toBe('A\n\nB\nC');
    expect(removeDuplicateLines(input, { blankLinesMode: 'removeAll' })).toBe('A\nB\nC');
    expect(removeDuplicateLines(input, { blankLinesMode: 'keepAll' })).toBe('A\n\n\nB\n\nC');
  });
});

describe('Duplicate Word Removal', () => {
  it('removes consecutive duplicate words', () => {
    const input = 'This is is a test test of duplicate words words.';
    expect(removeDuplicateWords(input, { mode: 'consecutive' })).toBe('This is a test of duplicate words.');
  });

  it('supports case-sensitive vs case-insensitive word deduplication', () => {
    const input = 'The the apple Apple';
    expect(removeDuplicateWords(input, { mode: 'consecutive', caseSensitive: false })).toBe('The apple');
    expect(removeDuplicateWords(input, { mode: 'consecutive', caseSensitive: true })).toBe('The the apple Apple');
  });

  it('supports all duplicate words per line mode', () => {
    const input = 'apple orange banana apple grape banana';
    expect(removeDuplicateWords(input, { mode: 'allInLine', caseSensitive: false })).toBe('apple orange banana grape');
  });

  it('counts duplicate words accurately', () => {
    const input = 'the the the cat sat sat on the the mat';
    expect(countDuplicateWords(input, { mode: 'consecutive' })).toBe(4);
  });
});

describe('Case Conversion', () => {
  it('converts to UPPERCASE and lowercase with Unicode support', () => {
    const input = 'Café München Straße 日本語';
    expect(convertCase(input, 'uppercase')).toBe('CAFÉ MÜNCHEN STRASSE 日本語');
    expect(convertCase(input, 'lowercase')).toBe('café münchen straße 日本語');
  });

  it('converts to Sentence case correctly across punctuation and newlines', () => {
    const input = 'hello world. how are you? i am fine! new line here.';
    const result = convertCase(input, 'sentence');
    expect(result).toBe('Hello world. How are you? I am fine! New line here.');
  });

  it('converts to Title Case respecting minor words', () => {
    const input = 'the lord of the rings and a tale of two cities';
    expect(convertCase(input, 'title')).toBe('The Lord of the Rings and a Tale of Two Cities');
  });
});

describe('Emoji and Character Filtering', () => {
  it('removes emojis while preserving letters, numbers, and accents', () => {
    const input = 'Hello 🚀 World! 😃🎉 Test: café 123 🌟';
    expect(filterCharacters(input, { removeEmojis: true })).toBe('Hello  World!  Test: café 123 ');
  });

  it('removes punctuation while keeping letters and numbers', () => {
    const input = 'Hello, world! (How are you?) "Fine", she said.';
    expect(filterCharacters(input, { removePunctuation: true })).toBe('Hello world How are you Fine she said');
  });

  it('removes special symbols (math, currency, shapes)', () => {
    const input = 'Cost is $100 ± 5€ with symbol © and ★.';
    expect(filterCharacters(input, { removeSpecialChars: true })).toBe('Cost is 100  5 with symbol  and .');
  });

  it('removes numbers when requested', () => {
    const input = 'Room 402 on 5th avenue 2026';
    expect(filterCharacters(input, { removeNumbers: true })).toBe('Room  on th avenue ');
  });
});

describe('Find and Replace', () => {
  it('performs literal search and replace safely without regex injection', () => {
    const input = 'Price is $10.00 and $10.00 total.';
    const result = findAndReplace(input, {
      search: '$10.00',
      replace: '$15.00',
      caseSensitive: true,
      matchAll: true,
    });
    expect(result.result).toBe('Price is $15.00 and $15.00 total.');
    expect(result.matchCount).toBe(2);
  });

  it('supports case-insensitive search', () => {
    const input = 'Foo foo FOO bar';
    const result = findAndReplace(input, {
      search: 'foo',
      replace: 'baz',
      caseSensitive: false,
      matchAll: true,
    });
    expect(result.result).toBe('baz baz baz bar');
    expect(result.matchCount).toBe(3);
  });

  it('supports single occurrence replacement', () => {
    const input = 'cat cat cat';
    const result = findAndReplace(input, {
      search: 'cat',
      replace: 'dog',
      caseSensitive: true,
      matchAll: false,
    });
    expect(result.result).toBe('dog cat cat');
    expect(result.matchCount).toBe(3);
  });

  it('safely handles replacement strings with literal dollar signs and backreferences', () => {
    const input = 'item costs amount dollars';
    const result = findAndReplace(input, {
      search: 'amount',
      replace: '$100.00 & $1',
      caseSensitive: true,
      matchAll: true,
      isRegex: false,
    });
    expect(result.result).toBe('item costs $100.00 & $1 dollars');
  });
});

describe('Deterministic Processing Pipeline & Presets', () => {
  it('applies Quick Clean preset correctly', () => {
    const preset = DEFAULT_PRESETS.find(p => p.id === 'quick-clean');
    const input = '   Line 1    with    spaces   \r\n\n\n   Line 2   \r\n';
    const output = processText(input, preset.config);
    expect(output.cleanedText).toBe('Line 1 with spaces\n\nLine 2');
    expect(output.operationsApplied.length).toBeGreaterThan(0);
  });

  it('applies Remove Duplicate Lines preset correctly', () => {
    const preset = DEFAULT_PRESETS.find(p => p.id === 'remove-duplicates');
    const input = 'Apple\n  banana  \nApple\nBANANA\nCherry';
    const output = processText(input, preset.config);
    expect(output.cleanedText).toBe('Apple\nbanana\nCherry');
  });

  it('handles empty input gracefully without errors', () => {
    expect(processText('').cleanedText).toBe('');
    expect(processText(null).cleanedText).toBe('');
    expect(processText(undefined).cleanedText).toBe('');
  });

  it('handles very large text predictably', () => {
    const longText = 'Line of repetitive content with   extra   spaces\n'.repeat(5000);
    const output = processText(longText, {
      normalizeLineEndings: true,
      trimLeadingTrailing: true,
      replaceRepeatedSpaces: true,
      trimEachLine: true,
      removeDuplicateLines: true,
      duplicateOptions: { caseSensitive: true, ignoreWhitespace: true, preserveFirst: true, blankLinesMode: 'dedupe' }
    });
    expect(output.cleanedText).toBe('Line of repetitive content with extra spaces');
  });
});

describe('Text Statistics Calculation', () => {
  it('computes accurate counts for words, characters, lines, and paragraphs', () => {
    const text = 'First paragraph with some words.\n\nSecond paragraph has two lines.\nStill second paragraph.';
    const stats = calculateTextStats(text);

    expect(stats.words).toBe(13);
    expect(stats.characters).toBe(text.length);
    expect(stats.charactersNoSpaces).toBe(text.replace(/\s/g, '').length);
    expect(stats.lines).toBe(4);
    expect(stats.paragraphs).toBe(2);
    expect(stats.readingTime).toBeDefined();
  });

  it('handles empty text correctly (all zeros)', () => {
    const stats = calculateTextStats('');
    expect(stats.words).toBe(0);
    expect(stats.characters).toBe(0);
    expect(stats.charactersNoSpaces).toBe(0);
    expect(stats.lines).toBe(0);
    expect(stats.paragraphs).toBe(0);
    expect(stats.readingTime).toBe('0 min');
  });

  it('handles single line without inflating paragraph count', () => {
    const stats = calculateTextStats('Hello world');
    expect(stats.paragraphs).toBe(1);
    expect(stats.lines).toBe(1);
    expect(stats.words).toBe(2);
  });

  it('handles multilingual text accurately', () => {
    const text = 'Bonjour le monde! こんにちは世界. Спасибо!';
    const stats = calculateTextStats(text);
    expect(stats.characters).toBe(Array.from(text).length);
    expect(stats.words).toBeGreaterThan(0);
  });
});
