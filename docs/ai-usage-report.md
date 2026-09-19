# AI Usage Report

## 1. Tools used and use cases

| Tool | Where I used it |
| --- | --- |
| Claude (Anthropic) | Scaffolding the initial site, debugging specific behaviours, adapting the README format, cropping and placing my real project screenshots, and drafting this report |

I gave Claude the assignment brief and asked it to build a first version of the
whole site — HTML structure, CSS, and JavaScript for the four required
sections plus the interactivity features. From there I worked through it
piece by piece rather than accepting the first version wholesale: I added my
real name and student ID, replaced the placeholder About/Projects/Skills
content with my actual background and projects from my CV, swapped in my own
profile photo and real project screenshots, and fixed a wrong email address
it had guessed for me.

## 2. Benefits and challenges

### Benefits

- **A working skeleton fast.** Getting semantic HTML, a responsive CSS grid,
  and four JS features in place quickly meant I spent my time reviewing and
  customising instead of typing boilerplate from scratch.
- **Explaining behaviour I didn't understand.** When I didn't follow why part
  of the code worked a certain way, I could ask directly and get a specific
  answer rather than searching through documentation myself.
- **Help with non-code parts.** It also handled asset work I would have found
  tedious by hand — converting my mismatched Windows XP wallpaper file to a
  proper JPEG, and cropping my three raw project screenshots (a documentation
  page, a two-chart composite, and a full app window) down to just the
  relevant region for each project card.

### Challenges

- **It guessed at details I hadn't given it.** It picked a plausible-looking
  KFUPM email address for my footer link that turned out to be wrong
  (`g20235070@...` instead of my real `s202356070@...`), and it flagged this
  itself as a guess rather than presenting it as fact — but I still had to
  catch and correct it.
- **A first draft of this report described a process I hadn't actually had.**
  When I first asked for an AI usage report, I got one built around invented
  example questions. It was flagged to me directly as not reflecting what
  actually happened, which is why I asked for it to be rewritten around the
  real conversation instead — this version.
- **Reviewing generated code takes real attention.** It would have been easy
  to accept the site as delivered without checking it. I had to specifically
  ask about two implementation details (below) before I understood why the
  code was written the way it was.

## 3. Learning outcomes

Two technical explanations stood out because they fixed real bugs in the
site, not hypothetical ones:

1. **Theme flash on reload.** The dark/light theme choice is saved in
   `localStorage`. If it were applied by the main `script.js` file at the
   bottom of the page, the browser would paint the light theme first and then
   flash to dark a moment later. The fix is a small script placed inline in
   `<head>`, which runs before the page paints anything and sets the
   `data-theme` attribute immediately. I hadn't considered that *where* a
   script sits in the document can itself cause a visible bug.

2. **Two nav links highlighting at once.** The scroll-based nav highlighting
   uses `IntersectionObserver`, which I assumed would mark exactly one
   section "active" at a time. In practice it fires whenever a section
   crosses into the viewport, so two adjacent sections can both count as
   visible at once. Adding `rootMargin: '-45% 0px -45% 0px'` narrows the
   trigger zone to a thin band across the middle of the screen, so only the
   section actually in the middle of the screen gets marked active.

I also asked about the email validation in the contact form, since I had
assumed a stricter regex would be better. I learned that fully validating an
email address by regex is impractical — strict patterns end up rejecting
real addresses — and that the only reliable check is actually sending mail.
The form's pattern is deliberately loose, catching obvious typos (a missing
`@` or domain) without pretending to guarantee the address is real.

On the workflow side, I learned that giving specific context produces much
better results than vague requests. Asking to review particular screenshots
and get exact crop guidance (what to capture for a JavaFX app, a Python
chart, and an FPGA waveform) worked far better than a general "make this
look nicer."

## 4. Responsible use and modifications

Everything generated was reviewed before it went into the repository:

- **Personal content is my own.** The About Me text, project descriptions,
  and skills list were rewritten from my actual CV, not left as invented
  placeholder text.
- **Screenshots are my real work**, not stock images: the JavaFX hotel
  booking app, the Lasso regression scatter plot, and the FPGA simulation
  waveform are all outputs from projects I built. Where a raw screenshot
  included things that didn't belong in a portfolio card — surrounding report
  text, an unrelated feature-importance table, empty error states — I decided
  what to keep and had it cropped to just that.
- **I corrected a factual error** (the guessed email address) rather than
  leaving it in.
- **I asked for and read explanations**, rather than pasting in code I
  couldn't account for, for both the theme-flash fix and the nav-highlighting
  bug described above.
- **This report was rewritten once already** specifically because the first
  version didn't reflect my real process — this version is built from the
  actual conversation, not a template.

**Understanding check.** I can explain, without looking anything up: why the
theme-setting script has to run from `<head>` rather than the bottom of the
page, what `rootMargin` does on the nav's `IntersectionObserver` and why it
needs to be negative, and why the contact form's email check is intentionally
loose rather than strict.
