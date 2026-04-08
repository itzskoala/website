const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const revealItems = document.querySelectorAll("[data-reveal]");
const carouselShell = document.querySelector("[data-carousel-shell]");
const carouselTrack = document.querySelector("[data-carousel-track]");

function applyTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
}

applyTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("revealed"));
}

if (
  carouselShell &&
  carouselTrack &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  let currentOffset = 0;
  let currentSpeed = 0.065;
  let targetSpeed = 0.065;
  let lastTime = performance.now();
  let loopWidth = carouselTrack.scrollWidth / 2;

  function animateCarousel(now) {
    const delta = now - lastTime;
    lastTime = now;

    currentSpeed += (targetSpeed - currentSpeed) * 0.08;
    currentOffset -= currentSpeed * delta;

    if (currentOffset <= -loopWidth) {
      currentOffset += loopWidth;
    }

    carouselTrack.style.transform = `translate3d(${currentOffset}px, 0, 0)`;
    requestAnimationFrame(animateCarousel);
  }

  carouselShell.addEventListener("mouseenter", () => {
    targetSpeed = 0.018;
  });

  carouselShell.addEventListener("mouseleave", () => {
    targetSpeed = 0.065;
  });

  window.addEventListener("resize", () => {
    loopWidth = carouselTrack.scrollWidth / 2;
  });

  requestAnimationFrame(animateCarousel);
}
