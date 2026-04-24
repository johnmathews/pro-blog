# CSS and Design

How styling works in this blog, how to modify it, and common pitfalls.

## CSS Architecture

All styling uses Tailwind CSS v4 with four CSS files loaded in `pages/_app.js`:

| File                | Purpose                                                  |
| ------------------- | -------------------------------------------------------- |
| `css/tailwind.css`  | Main styles: Tailwind config, prose, code blocks, layout |
| `css/prism.css`     | Syntax highlighting theme (xonokai / Monokai-based)      |
| `css/notebook.css`  | Jupyter notebook viewer styles                           |
| `css/algolia.css`   | Algolia autocomplete search UI                           |
| `css/analytics.css` | Homebrew analytics dashboard table styles                |

## Tailwind v4 Configuration

Tailwind v4 moved configuration from JavaScript to CSS. All theme values live in
`css/tailwind.css` inside `@theme { }` blocks.

### Key sections in `css/tailwind.css`

**Imports and plugins (lines 1-8):**

```css
@import 'tailwindcss';
@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";
```

**Dark mode variant (line 10):**

```css
@custom-variant dark (&:where(.dark, .dark *));
```

This enables `dark:` prefixed classes when the `<html>` element has class `dark`.
The `next-themes` library manages adding/removing this class.

**Theme values (lines 12-75):**
Breakpoints, fonts, spacing, colors. The color palette uses OKLCh for perceptual uniformity:

- `gray-50` through `gray-950` — neutral palette (replaces Tailwind's default gray)
- `primary-50` through `primary-950` — teal accent color

**Typography prose (lines 77-136):**
Custom CSS properties for the `@tailwindcss/typography` plugin. Defines text colors for
body, headings, links, code, etc. in both light mode (`--tw-prose-*`) and dark mode
(`--tw-prose-invert-*`). Because these custom properties are set explicitly on `.prose`,
Tailwind's `prose-invert` utility cannot override them. A separate `.dark .prose` block
(lines 118-135) swaps the active variables to their invert values for dark mode.

## Dark Mode

Dark mode uses class-based switching via `next-themes`:

1. `ThemeProvider` in `_app.js` with `attribute="class"` and `defaultTheme` from `siteMetadata.js`
2. `ThemeSwitch.tsx` component provides the toggle button (ID: `#themeSwitcher`)
3. Keyboard shortcut `t t` triggers the toggle via `simulateMouseClick`

### How to add dark mode styles

Use the `dark:` prefix on Tailwind classes:

```jsx
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
```

For CSS files, use the `.dark` selector:

```css
.dark .prose code {
  background-color: oklch(0.269 0 0); /* neutral-800 */
}
```

### Dark mode contrast requirements

All text-on-background combinations must meet **WCAG AA** contrast ratio (4.5:1 for normal text,
3:1 for large text). Key combinations to watch:

| Element     | Light mode                  | Dark mode                  |
| ----------- | --------------------------- | -------------------------- |
| Body text   | gray-700 on white           | gray-300 on gray-900 bg    |
| Headings    | gray-900 on white           | gray-100 on gray-900 bg    |
| Links       | primary-500 (teal) on white | primary-500 on gray-900 bg |
| Inline code | gray-800 on gray-200 bg     | gray-200 on gray-700 bg    |
| Code fences | Prism theme on slate-900 bg | Same (always dark)         |

### Inline code styling

Inline code (`<code>` not inside `<pre>`) is styled in two places:

1. **Prose plugin** (`css/tailwind.css` lines 147-159): `.prose code` and `.dark .prose code`
2. **Content container** (`css/tailwind.css` lines 233-237): `#contentContainer #content code`
   (more specific, overrides prose styling inside blog posts)

When modifying inline code colors, update both selectors and verify contrast in both modes.

## Code Fences / Syntax Highlighting

Code fences use `rehype-prism-plus` for syntax highlighting with the **xonokai** theme
(Monokai-inspired, defined in `css/prism.css`).

### Theme colors

| Token type       | Color      | Hex       |
| ---------------- | ---------- | --------- |
| Default text     | Cyan       | `#76d9e6` |
| Comments         | Olive      | `#6f705e` |
| Strings          | Yellow     | `#e6d06c` |
| Keywords         | Pink       | `#ef3b7d` |
| Numbers/booleans | Purple     | `#a77afe` |
| Selectors        | Green      | `#a6e22d` |
| Punctuation      | Light gray | `#bebec5` |

### Background

Code blocks always use a dark background regardless of light/dark mode:

```css
pre {
  @apply !bg-slate-900;
}
```

This is intentional -- syntax highlighting themes are designed for dark backgrounds.

### Line highlighting

The `rehype-prism-plus` plugin supports line highlighting, insertion, and deletion markers:

- Highlighted lines: gray background with blue left border
- Inserted lines: green-tinted background
- Deleted lines: red-tinted background
- Line numbers: `gray-400` text via `content: attr(line)`

## Fonts

Three font families are configured:

| Role  | Font(s)                    | Usage                   |
| ----- | -------------------------- | ----------------------- |
| Sans  | System UI stack            | Default body text       |
| Serif | Cardo, Georgia             | Blog post titles, dates |
| Mono  | Anonymous Pro, Andale Mono | Code blocks             |

Google Fonts (Cardo, Anonymous Pro) are loaded via `@import url()` in `css/tailwind.css`.
Inter font weights (400-800) are loaded via `@fontsource/inter` in `_app.js`.

## Layout Structure

The site uses a sidebar + main content layout:

```
LayoutWrapper
  +-- Sidebar (hidden on mobile, fixed on desktop)
  |     +-- Nav links
  |     +-- Search (Algolia autocomplete)
  |     +-- Theme toggle
  |     +-- Post metadata (when viewing a blog post)
  +-- Main content area
  +-- Footer
```

The sidebar is hidden on screens smaller than `lg` (1024px), replaced by `MobileNav`.

### Key layout CSS

The sidebar outer wrapper uses a custom class in `css/tailwind.css`:

```css
#sidebarOuterWrapper {
  @apply !hidden !flex-none lg:!block;
  @apply 3xl:ml-0 -mt-3 mr-5 w-1/6 md:ml-10 lg:ml-5 xl:ml-0 2xl:mr-20 2xl:w-1/12;
}
```

## Algolia Search Dark Mode

The Algolia autocomplete theme (`@algolia/autocomplete-theme-classic`) uses CSS variables
(`--aa-text-color-rgb`, `--aa-background-color-rgb`, etc.) that default to light-mode values.
These are overridden in `css/algolia.css` under a `.dark` selector.

The search button appears in three contexts, each with its own CSS rules in `algolia.css`:

| Context                   | CSS Selector Prefix             | Notes                                          |
| ------------------------- | ------------------------------- | ---------------------------------------------- |
| Sidebar (list/blog pages) | `#autoCompleteComponentWrapper` | Transparent background, matches sidebar        |
| Landing page              | `#landingListColumn`            | Left-aligned, transparent, matches nav styling |
| Mobile nav                | `#mobileNavLinks`               | Distinct background for mobile drawer          |

Because the Algolia theme applies colors via its own CSS variables and specificity, Tailwind
`dark:` utility classes alone cannot override them. The approach uses `!important` on explicit
`color` declarations within `.dark` ancestor selectors.

## Common Design Changes

### Changing the color scheme

1. Edit the `--color-primary-*` values in `css/tailwind.css` `@theme` block
2. Update `--tw-prose-links` and `--tw-prose-invert-links` in the `.prose` section
3. Update `.prose a:hover` and `.dark .prose a:hover` rules

### Changing the syntax highlighting theme

1. Replace `css/prism.css` with a new Prism theme file
2. The theme should be dark-themed (code blocks always use `bg-slate-900`)
3. Prism themes are available at https://github.com/PrismJS/prism-themes

### Changing fonts

1. Edit `@theme { --font-sans / --font-serif / --font-mono }` in `css/tailwind.css`
2. Add the font import (Google Fonts `@import` or `@fontsource` package)
3. If adding a Google Font, ensure the domain is in the CSP `font-src` directive in `next.config.js`

### Adding a breakpoint

Add to the `@theme` block:

```css
@theme {
  --breakpoint-3xl: 2000px; /* already exists */
  --breakpoint-4xl: 2400px; /* new */
}
```
