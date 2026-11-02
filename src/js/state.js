export const POMODOROS_UNTIL_LONG_BREAK = 4;

export const MODES = {
  pomodoro: { minutes: 25, label: "Time to Focus!" },
  shortBreak: { minutes: 5, label: "Time for a Break!" },
  longBreak: { minutes: 15, label: "Time for a Break!" },
};

const MINUTE_MS = 60 * 1000;

export function durationFor(mode) {
  return MODES[mode].minutes * MINUTE_MS;
}

export function createInitialState() {
  const durationMs = durationFor("pomodoro");
  return {
    mode: "pomodoro",
    durationMs,
    remainingMs: durationMs,
    running: false,
    endsAt: null,
    focusMs: 0,
    segmentStartedAt: null,
    completedPomodoros: 0,
    statusText: MODES.pomodoro.label,
  };
}

function flushFocus(state, now) {
  if (state.segmentStartedAt == null) return state;
  return {
    ...state,
    focusMs: state.focusMs + Math.max(0, now - state.segmentStartedAt),
    segmentStartedAt: null,
  };
}

export function visibleFocusMs(state, now) {
  const live =
    state.segmentStartedAt == null
      ? 0
      : Math.max(0, now - state.segmentStartedAt);
  return state.focusMs + live;
}

export function selectMode(state, mode, now) {
  const spec = MODES[mode];
  if (!spec) return state;

  const durationMs = durationFor(mode);
  return {
    ...flushFocus(state, now),
    mode,
    durationMs,
    remainingMs: durationMs,
    running: false,
    endsAt: null,
    segmentStartedAt: null,
    statusText: spec.label,
  };
}

export function startSession(state, now) {
  const ready = state.remainingMs <= 0 ? selectMode(state, state.mode, now) : state;
  if (ready.running) return ready;

  return {
    ...ready,
    running: true,
    endsAt: now + ready.remainingMs,
    segmentStartedAt: ready.mode === "pomodoro" ? now : null,
  };
}

export function pauseSession(state, now) {
  if (!state.running || state.endsAt == null) return flushFocus(state, now);

  const remainingMs = Math.max(0, state.endsAt - now);
  return flushFocus(
    { ...state, running: false, endsAt: null, remainingMs },
    now,
  );
}

export function tick(state, now) {
  if (!state.running || state.endsAt == null) {
    return { state, finished: false, endedMode: null };
  }

  const remainingMs = state.endsAt - now;
  if (remainingMs > 0) {
    return {
      state: { ...state, remainingMs },
      finished: false,
      endedMode: null,
    };
  }

  return {
    state: finishSession(state, now),
    finished: true,
    endedMode: state.mode,
  };
}

function finishSession(state, now) {
  const stopped = flushFocus(
    { ...state, running: false, endsAt: null, remainingMs: 0 },
    now,
  );

  if (state.mode === "pomodoro") {
    const completedPomodoros = state.completedPomodoros + 1;
    const nextMode =
      completedPomodoros % POMODOROS_UNTIL_LONG_BREAK === 0
        ? "longBreak"
        : "shortBreak";
    return selectMode({ ...stopped, completedPomodoros }, nextMode, now);
  }

  return selectMode(stopped, "pomodoro", now);
}

export function sessionLabel(completedPomodoros, mode) {
  const cycle = completedPomodoros % POMODOROS_UNTIL_LONG_BREAK;
  const shown =
    mode === "longBreak" && cycle === 0 && completedPomodoros > 0
      ? POMODOROS_UNTIL_LONG_BREAK
      : cycle;
  return `Focus sessions: ${shown}/${POMODOROS_UNTIL_LONG_BREAK}`;
}

export function completionMessage(endedMode) {
  if (endedMode === "pomodoro") {
    return "Focus session complete. Time for a break.";
  }
  return "Break is over. Time to focus.";
}
