import {
  completionMessage,
  createInitialState,
  pauseSession,
  selectMode,
  startSession,
  tick,
} from "./state.js";

const TICK_MS = 200;

export function createTimer({ view, audio, notifications }) {
  let state = createInitialState();
  let intervalId = null;

  function publish() {
    view.render(state, Date.now());
  }

  function stopLoop() {
    clearInterval(intervalId);
    intervalId = null;
  }

  function startLoop() {
    if (intervalId != null) return;
    intervalId = setInterval(catchUp, TICK_MS);
  }

  function catchUp() {
    const result = tick(state, Date.now());
    state = result.state;
    publish();
    if (!result.finished) {
      if (!state.running) stopLoop();
      return;
    }
    stopLoop();
    notifications.show(completionMessage(result.endedMode));
    Promise.resolve()
      .then(() => audio.playDone())
      .catch(() => {});
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") catchUp();
  });

  publish();

  return {
    getState() {
      return state;
    },
    start() {
      Promise.resolve(audio.resume())
        .then(() => audio.playStart())
        .catch(() => {});
      Promise.resolve(notifications.ensurePermission()).catch(() => {});
      state = startSession(state, Date.now());
      publish();
      if (state.running) startLoop();
    },
    pause() {
      state = pauseSession(state, Date.now());
      stopLoop();
      publish();
    },
    toggle() {
      if (state.running) this.pause();
      else this.start();
    },
    setMode(mode) {
      state = selectMode(state, mode, Date.now());
      stopLoop();
      publish();
    },
    catchUp,
  };
}
