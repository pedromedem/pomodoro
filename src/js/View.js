import { formatClock, formatDuration, formatTitle } from "./format.js";
import { sessionLabel, visibleFocusMs } from "./state.js";

function required(selector) {
  const element = document.querySelector(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
}

export function createView() {
  const minutes = required("#minutes");
  const seconds = required("#seconds");
  const status = required("#text");
  const focusTime = required("#focusTime");
  const sessionCount = required("#sessionCount");
  const startButton = required("#buttonStart");
  const pauseButton = required("#buttonPause");
  const modeButtons = [...document.querySelectorAll("[data-mode]")];

  return {
    render(state, now) {
      const clock = formatClock(state.remainingMs);
      minutes.textContent = clock.minutes;
      seconds.textContent = clock.seconds;
      status.textContent = state.statusText;
      focusTime.textContent = `you are in focus for: ${formatDuration(visibleFocusMs(state, now))}`;
      sessionCount.textContent = sessionLabel(
        state.completedPomodoros,
        state.mode,
      );
      document.title = formatTitle(state.remainingMs, state.statusText);

      modeButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.mode === state.mode);
      });

      const pausedMidSession =
        !state.running && state.remainingMs < state.durationMs;
      startButton.classList.toggle("active", state.running);
      startButton.setAttribute("aria-pressed", String(state.running));
      pauseButton.classList.toggle("active", pausedMidSession);
      pauseButton.setAttribute("aria-pressed", String(pausedMidSession));
    },
  };
}
