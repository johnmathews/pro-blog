# Run Book: Major Dependency Upgrade

Step-by-step process for upgrading major dependencies (Next.js, React, Tailwind, etc.).

## Pre-flight

1. **Create a worktree or branch.** Never upgrade on main.

   ```bash
   git worktree add .worktrees/upgrade-branch -b upgrade-nextjs-XX
   cd .worktrees/upgrade-branch
   ```

2. **Record current state.** Take screenshots of key pages before changes:
   - Homepage, blog post (with code), snippets, about page
   - Both light and dark modes
   - Save as `before-*.png` for comparison

3. **Check what's outdated:**

   ```bash
   npm outdated
   ```

4. **Read changelogs** for every major version bump. Look for:
   - Breaking API changes
   - Renamed config options
   - Removed features
   - Internal engine changes (like reakeys switching from Mousetrap to ctrl-keys)

## Upgrade Process

### Order matters

Upgrade in this order to minimize cascading issues:

1. **Build tooling** (TypeScript, ESLint, Prettier) -- these affect everything
2. **Framework** (Next.js) -- the foundation
3. **React** -- depends on Next.js compatibility
4. **CSS** (Tailwind) -- affects all components
5. **Content pipeline** (mdx-bundler, remark/rehype plugins) -- affects blog posts
6. **Everything else** -- smaller libraries, one at a time

### For each upgrade

1. Install the new version
2. Check `npm run dev` starts
3. Check `npm run build` completes
4. Fix any compilation errors before moving to the next package

## Post-Upgrade Verification

### Must-pass checks

```bash
npm run dev          # Dev server starts
npm run build        # Production build completes
npm run lint         # No lint errors
npm run test         # Tests pass (if configured)
```

### Visual verification

Start the dev server and check each page:

| Page        | URL            | Check for                         |
| ----------- | -------------- | --------------------------------- |
| Homepage    | `/`            | Layout, images, links             |
| Blog index  | `/posts`       | Post list renders, dates correct  |
| Blog post   | `/blog/[any]`  | Content, code fences, inline code |
| Snippets    | `/snippets`    | Card layout, scroll behavior      |
| About       | `/about`       | Content renders                   |
| Engineering | `/engineering` | Post list                         |

For each page, check both light and dark modes.

### Feature verification

| Feature            | How to test                            |
| ------------------ | -------------------------------------- |
| Keyboard shortcuts | Press `?` for modal, `j`/`k` to scroll |
| Key sequences      | Press `g a` (about), `t t` (theme)     |
| Search             | Press `/` or `cmd+k`                   |
| Dark mode toggle   | Click sun/moon button or press `t t`   |
| Code highlighting  | View a blog post with code fences      |
| Inline code        | Verify contrast in both modes          |

### Dark mode contrast audit

After any CSS changes, verify text/background contrast:

1. Inline code in blog posts (most common issue)
2. Modal/overlay backgrounds and text
3. Sidebar text and links
4. Search UI components
5. Table headers and cells

Use browser DevTools "Color contrast" or an online contrast checker. Target WCAG AA:
4.5:1 for normal text, 3:1 for large text.

## Rollback

If the upgrade is too broken to fix:

```bash
# If using a worktree
cd /path/to/main-repo
git worktree remove .worktrees/upgrade-branch

# If on a branch
git checkout main
git branch -D upgrade-branch
```

The main branch remains untouched throughout.

## Common Pitfalls

1. **Peer dependency conflicts.** Use `--legacy-peer-deps` if React 19 peer deps
   haven't been updated by all packages yet.

2. **ESM-only packages.** Many remark/rehype plugins are now ESM-only. If you get
   `require() of ES Module` errors, check if the package needs dynamic `import()`.

3. **Tailwind v4 class ordering.** Run `npx prettier --write` with the Tailwind
   plugin after migration to normalize class order.

4. **Silent behavioral changes.** Libraries can change internal behavior without
   changing their API (see reakeys v2). Always test actual functionality, not just
   that the code compiles.

5. **Stale references.** After removing a feature (e.g., chatbot), search for
   remaining references: menu items, keyboard shortcuts, nav links, CLAUDE.md.
