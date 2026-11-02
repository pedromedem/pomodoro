const icon = new URL("../imgs/clock.svg", import.meta.url).href;

export function createNotifications() {
  return {
    async ensurePermission() {
      if (!("Notification" in window)) return "unsupported";
      if (Notification.permission !== "default") return Notification.permission;
      try {
        return await Notification.requestPermission();
      } catch {
        return Notification.permission;
      }
    },

    show(body) {
      if (!("Notification" in window) || Notification.permission !== "granted") {
        return;
      }
      try {
        new Notification("Pomodoro", {
          body,
          icon,
          tag: "pomodoro-timer",
        });
      } catch {
        // The constructor throws when permission is revoked between checks.
      }
    },
  };
}
