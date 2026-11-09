const THEME_KEY = "pomodoro.theme";

function readSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function preferredTheme() {
  const saved = readSavedTheme();
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(name) {
  const theme = name === "dark" ? "dark" : "light";
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.body.classList.remove("green-theme", "pink-theme");
  document.querySelector("#btndots")?.setAttribute("aria-pressed", String(theme === "dark"));
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage can be blocked; the choice still applies for this visit.
  }
}

export function initTheme() {
  applyTheme(preferredTheme());
}

export function toggleTheme() {
  applyTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
}
