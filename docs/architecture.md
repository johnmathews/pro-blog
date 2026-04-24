# Architecture

## Overview

Next.js 15 (Pages Router) blog with MDX content, Algolia search, and keyboard-driven navigation.
Deployed on Vercel. Uses React 19 and Tailwind CSS v4.

## Content Pipeline

Blog posts are `.md`/`.mdx` files in `data/blog/` with YAML frontmatter. At build time, `lib/mdx.js`
processes them through `mdx-bundler` (v10) with remark plugins (GFM, math, code titles, image-to-JSX)
and rehype plugins (slug, autolink-headings, KaTeX, Prism highlighting, citation).

Category normalization is handled by `normalizeCategory()` in `lib/mdx.js` -- a shared helper used by
`getFileBySlug`, `getAllFilesFrontMatter`, and `getAllCategories` in `lib/categories.js`. Categories in
frontmatter can be strings or arrays; the normalizer converts separators (`/`, `,`, `>`) to dots and
always returns an array.

## State Management

Global UI state uses React Context (`components/ContextProvider.js`) with `useReducer` (`lib/reducer.js`).
State shape:

| Key             | Type    | Purpose                        |
| --------------- | ------- | ------------------------------ |
| `blogPostMeta`  | object  | Current post's frontmatter     |
| `showModal`     | boolean | Keyboard shortcuts modal       |
| `listPosition`  | number  | Keyboard nav cursor position   |
| `keyboardMode`  | boolean | Whether keyboard nav is active |
| `keyboardHints` | boolean | Show keyboard hint overlays    |
| `searchVisible` | boolean | Search UI visibility           |

## Keyboard Shortcuts

Implemented using [Mousetrap](https://craig.is/killing/mice) (v1.6.5) in `components/KeyboardShortcuts.js`.
Supports single keys, modifier combos, key sequences, and alternate bindings. See `docs/keyboard-shortcuts.md`
for full documentation.

## Search

- **Primary:** Algolia with `@algolia/autocomplete-js` (`components/AutoComplete.js`)
- **Fallback:** Fuse.js client-side search (no external calls)
- **Build-time indexing:** `scripts/searchCache.js` reads all posts and uploads to Algolia

## Styling

Tailwind CSS v4 with CSS-based configuration (`css/tailwind.css`). Dark mode uses class-based
switching via `next-themes`. See `docs/css-and-design.md` for full documentation.

Key CSS files:

- `css/tailwind.css` -- theme config, prose styles, layout utilities, code block styles
- `css/prism.css` -- xonokai syntax highlighting theme
- `css/algolia.css` -- search UI dark mode styles
- `css/notebook.css` -- Jupyter notebook viewer
- `css/analytics.css` -- metrics dashboard table

## Dev Server

Uses Turbopack for development: `next dev --turbopack`. SVG loading is configured for both
Turbopack (`turbopack.rules` in `next.config.js`) and webpack (production builds).

## Build Pipeline

```
next build → generate-sitemap.js → searchCache.js
```

1. Next.js statically generates all pages from MDX content
2. `generate-sitemap.js` creates the XML sitemap
3. `searchCache.js` builds the Algolia search index from post content

## Key Files

| File                          | Purpose                                         |
| ----------------------------- | ----------------------------------------------- |
| `data/siteMetadata.js`        | Global site config (CommonJS `module.exports`)  |
| `lib/mdx.js`                  | MDX bundling, frontmatter parsing, file listing |
| `pages/_app.js`               | Theme setup, global state, layout wrapper       |
| `next.config.js`              | Security headers, image domains, redirects      |
| `scripts/searchCache.js`      | Algolia index builder                           |
| `scripts/generate-sitemap.js` | XML sitemap generator                           |
| `css/tailwind.css`            | Tailwind v4 theme and custom styles             |
| `postcss.config.js`           | PostCSS with `@tailwindcss/postcss`             |

## Routing

- `pages/blog/[...slug].js` -- catch-all route for individual blog posts
- `pages/*.js` -- collection/category pages (posts, engineering, snippets, etc.)
- `pages/index.js` -- landing page (uses different layout, no sidebar)

## Layout Components

In `layouts/`:

- `PostLayout` -- individual blog posts with sidebar metadata
- `ListLayout` -- paginated post lists
- `SnippetLayout` / `SnippetCardLayout` -- snippet display
- `AboutPageLayout` -- about page
- `ExperienceLayout` -- experience/CV page

Posts select their layout via the frontmatter `layout` field.

## Testing

- Framework: Vitest (`npm run test`)
- Tests cover: category normalization (`normalizeCategory()`) and state reducer
- Linting: ESLint + Prettier with pre-commit hook (Husky + lint-staged)
