import { toggleMenu } from "./Menu.js";

export function bindControls({ timer, audio }) {
  document.querySelector("#buttonStart")?.addEventListener("click", () => {
    timer.start();
  });
  document.querySelector("#buttonPause")?.addEventListener("click", () => {
    timer.pause();
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
  let playing = false;
  ambient?.addEventListener("click", async () => {
    try {
      await audio.resume();
    } catch {
      return;
    }
    playing = !playing;
    if (playing) audio.startAmbient();
    else audio.stopAmbient();
    ambient.classList.toggle("is-playing", playing);
    ambient.setAttribute("aria-pressed", String(playing));
    ambient.setAttribute(
      "aria-label",
      playing ? "Pause ambient sound" : "Play ambient sound",
    );
  });

  document.addEventListener("keydown", (event) => {
    if (event.code !== "Space") return;
    const target = event.target;
    if (target instanceof HTMLElement) {
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
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
