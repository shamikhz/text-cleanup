# TEXT CLEANUP STUDIO — PROJECT RULES

## 1. Technology Stack
- Use React, Vite, JavaScript, and Tailwind CSS.
- Use Lucide React for icons.
- Use browser APIs and localStorage only where appropriate.
- Use a suitable Vite PWA plugin (`vite-plugin-pwa`).
- Deploy to Cloudflare Pages.
- Do not introduce TypeScript, a backend, a database, authentication, AI APIs, or paid services unless explicitly requested.

## 2. Architecture
- Keep components small, reusable, and focused.
- Separate text-processing logic from UI components.
- Store reusable transformation functions in dedicated utility modules (`src/utils/textProcessors.js`, `src/utils/textStats.js`, `src/utils/diff.js`, `src/utils/storage.js`).
- Keep React state predictable and avoid unnecessary state duplication.
- Use a deterministic cleanup pipeline.
- Reuse tested functions instead of duplicating logic.
- Avoid unnecessary dependencies and abstractions.

## 3. Functional Correctness
- Every visible button and control must work.
- Never implement fake functionality or placeholder actions in production.
- Preserve the original text until the user explicitly changes or clears it.
- Apply only enabled cleanup rules.
- Use a documented, predictable transformation order.
- Preserve line ordering unless sorting is explicitly requested.
- Handle empty input, Unicode, multilingual text, emojis, and long input safely.
- Provide clear feedback for success, failure, and empty states.
- Never claim an operation succeeded when it failed.

## 4. UI/UX Standards
- Follow a mobile-first responsive design.
- Use a modern, minimal, professional visual style.
- Maintain consistent spacing, typography, borders, radii, and button sizes.
- Keep the main editor and Clean Text action prominent.
- Use side-by-side comparisons on desktop and stacked or tabbed comparisons on mobile.
- Keep advanced options collapsible.
- Avoid unnecessary animations, excessive gradients, cluttered dashboards, and decorative elements.
- Include loading, empty, error, success, and confirmation states where relevant.
- Never allow ads to obstruct the tool.

## 5. Accessibility
- Use semantic HTML.
- Associate labels with form controls.
- Ensure complete keyboard accessibility.
- Provide visible focus states and sufficient contrast.
- Use accessible live regions for important status messages.
- Respect reduced-motion preferences.
- Do not rely on color alone to communicate changes or errors.

## 6. Text Processing Rules
- Normalize line endings before line-based transformations.
- Keep transformations deterministic and independently testable.
- Make duplicate-line matching behavior explicit.
- Preserve the first duplicate occurrence by default.
- Avoid destructive character filtering by default.
- Preserve non-English writing systems wherever possible.
- Treat find-and-replace input as literal text unless advanced regex mode is explicitly enabled.
- Define word, character, line, paragraph, and reading-time calculations consistently.
- Make it possible to restore the original text.

## 7. State and Local Storage
- Store custom presets locally.
- Keep text history disabled by default.
- Never save input text silently.
- Allow users to disable history and delete individual or all saved entries.
- Limit storage size and handle storage failures.
- Validate stored data before using it.
- Do not transmit user text to external services.

## 8. Privacy and Security
- Perform text transformations entirely in the browser.
- Never inject user text as executable HTML.
- Avoid unsafe HTML rendering.
- Never include user text in URLs, logs, analytics, or error reports.
- Do not cache private text in service workers.
- Disclose third-party advertising and analytics behavior accurately.
- Never make absolute privacy claims that the implementation cannot support.

## 9. SEO, AEO, and GEO
- Use descriptive titles, meta descriptions, semantic headings, and accessible content.
- Implement canonical metadata, sitemap, robots.txt, and structured data where appropriate.
- Write original, useful explanations and FAQs.
- Keep important informational content crawlable.
- Avoid keyword stuffing, duplicate landing pages, and misleading structured data.
- Never guarantee search rankings or AI citations.
- Keep the application lightweight and fast.

## 10. Advertising
- Prepare for Google AdSense without inventing publisher IDs.
- Keep ads visually distinct from functional controls.
- Never encourage accidental clicks.
- Do not put ads between the main action and its result.
- Reserve layout space for configured ad slots.
- Follow applicable advertising, consent, and privacy requirements.
- Do not prioritize ad placement over usability.

## 11. PWA and Performance
- Keep core cleanup functionality fast and client-side where supported.
- Cache appropriate application assets only.
- Do not cache user text or third-party advertising responses.
- Minimize dependencies and unnecessary renders.
- Avoid layout shifts and large assets.
- Verify the production build and PWA configuration.

## 12. Keyboard Shortcuts
- Support Ctrl/Cmd + Enter to clean text.
- Support Ctrl/Cmd + Shift + C to copy cleaned text.
- Implement undo and clear shortcuts only when their behavior is reliable.
- Avoid intercepting normal typing, browser shortcuts, or unrelated form interactions.
- Display platform-appropriate shortcut labels.

## 13. Code Quality and Testing
- Use clear, descriptive names.
- Prefer readable, maintainable code over clever shortcuts.
- Avoid unnecessary abstractions and duplicated logic.
- Add tests for transformation utilities and edge cases.
- Test combinations of cleanup operations.
- Verify copying, downloading, comparison, presets, history, and keyboard shortcuts.
- Resolve build errors, lint issues where configured, and console errors.
- Do not mark incomplete features as complete.

## 14. Development Workflow
- Before changing files, inspect the existing project and relevant configuration.
- Implement features incrementally, validate them, and preserve existing working functionality.
- Do not replace working project configuration without a clear reason.
- After significant changes, run the relevant tests and production build.
- Document setup, testing, and Cloudflare Pages deployment.

## 15. Scope Control
- The application is a single-page, browser-based text utility.
- Do not add login, subscriptions, payment systems, backend services, AI integrations, or unrelated functionality without explicit approval.
- Prefer the smallest reliable solution that satisfies the requirements.
