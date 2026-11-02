import { createAudio } from "./Audio.js";
import { bindControls } from "./Controls.js";
import { initModal } from "./Modal.js";
import { createNotifications } from "./Notifications.js";
import { initTheme } from "./Theme.js";
import { createTimer } from "./Timer.js";
import { createView } from "./View.js";

const App = {
  start() {
    initTheme();
    initModal();
    const audio = createAudio();
    const notifications = createNotifications();
    const view = createView();
    const timer = createTimer({ view, audio, notifications });
    bindControls({ timer, audio });
  },
};

export { App };
