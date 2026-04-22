# Architecture

## Overview

Next.js 13 Pages Router blog with MDX content, Algolia search, and an OpenAI chatbot. Deployed on Vercel.

## Content Pipeline

Blog posts are `.md`/`.mdx` files in `data/blog/` with YAML frontmatter. At build time, `lib/mdx.js` processes them
through `mdx-bundler` with remark plugins (GFM, math, footnotes, code titles, image-to-JSX) and rehype plugins (slug,
autolink-headings, KaTeX, Prism highlighting, citation, minify).

Category normalization is handled by `normalizeCategory()` in `lib/mdx.js` — a shared helper used by `getFileBySlug`,
`getAllFilesFrontMatter`, and `getAllCategories` in `lib/categories.js`. Categories in frontmatter can be strings or
arrays; the normalizer converts separators (`/`, `,`, `>`) to dots and always returns an array.

## State Management

Global UI state uses React Context (`components/ContextProvider.js`) with `useReducer` (`lib/reducer.js`). State shape:

| Key             | Type    | Purpose                        |
| --------------- | ------- | ------------------------------ |
| `blogPostMeta`  | object  | Current post's frontmatter     |
| `showModal`     | boolean | Keyboard shortcuts modal       |
| `listPosition`  | number  | Keyboard nav cursor position   |
| `keyboardMode`  | boolean | Whether keyboard nav is active |
| `keyboardHints` | boolean | Show keyboard hint overlays    |
| `searchVisible` | boolean | Search UI visibility           |

## Search

- **Primary:** Algolia with `@algolia/autocomplete-js` (`components/AutoComplete.js`)
- **Fallback:** Fuse.js client-side search (no external calls)
- **Build-time indexing:** `scripts/searchCache.js` reads all posts and uploads to Algolia

## Chatbot

The `/chat` page sends queries to two edge API routes:

1. `/api/search` — generates an OpenAI embedding for the query, searches Supabase for similar blog chunks
2. `/api/answer` — sends matched chunks + query to OpenAI for a streamed response

Both routes use the server-side `OPENAI_API_KEY` environment variable.

## Production Optimizations

- Preact replaces React on the client side (`next.config.js` webpack aliases)
- SVGs imported as React components via `@svgr/webpack`
- Pre-commit hooks (Husky + lint-staged) enforce ESLint + Prettier
