const root = document.documentElement;
const themeToggles = document.querySelectorAll("[data-theme-toggle]");
const slideshowRoots = document.querySelectorAll("[data-slideshow]");
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --------------------------------------------
   Theme toggle
   -------------------------------------------- */
function applyTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  themeToggles.forEach((toggle) => {
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
    const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("title", label);
  });
}

applyTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

themeToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });
});

/* --------------------------------------------
   Snapshot slideshow (unchanged)
   -------------------------------------------- */
function shuffleArray(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function getRandomSlides(items, count) {
  if (!items.length) return [];
  const shuffled = shuffleArray(items);
  if (!count || count >= shuffled.length) return shuffled;
  return shuffled.slice(0, count);
}

async function discoverSlides() {
  const extensions = ["jpg", "jpeg", "png", "webp"];
  const discovered = [];
  let index = 1;
  while (true) {
    let foundForIndex = false;
    for (const extension of extensions) {
      const path = `./assets/slideshow/slide-${index}.${extension}`;
      try {
        await new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = resolve;
          image.onerror = reject;
          image.src = path;
        });
        discovered.push(path);
        foundForIndex = true;
        break;
      } catch {
        continue;
      }
    }
    if (!foundForIndex) break;
    index += 1;
  }
  return discovered;
}

async function initSlideshows() {
  if (!slideshowRoots.length) return;
  const discoveredSlides = await discoverSlides();
  const fallbackSlides = discoveredSlides.length ? discoveredSlides : [];
  if (!fallbackSlides.length) return;
  const cacheBuster = `v=${Date.now()}`;

  slideshowRoots.forEach((slideshowRoot) => {
    const track = slideshowRoot.querySelector("[data-slideshow-track]");
    const currentImage = slideshowRoot.querySelector("[data-slideshow-current]");
    const nextImage = slideshowRoot.querySelector("[data-slideshow-next]");
    if (!track || !currentImage || !nextImage) return;

    const requestedRandomCount = Number(slideshowRoot.dataset.randomCount || fallbackSlides.length);
    const slides = getRandomSlides(fallbackSlides, requestedRandomCount).map((slide) =>
      slide.includes("?") ? slide : `${slide}?${cacheBuster}`
    );
    const baseSpeed = Number(slideshowRoot.dataset.speed || 3400);
    const hoverSpeed = Number(slideshowRoot.dataset.hoverSpeed || baseSpeed * 2.1);
    let currentIndex = 0;
    let currentSpeed = baseSpeed;
    let timerId = null;
    let isAnimating = false;

    if (slides.length === 1) {
      currentImage.src = slides[0];
      nextImage.src = slides[0];
      return;
    }

    currentImage.src = slides[currentIndex];
    nextImage.src = slides[(currentIndex + 1) % slides.length];

    const queueNextSlide = () => {
      timerId = window.setTimeout(() => {
        if (isAnimating) return;
        isAnimating = true;
        const transitionDuration = currentSpeed >= hoverSpeed ? 1600 : 1100;
        track.style.transition = `transform ${transitionDuration}ms cubic-bezier(0.2, 0.7, 0.2, 1)`;
        track.style.transform = "translateX(-100%)";

        window.setTimeout(() => {
          currentIndex = (currentIndex + 1) % slides.length;
          currentImage.src = slides[currentIndex];
          nextImage.src = slides[(currentIndex + 1) % slides.length];
          track.style.transition = "none";
          track.style.transform = "translateX(0)";
          isAnimating = false;
          queueNextSlide();
        }, transitionDuration + 30);
      }, currentSpeed);
    };

    slideshowRoot.addEventListener("mouseenter", () => {
      currentSpeed = hoverSpeed;
      if (timerId) {
        window.clearTimeout(timerId);
        queueNextSlide();
      }
    });

    slideshowRoot.addEventListener("mouseleave", () => {
      currentSpeed = baseSpeed;
      if (timerId) {
        window.clearTimeout(timerId);
        queueNextSlide();
      }
    });

    queueNextSlide();
  });
}

initSlideshows();

/* --------------------------------------------
   Typewriter effect (preserves inline HTML,
   shows a real insert cursor)
   -------------------------------------------- */
function normalizeHTMLWhitespace(html) {
  return html
    .replace(/\r/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function typewriteInto(element, html, speed, { onDone } = {}) {
  element.innerHTML = html;
  element.classList.add("typewriter-ready");

  // Collect every text node, zero it out, and remember what to type.
  const segments = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const originalText = n.nodeValue;
    if (!originalText) continue;
    n.nodeValue = "";
    segments.push({ node: n, text: originalText, pos: 0 });
  }

  // Create the blinking insert cursor.
  const cursor = document.createElement("span");
  cursor.className = "typewriter-cursor";
  cursor.setAttribute("aria-hidden", "true");
  element.appendChild(cursor);

  if (prefersReducedMotion || !segments.length) {
    segments.forEach((seg) => {
      seg.node.nodeValue = seg.text;
    });
    cursor.classList.add("is-done");
    if (onDone) onDone();
    return;
  }

  let segIdx = 0;

  const placeCursor = () => {
    const seg = segments[segIdx] || segments[segments.length - 1];
    if (!seg || !seg.node.parentNode) return;
    const parent = seg.node.parentNode;
    parent.insertBefore(cursor, seg.node.nextSibling);
  };

  const typeStep = () => {
    while (segIdx < segments.length && segments[segIdx].pos >= segments[segIdx].text.length) {
      segIdx += 1;
    }
    if (segIdx >= segments.length) {
      cursor.classList.add("is-done");
      // Move cursor to final position (end of element)
      element.appendChild(cursor);
      if (onDone) onDone();
      return;
    }
    const seg = segments[segIdx];
    seg.node.nodeValue += seg.text[seg.pos];
    seg.pos += 1;
    placeCursor();

    // Slight variance makes it feel human / like ChatGPT streaming.
    const jitter = (Math.random() * 0.8 + 0.7) * speed;
    window.setTimeout(typeStep, jitter);
  };

  placeCursor();
  typeStep();
}

function initImmediateTypewriters() {
  const els = document.querySelectorAll(".typewriter[data-typewriter]");
  els.forEach((el, i) => {
    const speed = Number(el.dataset.typeSpeed || 40);
    const html = normalizeHTMLWhitespace(el.getAttribute("data-type-html") || el.innerHTML);
    // Keep title visible before typing starts
    window.setTimeout(() => typewriteInto(el, html, speed), 220 + i * 90);
  });
}

function initOnRevealTypewriters() {
  const els = document.querySelectorAll(".type-on-reveal");
  if (!els.length) return;

  els.forEach((el) => {
    const html = normalizeHTMLWhitespace(el.innerHTML);
    el.dataset.pendingType = html;
    el.innerHTML = "";
    el.classList.add("type-pending");
    // Hold height roughly in place so the page doesn't jump:
    el.style.minHeight = "1em";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const speed = Number(el.dataset.typeSpeed || 14);
        const html = el.dataset.pendingType;
        if (!html) return;
        el.style.minHeight = "";
        typewriteInto(el, html, speed);
        el.removeAttribute("data-pending-type");
        observer.unobserve(el);
      });
    },
    { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
  );

  els.forEach((el) => observer.observe(el));
}

/* --------------------------------------------
   Reveal-on-scroll with per-element variants.
   - data-reveal="slide-left" | "slide-right" | "pop" | "late"
   - data-reveal-order="1..n"   -> controls delay order (low = first)
   - data-reveal-last           -> always arrives last with extra delay
   -------------------------------------------- */
function initScrollAnimations() {
  const defaultSelectors = [
    ".topbar",
    ".section-head",
    ".page-hero-inner",
    ".about-copy",
    ".about-media",
    ".about-socials",
    ".about-actions",
    ".about-grid",
    ".resume-logo-wrap",
    ".resume-preview-card",
    ".project-card",
    ".photo-slot",
    ".footer-grid > div",
    ".site-footer-lower",
  ];

  const defaultElements = Array.from(document.querySelectorAll(defaultSelectors.join(", ")));
  const variantElements = Array.from(document.querySelectorAll("[data-reveal]"));

  const allElements = [...new Set([...defaultElements, ...variantElements])];
  if (!allElements.length) return;

  // Sort variant elements by their stated order so "Education last" wins.
  const orderedVariants = variantElements
    .slice()
    .sort((a, b) => Number(a.dataset.revealOrder || 0) - Number(b.dataset.revealOrder || 0));

  const variantClassMap = {
    "slide-left": "reveal-slide-left",
    "slide-right": "reveal-slide-right",
    pop: "reveal-pop",
    late: "reveal-late",
  };

  // Assign classes + delays
  defaultElements.forEach((element, index) => {
    if (element.hasAttribute("data-reveal")) return; // handled separately
    element.classList.add("reveal-on-scroll");
    element.style.setProperty("--reveal-delay", `${Math.min(index * 45, 280)}ms`);
  });

  orderedVariants.forEach((element, index) => {
    const variant = element.dataset.reveal;
    const cls = variantClassMap[variant] || "reveal-on-scroll";
    element.classList.add(cls);
    const isLast = element.hasAttribute("data-reveal-last");
    const baseDelay = index * 220;
    const lastBoost = isLast ? 520 : 0;
    element.style.setProperty("--reveal-delay", `${baseDelay + lastBoost}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
  );

  allElements.forEach((element) => observer.observe(element));
}

/* --------------------------------------------
   Kick things off
   -------------------------------------------- */
initScrollAnimations();
initImmediateTypewriters();
initOnRevealTypewriters();
