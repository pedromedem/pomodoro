const THEME_KEY = "pomodoro.theme";

function readSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

export function applyTheme(name) {
  const theme = name === "pink" ? "pink" : "green";
  document.body.classList.toggle("pink-theme", theme === "pink");
  document.body.classList.toggle("green-theme", theme === "green");
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage can be blocked; the choice still applies for this visit.
  }
}

export function initTheme() {
  applyTheme(readSavedTheme() === "pink" ? "pink" : "green");
}
