# Keyboard Shortcuts Migration and Dark Mode Fixes

**Date:** 2026-04-24

## Context

Working in the `worktree-eng-major-upgrade` branch, which upgrades the blog from Next.js 13 /
React 18 / Tailwind v3 to Next.js 15 / React 19 / Tailwind v4. The layout and core functionality
were already working. This session focused on two areas: making keyboard shortcuts work again, and
fixing dark mode contrast issues.

## Keyboard shortcuts: reakeys v2 is broken

### Discovery

The keyboard shortcuts existed in the worktree code (`components/KeyboardShortcuts.js`) and used
`reakeys` v2.0.6. Testing in the browser revealed that only single-key bindings worked (`j`, `k`
for scrolling). Multi-key alternate bindings (`?`/`esc`/`q` for the modal) and key sequences
(`g a` to navigate to /about) were completely broken.

### Root cause

reakeys v2 replaced its internal keyboard engine from **Mousetrap** to **ctrl-keys**. This changed
how the `keys` array parameter is interpreted:

- **reakeys v1 (Mousetrap):** `keys: ['?', 'esc', 'q']` = three alternate bindings
- **reakeys v2 (ctrl-keys):** `keys: ['?', 'esc', 'q']` = three-key sequence (press `?` then
  `esc` then `q`)

Additionally, reakeys v2 defaults to the `keypress` event (deprecated), which doesn't fire for
non-printable keys like Escape.

The reakeys changelog had no mention of this breaking change. There are no GitHub releases or
CHANGELOG.md. The issue was only discoverable by reading the source code.

### Fix

Removed `reakeys` and installed `mousetrap` directly (v1.6.5). This is actually going back to
the original library -- the blog used Mousetrap directly before commit `c7812dd` introduced
reakeys as a React wrapper.

Rewrote `KeyboardShortcuts.js` to:

- Use `Mousetrap.bind()` / `Mousetrap.unbind()` inside a `useEffect` hook
- Use a `useRef` for accessing current state in callbacks (avoids stale closure problem)
- Fix the `n p` shortcut: was `keys: ['n', 'p']` (two separate bindings in v1), now correctly
  `'n p'` (Mousetrap sequence format)
- Fix `G` (capital G / shift+g): changed to `shift+g` for Mousetrap compatibility

### Verification

Tested all shortcut categories in the browser using Playwright:

- Single keys: `j` (scroll), `?` (modal), `q` (close modal) -- all working
- Sequences: `g a` (about), `g i` (posts), `t t` (theme toggle) -- all working
- Theme toggle correctly switches between dark and light modes

## Dark mode contrast fixes

### Inline code contrast (css/tailwind.css lines 233-237)

**Before:**

```css
#contentContainer #content code {
  @apply rounded-lg bg-gray-200 px-2 py-1 text-white dark:bg-gray-500;
}
#contentContainer #content .p code {
  @apply rounded-lg bg-gray-200 px-2 py-1 text-gray-800 dark:bg-gray-500 dark:text-gray-900;
}
```

Problems:

- `text-white` on `bg-gray-200` in light mode: white text on light gray (terrible contrast)
- `dark:text-gray-900` on `dark:bg-gray-500` in dark mode: ~2.5:1 contrast ratio (fails WCAG AA)

**After:**

```css
#contentContainer #content code {
  @apply rounded-lg bg-gray-200 px-2 py-1 text-gray-800 dark:bg-gray-700 dark:text-gray-200;
}
#contentContainer #content .p code {
  @apply rounded-lg bg-gray-200 px-2 py-1 text-gray-800 dark:bg-gray-700 dark:text-gray-200;
}
```

Both modes now have high-contrast text on background. The dark mode combination
(`gray-200` text on `gray-700` bg) exceeds WCAG AA requirements.

### Modal dark mode (components/Modal.js)

The keyboard shortcuts modal had hardcoded light-mode colors with no dark mode variants:

- `bg-gray-100` background, `text-gray-800` / `text-gray-900` text

Added dark mode classes throughout: `dark:bg-gray-800`, `dark:text-gray-100`,
`dark:border-slate-400`, `dark:bg-gray-600` for key badges.

### Stale menu item

Removed `gc` -> Chat entry from `keyboardShortcutsMenuItems.ts`. The chat page was removed
in the upgrade but the menu item reference remained.

## Tooling improvements

- **Coverage reporting**: Added `@vitest/coverage-v8` and `vitest.config.js` with v8 coverage
  provider. Coverage reports to `text` and `html` formats, scoped to `lib/` (pure logic modules).
  New script: `npm run test:coverage`.
- **Pre-commit hook**: Updated `.husky/pre-commit` to run `npm run test` after lint-staged.
  Commits now require both lint and test passes.

## Documentation created

- `docs/migration-guide.md` -- dependency upgrade process and decisions
- `docs/css-and-design.md` -- CSS architecture, dark mode, Prism theme, design changes
- `docs/keyboard-shortcuts.md` -- keyboard shortcut implementation, shortcut table, how-to guide
- `docs/architecture.md` -- updated for Next.js 15, React 19, Tailwind v4, mousetrap
- `run-books/dependency-upgrade.md` -- step-by-step upgrade verification process
- `CLAUDE.md` -- updated to reflect current state

## Files changed

| File                                 | Change                                           |
| ------------------------------------ | ------------------------------------------------ |
| `components/KeyboardShortcuts.js`    | Rewritten: reakeys -> mousetrap                  |
| `components/Modal.js`                | Added dark mode classes                          |
| `css/tailwind.css`                   | Fixed inline code contrast                       |
| `data/keyboardShortcutsMenuItems.ts` | Removed stale chat shortcut                      |
| `package.json`                       | Removed reakeys, added mousetrap, added coverage |
| `vitest.config.js`                   | New: coverage configuration                      |
| `.husky/pre-commit`                  | Added test run to pre-commit hook                |
| `docs/*`                             | New and updated documentation                    |
| `run-books/dependency-upgrade.md`    | New: upgrade runbook                             |

## Lessons learned

1. **Library upgrades can silently break features.** reakeys v2 had no changelog and no
   deprecation warnings. The API surface (function signatures, types) was identical -- only
   the internal engine changed. This kind of breakage is only caught by integration testing.

2. **Thin wrappers add risk.** reakeys was a thin React wrapper around Mousetrap. When its
   underlying engine changed, the wrapper's value proposition collapsed. Using Mousetrap
   directly with a `useEffect` hook is simpler and more predictable.

3. **Dark mode CSS needs systematic review.** The inline code contrast issue existed on the
   main branch too (pre-upgrade). Major CSS migrations are a good opportunity to audit all
   color combinations.
