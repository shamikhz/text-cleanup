/**
 * Visual Text Difference Generator
 * 
 * Computes additions, removals, and unchanged text segments
 * between the original and cleaned text.
 * Built to be lightweight and responsive even on large texts.
 */

/**
 * Computes word-level or line-level differences between two strings.
 * 
 * @param {string} original 
 * @param {string} cleaned 
 * @param {'words'|'lines'} [mode='lines']
 * @returns {Array<{ value: string, added?: boolean, removed?: boolean }>}
 */
export function computeDiff(original, cleaned, mode = 'lines') {
  if (original === cleaned) {
    return [{ value: cleaned, added: false, removed: false }];
  }

  // Safety threshold: For text > 40,000 chars, enforce line-level diff to prevent CPU lockup
  const effectiveMode = (original.length > 40000 || cleaned.length > 40000) ? 'lines' : mode;

  let tokens1, tokens2;

  if (effectiveMode === 'lines') {
    tokens1 = original.split('\n').map((l, i, arr) => i < arr.length - 1 ? l + '\n' : l);
    tokens2 = cleaned.split('\n').map((l, i, arr) => i < arr.length - 1 ? l + '\n' : l);
  } else {
    // Word-level tokenization preserving whitespace
    tokens1 = original.match(/(\s+|[^\s]+)/g) || [];
    tokens2 = cleaned.match(/(\s+|[^\s]+)/g) || [];
  }

  const n = tokens1.length;
  const m = tokens2.length;

  // Max diff matrix safety cap
  if (n * m > 4000000) {
    // If matrix is too large, fallback to chunked comparison or side-by-side indicator
    return [
      { value: original, removed: true },
      { value: cleaned, added: true }
    ];
  }

  // Standard DP for LCS
  // Optimize space: table of (n+1) x (m+1)
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (tokens1[i - 1] === tokens2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff chunks
  let i = n;
  let j = m;
  const rawDiff = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && tokens1[i - 1] === tokens2[j - 1]) {
      rawDiff.unshift({ value: tokens1[i - 1], added: false, removed: false });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawDiff.unshift({ value: tokens2[j - 1], added: true, removed: false });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      rawDiff.unshift({ value: tokens1[i - 1], added: false, removed: true });
      i--;
    }
  }

  // Consolidate adjacent chunks of identical type
  const consolidated = [];
  for (const part of rawDiff) {
    const last = consolidated[consolidated.length - 1];
    if (last && last.added === part.added && last.removed === part.removed) {
      last.value += part.value;
    } else {
      consolidated.push({ ...part });
    }
  }

  return consolidated;
}
