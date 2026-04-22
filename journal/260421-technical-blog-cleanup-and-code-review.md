# Technical Blog Cleanup and Code Review

**Date:** 2026-04-21 — 2026-04-22

## What happened

Transformed the mixed personal/technical blog into a purely technical blog and performed a comprehensive code review
that found 25 issues across all severity levels.

## Content changes

- Removed 139 non-technical blog posts (personal, faith, photography, sports, finance, book notes)
- Deleted category pages: sport, photographs, summaries, bible, books, finance, longform, math, meta, micro-saas
- Simplified category system: removed technical/non-technical filter toggle and dual-category support
- Modified 20 remaining posts to remove `non-technical` from their category fields

## Code review — 25 issues fixed

### Critical (3)

- **Async filter bug** in `getStaticPaths` — `Array.filter` with an `async` callback never excluded drafts because
  Promises are truthy. Fixed with `Promise.all` + `map` then filter.
- **User-supplied API key** — chat API routes forwarded visitor-supplied OpenAI keys. Changed to use server-side
  `OPENAI_API_KEY` env var.
- **Triple `getAllPosts()` call** in `searchCache.js` — read every blog file 3 times. Cached to a single call.

### High (7)

- Prop mutation in blog post page (spread copy instead of reference assignment)
- localStorage key mismatch in chat.tsx (saved as `JM_*`, read as `PG_*`) — removed with server-side key change
- Deleted dead code: `Search.js`, `RefinementList.js`, `NewsletterForm.js` (imported unlisted packages / referenced
  missing config)
- Fixed `ParentCategory.js` — replaced hardcoded `non-technical` check with generic hyphen-aware title casing
- Deduplicated `_app.js` — three identical layout branches collapsed to one with a conditional wrapper
- Moved Algolia credentials to env vars with hardcoded fallbacks

### Medium (10)

- Extracted `normalizeCategory()` shared helper in `lib/mdx.js` — replaced 3 copy-pasted blocks, fixed silent bug
  where array categories were `.map()`'d without capturing the return value
- Removed per-post RSS file write from `getStaticProps` (was writing N times during build)
- Cleaned `scrape.ts` — removed dead keyword skip list, replaced hardcoded date with `new Date()`
- Removed Node `path` module from client-side `PostLayout.js`
- Fixed `hiddden` typo (3 d's) in `LayoutWrapper.js`
- Fixed analytics `useEffect` dependency — changed `[router]` to `[router.asPath]`
- Consolidated 14 separate `useHotkeys` calls into one in `KeyboardShortcuts.js`
- Fixed `ctrl+k` handler logging `'ctrl+j'`
- Fixed `HOUSEKEEPING` calls passing objects to positional boolean params
- Fixed dead link in `engineeringPageData.ts` (`staff-eng` → `staff-engineer`)

### Low (5)

- Removed unused `getStaticProps` from `pages/index.js`
- Unhid `Footer.js` (had both `flex` and `hidden` classes)
- Deleted unused `lib/localStorage.js`
- Fixed `ContextProvider` state key mismatch (`postMetaData` → `blogPostMeta`)
- Replaced deprecated `substr` with `slice` in categories page

## Repo migration

- Created new GitHub repo `johnmathews/pro-blog` (public)
- Used `git-filter-repo` to scrub a PostHog example API key (`phc_...`) from git history
- Cleaned up remotes: `origin` now points to `pro-blog`

## Infrastructure added

- **Test framework:** Added vitest with 21 tests covering `normalizeCategory()` and the state reducer
- **Documentation:** Created `docs/architecture.md` covering content pipeline, state management, search, and chatbot
- Updated CLAUDE.md and README.md to reflect current state
