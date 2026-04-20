const root = document.documentElement;
const themeToggles = document.querySelectorAll("[data-theme-toggle]");
const slideshowRoots = document.querySelectorAll("[data-slideshow]");
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

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

    if (!foundForIndex) {
      break;
    }

    index += 1;
  }

  return discovered;
}

async function initSlideshows() {
  if (!slideshowRoots.length) {
    return;
  }

  const slides = await discoverSlides();
  if (!slides.length) {
    return;
  }

  slideshowRoots.forEach((slideshowRoot) => {
    const image = slideshowRoot.querySelector("[data-slideshow-image]");
    if (!image) {
      return;
    }

    const baseSpeed = Number(slideshowRoot.dataset.speed || 3400);
    const hoverSpeed = Number(slideshowRoot.dataset.hoverSpeed || baseSpeed * 2.1);
    let currentIndex = 0;
    let currentSpeed = baseSpeed;
    let timerId = null;

    image.src = slides[currentIndex];
    image.classList.add("is-active");

    if (slides.length === 1) {
      return;
    }

    const queueNextSlide = () => {
      timerId = window.setTimeout(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        image.classList.remove("is-active");

        window.setTimeout(() => {
          image.src = slides[currentIndex];
          image.classList.add("is-active");
          queueNextSlide();
        }, 220);
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
