const STORAGE_KEY = "pomodoro.modal.hidden";
const LEGACY_KEY = "hidden";

function readHidden() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY);
  } catch {
    return "true";
  }
}

function rememberHidden() {
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Closing still works when storage is blocked.
  }
}

export function initModal() {
  const modal = document.querySelector("#modal");
  if (!(modal instanceof HTMLDialogElement)) return;

  modal.addEventListener("close", rememberHidden);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
  modal.querySelector("#closeModal")?.addEventListener("click", () => {
    modal.close();
  });

  if (!readHidden()) modal.showModal();
}
