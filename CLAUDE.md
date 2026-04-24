# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog for johnmathews.is -- a Next.js 15 (Pages Router) application with MDX content, Algolia search, and
keyboard-driven navigation. Deployed on Vercel. Uses React 19 and Tailwind CSS v4.

## Commands

```bash
# Development
npm run dev          # Next.js dev server (Turbopack)
npm run start        # Dev server with socket.io hot reload for content changes in ./data

# Build (runs: next build -> generate sitemap -> update Algolia search index)
npm run build

# Lint (ESLint + Prettier with --fix)
npm run lint

# Test
npm run test         # Run vitest
npm run test:watch   # Run vitest in watch mode

# Auxiliary build steps
npm run aux              # Regenerate sitemap + search index without full build
npm run buildSearchIndex # Update Algolia index only
npm run buildSitemap     # Generate sitemap only

# Analysis
npm run analyze      # Bundle size analysis (sets ANALYZE=true)
```

## Architecture

### Content Pipeline

Blog posts live in `data/blog/` as `.md` and `.mdx` files with YAML frontmatter. The core content processing is in
`lib/mdx.js`, which uses `mdx-bundler` (v10) with a chain of remark plugins (GFM, math, code titles, image-to-JSX)
and rehype plugins (slug, autolink-headings, KaTeX, Prism syntax highlighting, citation). Posts are statically
generated at build time.

### Routing

- `pages/blog/[...slug].js` -- catch-all route for individual blog posts
- `pages/*.js` -- collection/category pages (posts, engineering, snippets, etc.)

### Layouts

Layout components in `layouts/` wrap page content: `PostLayout`, `ListLayout`, `SnippetLayout`, `SnippetCardLayout`,
`AboutPageLayout`, `ExperienceLayout`. Posts select their layout via frontmatter `layout` field.

### Key Files

- `data/siteMetadata.js` -- global site config (must remain CommonJS `module.exports`)
- `lib/mdx.js` -- MDX bundling, frontmatter parsing, file listing
- `pages/_app.js` -- theme setup, global state providers, layout wrapper
- `next.config.js` -- security headers, image domains, redirects, Turbopack SVG config
- `scripts/searchCache.js` -- builds Algolia index from post content
- `scripts/generate-sitemap.js` -- generates XML sitemap
- `css/tailwind.css` -- Tailwind v4 theme config, prose styles, code block styles

### State & Search

- React Context for UI state (keyboard navigation mode, filters)
- Primary search: Algolia with autocomplete UI
- Fallback search: Fuse.js (client-side, no external calls)

### Keyboard Shortcuts

Implemented with Mousetrap (v1.6.5) in `components/KeyboardShortcuts.js`. Supports single keys, modifier
combos (`ctrl+j`), and key sequences (`g a`). Press `?` to see the shortcuts modal.
See `docs/keyboard-shortcuts.md` for full documentation.

### Styling

Tailwind CSS v4 with CSS-based configuration (no `tailwind.config.js`). Theme values, colors, and typography
are defined in `css/tailwind.css` using `@theme` directives. Dark mode uses class-based switching via `next-themes`.
See `docs/css-and-design.md` for full documentation.

## Code Style

- Prettier: single quotes, no semicolons, 100 char width, Tailwind class sorting
- ESLint: `eslint-config-next` + `eslint-config-prettier`
- Pre-commit hook (Husky + lint-staged) auto-lints and formats staged files
- Mixed JS/TS codebase (mostly JS, strict mode disabled)
- Components: PascalCase filenames, default exports

## Post Frontmatter Schema

```yaml
title: string # required
date: string # ISO date
tags: [string]
category: string # "technical" or "technical.snippet"
draft: boolean # true excludes from build and sitemap
summary: string
layout: string # layout component name (e.g. "PostLayout")
```

## Node Version

Managed via `.nvmrc` (currently Node 22). Vercel reads this file for builds. Locally, use `nvm use` or `fnm use` to
match.

## Environment Variables

Required in `.env.local`:

- `ALGOLIA_ADMIN_API_KEY`, `ALGOLIA_INDEX_NAME` -- search indexing (used by `searchCache.js`)
- `NEXT_PUBLIC_ALGOLIA_APP_ID`, `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` -- client-side search (falls back to hardcoded defaults)

## Documentation

- `docs/architecture.md` -- system architecture overview
- `docs/migration-guide.md` -- dependency upgrade process and decisions
- `docs/css-and-design.md` -- CSS architecture, dark mode, design changes
- `docs/keyboard-shortcuts.md` -- keyboard shortcut implementation details
- `run-books/dependency-upgrade.md` -- step-by-step upgrade process
- `journal/` -- dated development journal entries
