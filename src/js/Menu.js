import { applyTheme } from "./Theme.js";

let menuElement = null;
let onKeyDown = null;

const pinkSrc = new URL("../imgs/img-pink.png", import.meta.url).href;
const greenSrc = new URL("../imgs/img-project.png", import.meta.url).href;

export function closeMenu() {
  if (onKeyDown) {
    document.removeEventListener("keydown", onKeyDown);
    onKeyDown = null;
  }
  menuElement?.remove();
  menuElement = null;
  const opener = document.querySelector("#btndots");
  opener?.setAttribute("aria-expanded", "false");
  return opener;
}

export function toggleMenu(audio) {
  if (menuElement) {
    closeMenu()?.focus();
    return;
  }
  openMenu(audio);
}

function themeButton(id, label, src, theme) {
  const button = document.createElement("button");
  button.type = "button";
  button.id = id;

  const text = document.createElement("span");
  text.textContent = label;

  const image = document.createElement("img");
  image.src = src;
  image.alt = `Prévia do ${label.toLowerCase()}`;

  button.append(text, image);
  button.addEventListener("click", () => {
    applyTheme(theme);
    closeMenu()?.focus();
  });
  return button;
}

function volumeControl(label, value, onInput) {
  const field = document.createElement("label");
  field.className = "volume";

  const name = document.createElement("span");
  name.textContent = label;

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = "1";
  slider.step = "0.05";
  slider.value = String(value);
  slider.setAttribute("aria-label", label);
  slider.addEventListener("input", () => {
    onInput(Number(slider.value));
  });
  slider.addEventListener("click", (event) => event.stopPropagation());

  field.append(name, slider);
  return field;
}

function openMenu(audio) {
  const menu = document.createElement("div");
  menu.className = "menu";
  menu.setAttribute("role", "dialog");
  menu.setAttribute("aria-modal", "true");
  menu.setAttribute("aria-label", "Ajustes");

  const content = document.createElement("div");
  content.className = "menu-content";

  const header = document.createElement("div");
  header.className = "menu-header";

  const title = document.createElement("p");
  title.textContent = "Ajustes";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.id = "close-menu";
  closeButton.setAttribute("aria-label", "Fechar ajustes");
  const closeIcon = document.createElement("span");
  closeIcon.className = "close";
  closeIcon.setAttribute("aria-hidden", "true");
  closeButton.append(closeIcon);
  closeButton.addEventListener("click", () => closeMenu()?.focus());

  header.append(title, closeButton);

  const body = document.createElement("div");
  body.className = "menu-body";
  body.append(
    themeButton("pink-theme", "Tema rosa", pinkSrc, "pink"),
    themeButton("green-theme", "Tema verde", greenSrc, "green"),
    volumeControl("Harpa", audio?.musicVolume?.() ?? 0.45, (value) => {
      audio?.setMusicVolume(value);
    }),
    volumeControl("Sino", audio?.bellVolume?.() ?? 0.55, (value) => {
      audio?.setBellVolume(value);
    }),
  );

  content.append(header, body);
  menu.append(content);
  content.addEventListener("click", (event) => event.stopPropagation());
  menu.addEventListener("click", () => closeMenu()?.focus());

  document.querySelector(".container")?.append(menu);
  menuElement = menu;
  document.querySelector("#btndots")?.setAttribute("aria-expanded", "true");
  closeButton.focus();

  onKeyDown = (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    closeMenu()?.focus();
  };
  document.addEventListener("keydown", onKeyDown);
}
