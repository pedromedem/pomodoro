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

export function toggleMenu() {
  if (menuElement) {
    closeMenu()?.focus();
    return;
  }
  openMenu();
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

function openMenu() {
  const menu = document.createElement("div");
  menu.className = "menu";
  menu.setAttribute("role", "dialog");
  menu.setAttribute("aria-modal", "true");
  menu.setAttribute("aria-label", "Temas");

  const content = document.createElement("div");
  content.className = "menu-content";

  const header = document.createElement("div");
  header.className = "menu-header";

  const title = document.createElement("p");
  title.textContent = "Temas";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.id = "close-menu";
  closeButton.setAttribute("aria-label", "Fechar temas");
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
