# Text Cleanup Studio

A production-ready, mobile-first, client-side web application for cleaning, formatting, deduplicating, and normalizing messy text.

Built with **React**, **Vite**, **Tailwind CSS**, and **Lucide React**. All text transformations execute 100% locally in the browser with **zero server uploads**, complete privacy, PWA support, and sub-millisecond execution.

---

## 🌟 Key Features

### 1. Text Editor & Controls
- Large original input textarea and cleaned output panel.
- Fast action buttons: **Paste**, **Clear** (with safety confirmation), **Sample Text**, and **Select All**.
- Live character, word, and line count indicators.
- Non-destructive processing preserving the user's raw input.

### 2. Whitespace & Line Normalization
- **Trim Document Whitespace:** Remove leading and trailing spaces from the document.
- **Collapse Repeated Spaces:** Replace multiple horizontal spaces/tabs with a single space.
- **Trim Each Line:** Strip unwanted spaces at the beginning and end of each line.
- **Collapse Extra Blank Lines:** Consolidate multiple blank lines into a single blank line.
- **Remove All Empty Lines:** Strip all empty or whitespace-only lines.
- **Normalize Line Endings:** Converts Windows (`\r\n`) and legacy Mac (`\r`) to clean Unix (`\n`).
- **Normalize Paragraph Breaks:** Condense wrapped paragraphs without unintentionally merging disjoint content blocks.

### 3. Duplicate Line Removal
- Eliminates duplicate lines while strictly preserving order and the first occurrence.
- Configurable **Case-sensitive** vs **Case-insensitive** matching.
- Option to **Ignore whitespace** when identifying line duplicates.
- Configurable **Blank lines treatment**:
  - `dedupe`: Retains only a single blank line.
  - `keepAll`: Retains all blank lines.
  - `removeAll`: Completely strips all blank lines.

### 4. Unicode Case Conversion
- `UPPERCASE` (Unicode aware)
- `lowercase` (Unicode aware)
- `Sentence case` (Capitalizes start of sentences across `.`, `?`, `!`, and newlines)
- `Title Case` (Capitalizes major words while preserving standard minor prepositions and conjunctions)

### 5. Emoji & Character Filtering
- **Emoji Removal:** Uses Unicode Extended Pictographic sequences (`\p{Extended_Pictographic}`) to safely strip emojis without affecting accents (é, ñ, ü, ç) or multilingual scripts.
- **Punctuation Removal:** Cleans out grammatical marks while preserving words and numbers.
- **Special Character Removal:** Strips math symbols, currency signs, and dingbats.
- **Number Removal:** Strips digits (0-9).

### 6. Literal & Safe Find & Replace
- Literal text replacement by default (prevents accidental regex injection).
- Case-sensitive toggle.
- Replace first occurrence or replace all occurrences.
- Optional safe regular expression mode.

### 7. Visual Difference Comparison
- Side-by-side on desktop, tabbed switcher on mobile devices.
- Visual diff highlighting **additions (green)** and **removals (red strikethrough)**.
- Toggle between word-level diff and line-level diff.

### 8. Text Statistics
- Documented calculation rules:
  - **Words:** Unicode word character matching.
  - **Characters (Total):** Full Unicode code point length.
  - **Characters (Excluding whitespace):** Character count with all spaces, tabs, and newlines removed.
  - **Lines:** Line break count.
  - **Paragraphs:** Distinct non-empty blocks separated by blank lines.
  - **Reading Time:** Calculated at 200 words per minute.
  - **Reduction percentage:** Visual badge showing net text reduction.

### 9. Custom Presets & Local History
- **5 Initial Presets:**
  1. *Quick Clean*
  2. *Remove Duplicate Lines*
  3. *Clean Blank Lines*
  4. *Content Formatting*
  5. *Remove Emojis*
- Save current configuration with custom name and description.
- Delete and reset presets to factory defaults.
- **Private Local History:**
  - Strictly **opt-in** (disabled by default for user privacy).
  - Stores up to 15 recent cleanup sessions solely in `localStorage`.
  - Restore or delete individual entries; clear-all action.

### 10. Keyboard Shortcuts
| Shortcut | Action |
| :--- | :--- |
| `Ctrl` / `⌘` + `Enter` | Clean Text |
| `Ctrl` / `⌘` + `Shift` + `C` | Copy Cleaned Result |
| `Ctrl` / `⌘` + `Shift` + `X` | Clear Input (with confirmation) |
| `Ctrl` / `⌘` + `Z` | Undo last edit action |
| `?` | Open Keyboard Shortcuts Dialog |
| `Esc` | Close active dialogs or drawer |

---

## 🔒 Privacy & Security Architecture

1. **Zero Server Uploads:** All processing runs locally within the browser JavaScript engine. No text ever leaves the user's machine.
2. **No Tracking Cookies:** No tracking pixels or external analytics scripts.
3. **Safe Storage:** Presets and optional history reside strictly on `localStorage`.
4. **Safe Rendering:** Text is rendered exclusively as plain text, never via `dangerouslySetInnerHTML`.

---

## 🚀 Cloudflare Pages Deployment

Text Cleanup Studio is configured for fast static deployment on Cloudflare Pages.

### Deployment Settings
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Build Output Directory:** `dist`
- **Root Directory:** `/` (or repository root)

### Pre-configured Cloudflare Files:
- `public/_redirects`: Provides SPA fallback (`/* /index.html 200`).
- `public/_headers`: Enforces strict security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`).

---

## 💻 Local Development & Testing

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node v24)
- npm `v9+` or `v11+`

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd "text cleanup"

# Install dependencies
npm install
```

### Running the Dev Server
```bash
npm run dev
```

### Running the Test Suite
```bash
npm run test
```
All 29 unit tests verify Unicode support, edge cases, duplicate removal, case conversion, and preset pipelines.

### Production Build
```bash
npm run build
npm run preview
```
