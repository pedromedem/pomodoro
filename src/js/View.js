import { formatClock, formatFocus, formatTitle } from "./format.js";
import {
  actionLabel,
  filledSessions,
  MODES,
  sessionLabel,
  visibleFocusMs,
} from "./state.js";

const RING_RADIUS = 46;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

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
  const sessionMarks = required("#sessionMarks");
  const marks = [...sessionMarks.querySelectorAll(".mark")];
  const toggle = required("#buttonToggle");
  const ring = required("#ringValue");
  const modeButtons = [...document.querySelectorAll("[data-mode]")];

  ring.style.strokeDasharray = String(RING_LENGTH);

  return {
    render(state, now) {
      const clock = formatClock(state.remainingMs);
      minutes.textContent = clock.minutes;
      seconds.textContent = clock.seconds;
      status.textContent = state.statusText;
      focusTime.textContent = `em foco há ${formatFocus(visibleFocusMs(state, now))}`;
      document.title = formatTitle(state.remainingMs, state.statusText);

      const ratio =
        state.durationMs > 0
          ? Math.min(1, Math.max(0, state.remainingMs / state.durationMs))
          : 0;
      ring.style.strokeDashoffset = String(-RING_LENGTH * (1 - ratio));

      const filled = filledSessions(state.completedPomodoros, state.mode);
      marks.forEach((mark, index) => {
        mark.classList.toggle("is-filled", index < filled);
      });
      sessionMarks.setAttribute(
        "aria-label",
        sessionLabel(state.completedPomodoros, state.mode),
      );

      modeButtons.forEach((button) => {
        const mode = button.dataset.mode;
        if (mode && MODES[mode]) button.textContent = MODES[mode].name;
        const selected = mode === state.mode;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });

      toggle.textContent = actionLabel(state);
      toggle.setAttribute("aria-pressed", String(state.running));
    },
  };
}
