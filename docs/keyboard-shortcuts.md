# Keyboard Shortcuts

How keyboard shortcuts are implemented, how to modify them, and the history behind
the current implementation.

## Architecture Overview

Keyboard shortcuts use [Mousetrap](https://craig.is/killing/mice) (v1.6.5), a standalone
JavaScript library for handling keyboard shortcuts. It supports single keys, modifier
combinations, and key sequences.

The implementation spans four files:

| File                                 | Purpose                                 |
| ------------------------------------ | --------------------------------------- |
| `components/KeyboardShortcuts.js`    | All shortcut bindings and callbacks     |
| `components/Modal.js`                | Shortcuts help overlay (press `?`)      |
| `data/keyboardShortcutsMenuItems.ts` | Menu items displayed in the modal       |
| `components/ContextProvider.js`      | State for keyboard mode / list position |
| `lib/reducer.js`                     | State reducer for keyboard actions      |

## How It Works

`KeyboardShortcuts.js` is rendered globally in `_app.js` (inside `ContextProvider`). It registers
all bindings via `Mousetrap.bind()` inside a `useEffect` hook, and unbinds them on cleanup.

Mousetrap attaches a single `keydown`/`keypress` listener to `document` and matches incoming keys
against registered bindings. It does NOT fire when the user is focused on an `<input>`,
`<textarea>`, or `<select>` element (built-in behavior).

### State management

Keyboard navigation state is managed through React Context (`AppContext`):

| State key       | Type    | Purpose                                         |
| --------------- | ------- | ----------------------------------------------- |
| `showModal`     | boolean | Whether the shortcuts modal is visible          |
| `keyboardMode`  | boolean | Whether keyboard list navigation is active      |
| `keyboardHints` | boolean | Whether keyboard hint badges are shown on cards |
| `listPosition`  | number  | Current selection index in post/card lists      |

Because Mousetrap callbacks run outside the React render cycle, the component uses a `useRef`
to access current state (e.g., `stateRef.current.showModal`) instead of reading directly from
the `state` variable, which would be stale due to closure capture.

## Current Shortcuts

### Single keys

| Key       | Action                   | Notes                          |
| --------- | ------------------------ | ------------------------------ |
| `j`       | Scroll down 200px        | Vim-style                      |
| `k`       | Scroll up 200px          | Vim-style                      |
| `tab`     | Toggle keyboard hints    | Shows shortcut badges on cards |
| `return`  | Open selected post       | Only when in keyboard mode     |
| `shift+g` | Scroll to bottom of page | Vim-style `G`                  |

### Modifier combinations

| Key      | Action                       |
| -------- | ---------------------------- |
| `/`      | Open search                  |
| `cmd+k`  | Open search (alternate)      |
| `ctrl+j` | Select next item in list     |
| `ctrl+k` | Select previous item in list |

### Alternate bindings (multiple keys, same callback)

| Keys            | Action                 |
| --------------- | ---------------------- |
| `?`, `esc`, `q` | Toggle shortcuts modal |

### Key sequences (press two keys in order)

| Sequence | Action                   | Page navigated to |
| -------- | ------------------------ | ----------------- |
| `t t`    | Toggle dark/light theme  | (stays on page)   |
| `g g`    | Scroll to top of page    | (stays on page)   |
| `n p`    | Go to next blog post     | Next post         |
| `p p`    | Go to previous blog post | Previous post     |
| `b f`    | Browser forward          | (history)         |
| `b b`    | Browser back             | (history)         |
| `g a`    | Go to About              | `/about`          |
| `g i`    | Go to Blog index         | `/posts`          |
| `g s`    | Go to Snippets           | `/snippets`       |
| `g e`    | Go to Experience         | `/experience`     |
| `g l`    | Go to Landing            | `/`               |
| `g m`    | Go to Metrics            | `/metrics`        |
| `g o`    | Go to Collections        | `/collections`    |
| `g p`    | Go to Projects           | `/projects`       |
| `c a`    | Go to Categories         | `/categories`     |
| `c e`    | Go to Engineering        | `/engineering`    |

## How to Add a New Shortcut

### 1. Add the binding in `KeyboardShortcuts.js`

Add a new entry to the `bindings` array inside the `useEffect`:

```javascript
{
  keys: 'g x',  // or ['key1', 'key2'] for alternates, or 'ctrl+x' for combos
  callback: (e) => {
    let data = JSON.stringify({ category: 'keyboard-shortcut', event: 'gx' })
    clientEventLogger(router.asPath, data)
    router.push('/new-page')
    HOUSEKEEPING()
  },
},
```

### 2. Add the menu item in `keyboardShortcutsMenuItems.ts`

Add to the appropriate category (`Actions` or `Pages`):

```typescript
{ item: 'gx', description: 'New Page' },
```

### 3. Key format reference (Mousetrap)

| Type       | Format       | Example                   |
| ---------- | ------------ | ------------------------- |
| Single key | `'x'`        | `'j'`, `'k'`, `'tab'`     |
| Modifier   | `'mod+x'`    | `'ctrl+j'`, `'command+k'` |
| Sequence   | `'x y'`      | `'g a'`, `'t t'`          |
| Alternates | `['x', 'y']` | `['?', 'escape', 'q']`    |
| Shift key  | `'shift+x'`  | `'shift+g'`               |

**Mousetrap key names:** `escape`, `tab`, `return`, `space`, `backspace`, `delete`,
`up`, `down`, `left`, `right`, `command` (Mac), `ctrl`, `shift`, `alt`, `meta`.

## How to Remove a Shortcut

1. Remove the entry from the `bindings` array in `KeyboardShortcuts.js`
2. Remove the corresponding item from `keyboardShortcutsMenuItems.ts`
3. If the shortcut navigated to a page that was removed, check for redirect in `next.config.js`

## Keyboard Navigation Mode

Some pages (blog index, collections) support keyboard-driven list navigation:

1. Press `ctrl+j` / `ctrl+k` to move selection up/down
2. The selected item gets a blue border highlight (via `keyboardMode` and `listPosition` state)
3. Press `return` to navigate to the selected item
4. Press `tab` to show keyboard hint badges on cards

This is implemented in `components/Card.js` and `components/PostsInYear.js`, which read
`state.keyboardMode` and `state.listPosition` from context to conditionally apply CSS classes.

## Analytics

All keyboard shortcuts log usage via `clientEventLogger()`, which sends a beacon to a Google
Cloud Function at `us-central1-johnmathews-website.cloudfunctions.net/client-event-logger`.

## History: reakeys to mousetrap

The blog originally used Mousetrap directly (commit `48eed3b`, 2022). During the Next.js 13
upgrade (commit `c7812dd`), it was replaced with `reakeys` -- a React wrapper around Mousetrap.

In April 2026, the major dependency upgrade moved to `reakeys` v2.0.6, which silently replaced
its internal Mousetrap engine with `ctrl-keys`. This broke:

1. **Key sequences** (`g a`, `t t`, etc.) -- ctrl-keys doesn't support Mousetrap-style
   space-separated sequences
2. **Alternate bindings** (`['?', 'esc', 'q']`) -- ctrl-keys treated arrays as sequential
   key chords rather than alternate bindings
3. **Non-printable keys** -- the default `keypress` event doesn't fire for `Escape`, `Tab`, etc.

The fix was to remove reakeys and use Mousetrap directly with a `useEffect` hook. This restores
the exact keyboard behavior from the original implementation while eliminating the unnecessary
abstraction layer.
