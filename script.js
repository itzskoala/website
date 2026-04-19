const root = document.documentElement;
const themeToggles = document.querySelectorAll("[data-theme-toggle]");
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function applyTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  themeToggles.forEach((toggle) => {
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
    toggle.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  });
}

applyTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

themeToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });
});
