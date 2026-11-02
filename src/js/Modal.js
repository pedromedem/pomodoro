export function initModal() {
  const modal = document.querySelector("#modal");
  if (!(modal instanceof HTMLDialogElement)) return;

  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
  modal.querySelector("#closeModal")?.addEventListener("click", () => {
    modal.close();
  });
  document.querySelector("#about")?.addEventListener("click", () => {
    modal.showModal();
  });
}
