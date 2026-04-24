# Migration Guide: Next.js 15 + React 19 + Tailwind v4

This document records the major dependency upgrade performed in April 2026 and serves as a
reference for future upgrades.

## Version Changes

| Package           | Before    | After | Notes                                       |
| ----------------- | --------- | ----- | ------------------------------------------- |
| Next.js           | 13.5      | 15.5  | Pages Router retained                       |
| React             | 18        | 19    |                                             |
| React DOM         | 18        | 19    |                                             |
| Tailwind CSS      | 3.3       | 4.0   | Config moved from JS to CSS `@theme`        |
| mdx-bundler       | 8         | 10    | `xdmOptions` renamed to `mdxOptions`        |
| ESLint            | 7         | 8     |                                             |
| Prettier          | 2         | 3     |                                             |
| TypeScript        | 4         | 5     |                                             |
| rehype-prism-plus | 1         | 2     |                                             |
| remark-gfm        | 3         | 4     | Now ESM-only                                |
| remark-math       | 5         | 6     | Now ESM-only                                |
| mousetrap         | (reakeys) | 1.6.5 | Replaced reakeys; see keyboard-shortcuts.md |

## Removed Dependencies

| Package              | Reason                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------ |
| preact               | React 19 is fast enough; Preact swap caused issues                                         |
| reakeys              | Broke in v2 (engine changed from Mousetrap to ctrl-keys); replaced with mousetrap directly |
| remark-footnotes     | Superseded by remark-gfm v4 which includes footnotes                                       |
| rehype-preset-minify | Caused build errors with newer rehype ecosystem                                            |
| openai / supabase    | Chatbot feature removed                                                                    |

## Removed Features

- **Chatbot** (`pages/chat.tsx`, `pages/api/answer.ts`, `pages/api/search.ts`, `scripts/scrape.ts`,
  `scripts/embed.ts`, `utils/chat.ts`, `types/chat.ts`) -- entire feature removed along with
  OpenAI and Supabase dependencies.
- **Preact production swap** -- the `next.config.js` webpack aliases that replaced React with Preact
  in production builds were removed. React 19 is performant enough without this optimization.

## Step-by-Step Migration Process

### 1. Tailwind CSS v3 to v4

This was the most involved change. Tailwind v4 replaces the JavaScript config file with CSS-based
configuration using `@theme` directives.

**What changed:**

1. Deleted `tailwind.config.js` (231 lines of JS config)
2. Updated `postcss.config.js` to use `@tailwindcss/postcss` instead of `tailwindcss` and `autoprefixer`
3. Moved all theme configuration into `css/tailwind.css` using `@theme { }` blocks
4. Added `@custom-variant dark (&:where(.dark, .dark *));` for class-based dark mode
5. Changed `@import` syntax: `@import 'tailwindcss';` replaces `@tailwind base/components/utilities`
6. Added `@plugin` directives for `@tailwindcss/forms` and `@tailwindcss/typography`
7. Typography prose dark mode variables moved to CSS custom properties (`.prose { --tw-prose-* }`)

**Color migration:**

The old `tailwind.config.js` used `colors.neutral` aliased as `gray`. In v4, this was recreated
using OKLCh color values in the `@theme` block:

```css
@theme {
  --color-gray-50: oklch(0.985 0 0);
  --color-gray-100: oklch(0.97 0 0);
  /* ... through gray-950 */
}
```

**Dark mode:**

In Tailwind v3, dark mode was configured via `darkMode: 'class'` in `tailwind.config.js`. In v4,
this is replaced with a CSS custom variant:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

The `next-themes` library (with `attribute="class"`) toggles the `.dark` class on `<html>`,
which works the same as before.

### 2. Next.js 13 to 15

- `next.config.js`: replaced `experimental.serverComponentsExternalPackages` with `serverExternalPackages`
- Added Turbopack config for SVG loading (`turbopack.rules`)
- Removed Preact webpack aliases from production config
- `Image` component: `layout="fill"` prop replaced with `fill` boolean prop
- Dev server now uses Turbopack: `next dev --turbopack`

### 3. React 18 to 19

- `ReactDOM.render()` replaced with `createRoot()` in `components/AutoComplete.js`
- No other breaking changes -- the blog uses the Pages Router, which has a stable API

### 4. mdx-bundler 8 to 10

- Renamed `xdmOptions` to `mdxOptions` in `lib/mdx.js`
- Plugin imports updated to latest ESM versions

### 5. Keyboard shortcuts: reakeys to mousetrap

See `docs/keyboard-shortcuts.md` for full details. In short: reakeys v2 replaced its internal
Mousetrap engine with ctrl-keys, which broke all key sequences (`g g`, `g a`, `t t`, etc.) and
multi-key alternate bindings (`?`/`esc`/`q`). Replaced reakeys with mousetrap directly.

## Build Issues Encountered

### Infinite re-render loop

After the initial upgrade, the app hit an infinite re-render loop. Root cause: a component was
dispatching state updates unconditionally during render. Fixed by wrapping dispatches in `useEffect`.

### Hydration errors

React 19 is stricter about hydration mismatches. Fixed by ensuring server and client render
paths produce identical output (removed conditional rendering based on `typeof window`).

### CSS class ordering

Tailwind v4 with the Prettier plugin changed class ordering rules. Ran `prettier --write` across
all component files to normalize class order.

## Verification Checklist

After a major upgrade, verify:

1. `npm run dev` starts without errors
2. Homepage, blog posts, snippets, about, engineering pages all render
3. Dark mode toggle works (keyboard shortcut `t t` and button click)
4. Keyboard shortcuts modal opens with `?`
5. Key sequences work: `g a` (about), `g i` (posts), `g s` (snippets)
6. Algolia search opens with `/` or `cmd+k`
7. Code fences render with syntax highlighting (Prism xonokai theme)
8. Inline code has proper contrast in both light and dark modes
9. `npm run build` completes successfully
10. `npm run lint` passes
