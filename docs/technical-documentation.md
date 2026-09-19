# Technical Documentation

## Overview

A static, single-page site. Three files do the work: `index.html` holds the
content, `css/styles.css` holds every visual decision, and `js/script.js` adds
four behaviours. There is no build step, no bundler and no dependency other
than one web font.

| Layer | File | Responsibility |
| --- | --- | --- |
| Structure | `index.html` | Semantic sections, form markup, accessibility attributes |
| Presentation | `css/styles.css` | Design tokens, layout, both themes, media queries |
| Behaviour | `js/script.js` | Theme toggle, greeting, nav highlighting, validation |

---

## HTML structure

The page uses landmark elements so screen readers and browsers can navigate it:
`<header>` for the nav, `<main id="main">` for content, `<footer>` at the end.
Each content block is a `<section>` with an `id` that matches its nav link, and
every section begins with an `<h2>`, so the heading order never skips a level.

Accessibility details worth noting:

- A **skip link** is the first focusable element, jumping past the nav to `#main`.
- The theme button carries **`aria-pressed`**, which announces whether dark mode is on.
- Each input is tied to its error paragraph with **`aria-describedby`**, and those
  paragraphs use `role="alert"` so a new message is read out immediately.
- The form status uses `role="status"`, which announces politely without
  interrupting.
- The form is marked `novalidate` so the browser's own popups stay out of the
  way and the script can show consistent messages instead.

---

## CSS architecture

### Design tokens

All colours and key measurements are custom properties on `:root`. The dark
theme re-declares the same names under `[data-theme="dark"]`, so switching
themes changes one attribute on `<html>` and every component follows. No
component defines a colour of its own.

```css
:root          { --paper: #FDFDFC; --ink: #1B2430; --accent: #2F5D50; }
[data-theme="dark"] { --paper: #12171C; --ink: #E8ECEF; --accent: #7FBFA8; }
```

### Naming and specificity

Class names follow a block–element pattern (`.project`, `.project__title`,
`.project__tags`). Every selector is a single class, so specificity stays flat
and one rule never unexpectedly beats another. The only `!important` in the
file is inside the reduced-motion query, where overriding everything is the
intent.

### Layout

- **Grid** where the number of columns should adapt on its own:
  `repeat(auto-fit, minmax(17rem, 1fr))` gives the projects two columns on a
  desktop and one on a phone with no media query at all.
- **Flexbox** for one-dimensional rows: the nav, the hero buttons, the tag
  lists, the footer.
- **`clamp()`** for section padding and the hero name, so type and spacing
  scale smoothly between breakpoints instead of jumping.
- Text is capped at `68ch` (`--measure`) and the hero tagline at `34ch`, keeping
  line length in the readable range.

### Responsive breakpoints

| Width | Change |
| --- | --- |
| Above 48rem | Full layout: two-column About, multi-column projects |
| Up to 48rem (tablet) | About photo stacks above its text, photo shrinks to 120px |
| Up to 34rem (phone) | Inline nav links hidden, tagline drops to body size, skill rows stack |

On phones the nav links are hidden rather than collapsed into a hamburger menu.
The page is short, the hero buttons link into it, and a menu would have added
markup and script for little benefit at this size.

---

## JavaScript

Everything runs on `DOMContentLoaded` and each feature lives in its own
function. Each one looks up its elements first and returns early if they are
missing, so the page never throws if markup changes.

### 1. Theme toggle

The tricky part is the **flash of the wrong theme**. If the saved theme were
applied by `script.js`, the browser would paint the light page first and then
repaint dark. So a tiny inline script in `<head>` reads `localStorage` and sets
`data-theme` before the first paint. `script.js` then handles everything after
that: if no theme was saved it asks the OS via
`matchMedia('(prefers-color-scheme: dark)')`, updates the button, and writes the
new choice on each click.

Both storage calls are wrapped in `try/catch`, because `localStorage` throws
rather than returning `null` in some private-browsing modes. The button label
names the theme you would switch *to*, which is the convention most sites use.

### 2. Time-of-day greeting

Reads `new Date().getHours()` and picks morning (before 12), afternoon
(before 18) or evening. It uses the visitor's own clock, so the greeting is
correct wherever they are.

### 3. Nav highlighting

An `IntersectionObserver` watches all four sections. The
`rootMargin: '-45% 0px -45% 0px'` shrinks the observed area to a thin band
across the middle of the screen, so a section becomes "current" when it reaches
the middle rather than when it first peeks in at the bottom. This was the fix
for an early problem where two links lit up at once.

An observer is used instead of a scroll listener because the browser does the
work off the main thread — no scroll handler firing dozens of times a second.
If `IntersectionObserver` is missing, the function returns and the nav simply
stays unhighlighted.

### 4. Form validation

On submit, `preventDefault()` stops the page reloading (there is no backend),
then every field is checked and given its own message. Rules:

| Field | Rule |
| --- | --- |
| Name | Not empty after trimming |
| Email | Not empty, and matches `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` |
| Message | At least 10 characters |

If anything fails, focus moves to the first invalid input so a keyboard user
lands exactly where the problem is. Errors clear on `input` as soon as the
value becomes valid, rather than waiting for another submit.

The email pattern is deliberately loose. Fully validating an address by regex
is famously impractical, and a strict pattern rejects real addresses; the only
reliable check is sending mail. This one catches typos like a missing `@` or a
missing domain, which is all a front-end check should try to do.

---

## Performance

- No framework, no bundler, no dependencies to download besides one font.
- One CSS file and one JS file — two requests, both small.
- The font uses `preconnect` and `display=swap`, so text renders immediately in
  a fallback face instead of staying invisible.
- Images are SVG (a few hundred bytes each, sharp at any size) and below-the-fold
  ones use `loading="lazy"`.
- `width` and `height` are set on the profile image to reserve space and avoid
  layout shift.
- The script is loaded at the end of `<body>`, so parsing is never blocked.

---

## Browser compatibility

| Feature | Support | Behaviour if unsupported |
| --- | --- | --- |
| CSS custom properties | All current browsers | — |
| Grid / Flexbox | All current browsers | — |
| `IntersectionObserver` | All current browsers | Nav highlighting skipped, guarded by a feature check |
| `color-mix()` | 2023 onwards | Header falls back to a solid background |
| `backdrop-filter` | All current browsers | Header is opaque instead of blurred |

Tested by resizing in Chrome DevTools at 320px, 768px and 1440px, and in
Firefox and Safari.

---

## Known limitations and next steps

- The contact form has no backend, so a message is validated and then
  discarded. Connecting Formspree or Netlify Forms would be the next step.
- Project content is placeholder text and needs replacing with real work.
- There is no mobile menu; if more sections are added, one will be needed.
- No automated tests — checks were manual, across the three widths above.
