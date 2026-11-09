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
    toggleMenu();
  });

  const ambient = document.querySelector("#ambient");
  const ambientLabel = document.querySelector("#ambientLabel");
  let playing = false;
  ambient?.addEventListener("click", () => {
    playing = !playing;
    if (playing) audio.startAmbient();
    else audio.stopAmbient();
    ambient.classList.toggle("is-playing", playing);
    ambient.setAttribute("aria-pressed", String(playing));
    const label = playing ? "Música ligada" : "Música";
    if (ambientLabel) ambientLabel.textContent = label;
    ambient.setAttribute("aria-label", label);
  });

  document.addEventListener("keydown", (event) => {
    if (event.code !== "Space") return;
    const target = event.target;
    if (target instanceof HTMLElement) {
      const tag = target.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "BUTTON" ||
        tag === "A" ||
        target.isContentEditable
      ) {
        return;
      }
    }
    if (document.querySelector("dialog[open]") || document.querySelector(".menu")) {
      return;
    }
    event.preventDefault();
    timer.toggle();
  });
}
