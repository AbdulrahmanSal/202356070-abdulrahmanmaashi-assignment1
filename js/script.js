/* =========================================================
   script.js
   Five features, each in its own function:
     1. Theme toggle (light / dark, remembered between visits)
     2. Greeting that changes with the time of day
     3. Nav link highlighting as you scroll
     4. Project screenshot lightbox (click to view full size)
     5. Contact form validation
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  setUpThemeToggle();
  setGreeting();
  highlightNavOnScroll();
  setUpContactForm();
  setUpLightbox();
});

/* ---------- 1. Theme toggle ---------- */
function setUpThemeToggle() {
  var button = document.getElementById('theme-toggle');
  var label = document.getElementById('theme-toggle-label');
  if (!button || !label) return;

  // The inline script in index.html may already have applied a saved theme.
  // If it did not, fall back to whatever the operating system prefers.
  var current = document.documentElement.getAttribute('data-theme');
  if (!current) {
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    current = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', current);
  }
  paint(current);

  button.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'light'
      : 'dark';

    document.documentElement.setAttribute('data-theme', next);
    paint(next);

    // Storage can throw in private browsing, so the write is guarded.
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      /* The theme still applies for this visit; it just is not remembered. */
    }
  });

  // The button label names the theme you would switch TO, not the current one.
  function paint(theme) {
    var isDark = theme === 'dark';
    label.textContent = isDark ? 'Light' : 'Dark';
    button.setAttribute('aria-pressed', String(isDark));
  }
}

/* ---------- 2. Time-of-day greeting ---------- */
function setGreeting() {
  var target = document.getElementById('greeting');
  if (!target) return;

  var hour = new Date().getHours();
  var greeting;

  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  target.textContent = greeting + ' — welcome to my portfolio.';
}

/* ---------- 3. Nav highlighting ---------- */
function highlightNavOnScroll() {
  var links = document.querySelectorAll('.nav__list a');
  if (!links.length || !('IntersectionObserver' in window)) return;

  // Map each section id to its nav link so lookups are cheap while scrolling.
  var linkFor = {};
  var sections = [];

  links.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (!section) return;
    linkFor[id] = link;
    sections.push(section);
  });

  // rootMargin pushes the trigger line to the middle of the viewport, so a
  // section counts as "current" once it reaches the middle of the screen.
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (link) { link.classList.remove('is-active'); });
      var active = linkFor[entry.target.id];
      if (active) active.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(function (section) { observer.observe(section); });
}

/* ---------- 4. Project screenshot lightbox ---------- */
function setUpLightbox() {
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightbox-image');
  var closeButton = lightbox ? lightbox.querySelector('.lightbox__close') : null;
  var thumbnails = document.querySelectorAll('.project__image');
  if (!lightbox || !lightboxImage || !thumbnails.length) return;

  var lastFocused = null;

  thumbnails.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      open(thumb.src, thumb.alt);
    });
  });

  closeButton.addEventListener('click', close);
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) close(); // Click on the backdrop closes it.
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !lightbox.hidden) close();
  });

  function open(src, alt) {
    lastFocused = document.activeElement;
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.hidden = false;
    closeButton.focus();
    document.body.style.overflow = 'hidden'; // Stop the page scrolling behind it.
  }

  function close() {
    lightbox.hidden = true;
    lightboxImage.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus(); // Return focus to the thumbnail that was clicked.
  }
}

/* ---------- 5. Contact form ---------- */
function setUpContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var fields = [
    { input: document.getElementById('name'),    error: document.getElementById('name-error') },
    { input: document.getElementById('email'),   error: document.getElementById('email-error') },
    { input: document.getElementById('message'), error: document.getElementById('message-error') }
  ];

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // No backend: the page must not reload.

    var firstInvalid = null;
    status.textContent = '';

    fields.forEach(function (field) {
      var problem = validate(field.input);
      field.error.textContent = problem;
      field.input.classList.toggle('is-invalid', Boolean(problem));
      if (problem && !firstInvalid) firstInvalid = field.input;
    });

    if (firstInvalid) {
      firstInvalid.focus(); // Send the keyboard straight to the first problem.
      return;
    }

    form.reset();
    status.textContent = 'Thanks — your message looks good. I will reply soon.';
  });

  // Clear a field's error as soon as the person fixes it.
  fields.forEach(function (field) {
    field.input.addEventListener('input', function () {
      if (!field.error.textContent) return;
      if (!validate(field.input)) {
        field.error.textContent = '';
        field.input.classList.remove('is-invalid');
      }
    });
  });

  // Returns an error message, or an empty string when the value is fine.
  function validate(input) {
    var value = input.value.trim();

    if (!value) {
      return 'Enter your ' + input.name + '.';
    }
    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return 'Enter an email address like name@example.com.';
    }
    if (input.name === 'message' && value.length < 10) {
      return 'Add a little more detail — at least 10 characters.';
    }
    return '';
  }
}
