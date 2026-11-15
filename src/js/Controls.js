import { toggleMenu } from "./Menu.js";

export function bindControls({ timer, audio }) {
  document.querySelector("#buttonToggle")?.addEventListener("click", () => {
    timer.toggle();
  });

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button instanceof HTMLElement && button.dataset.mode) {
        timer.setMode(button.dataset.mode);
      }
    });
  });

  document.querySelector("#btndots")?.addEventListener("click", () => {
    toggleMenu(audio);
  });

  document.querySelector("#buttonRestart")?.addEventListener("click", () => {
    timer.restart();
  });

  const ambient = document.querySelector("#ambient");
  let playing = false;
  ambient?.addEventListener("click", () => {
    playing = !playing;
    if (playing) audio.startAmbient();
    else audio.stopAmbient();
    ambient.classList.toggle("paused", playing);
    ambient.setAttribute("aria-pressed", String(playing));
    ambient.setAttribute("aria-label", playing ? "Música ligada" : "Música");
  });

  document.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
    if (document.querySelector("dialog[open]") || document.querySelector(".menu")) return;

    const target = event.target;
    const tag = target instanceof HTMLElement ? target.tagName : "";
    if (tag === "INPUT" || tag === "TEXTAREA" || target instanceof HTMLElement && target.isContentEditable) {
      return;
    }

    const modes = {
      Digit1: "pomodoro",
      Digit2: "shortBreak",
      Digit3: "longBreak",
      Numpad1: "pomodoro",
      Numpad2: "shortBreak",
      Numpad3: "longBreak",
    };

    if (event.code === "Space") {
      if (tag === "BUTTON" || tag === "A") return;
      event.preventDefault();
      timer.toggle();
      return;
    }

    if (modes[event.code]) {
      event.preventDefault();
      timer.setMode(modes[event.code]);
      return;
    }

    if (event.code === "KeyR") {
      event.preventDefault();
      timer.restart();
    }
  });
}
