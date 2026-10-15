/**
 * Text Statistics Utility
 * 
 * Accurately calculates words, characters, lines, paragraphs, and reading time.
 * Documented Rules:
 * - Empty string returns 0 for all metrics.
 * - Words: Matches sequences of alphanumeric Unicode characters including contractions.
 * - Characters (with spaces): Full Unicode code point length.
 * - Characters (excluding whitespace): Total code points excluding all whitespace characters.
 * - Lines: Count of lines separated by line breaks. Empty string yields 0.
 * - Paragraphs: Non-empty blocks separated by one or more blank lines. Empty yields 0.
 * - Reading Time: Based on average adult reading speed of 200 words per minute.
 */

export function calculateTextStats(text) {
  if (!text || typeof text !== 'string') {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      lines: 0,
      paragraphs: 0,
      readingTime: '0 min',
      readingTimeSeconds: 0,
    };
  }

  // Unicode safe characters array
  const charsArray = Array.from(text);
  const characters = charsArray.length;

  // Characters without whitespace
  const noWhitespaceText = text.replace(/\s/gu, '');
  const charactersNoSpaces = Array.from(noWhitespaceText).length;

  // Word count: Unicode letters and digits
  const wordsMatches = text.trim().match(/[\p{L}\p{N}'’\-_]+/gu);
  const words = wordsMatches ? wordsMatches.length : 0;

  // Line count
  const lines = text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;

  // Paragraph count
  // Rule: Non-empty segments separated by one or more blank lines
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const paragraphs = normalized
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0).length;

  // Reading time
  const readingTimeSeconds = Math.round((words / 200) * 60);
  let readingTime = '< 1 min';
  if (words === 0) {
    readingTime = '0 min';
  } else if (readingTimeSeconds >= 60) {
    const mins = Math.floor(readingTimeSeconds / 60);
    const secs = readingTimeSeconds % 60;
    readingTime = secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
  } else if (readingTimeSeconds > 0) {
    readingTime = `${readingTimeSeconds} sec`;
  }

  return {
    words,
    characters,
    charactersNoSpaces,
    lines,
    paragraphs,
    readingTime,
    readingTimeSeconds,
  };
}
