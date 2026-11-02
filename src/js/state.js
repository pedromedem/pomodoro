export const POMODOROS_UNTIL_LONG_BREAK = 4;

export const MODES = {
  pomodoro: { minutes: 25, label: "Hora de focar!", name: "Foco 25" },
  shortBreak: { minutes: 5, label: "Hora da pausa!", name: "Pausa curta 5" },
  longBreak: { minutes: 15, label: "Hora da pausa!", name: "Pausa longa 15" },
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
    awaitingStart: null,
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
    awaitingStart: null,
    statusText: spec.label,
  };
}

export function startSession(state, now) {
  const ready = state.remainingMs <= 0 ? selectMode(state, state.mode, now) : state;
  if (ready.running) return ready;

  return {
    ...ready,
    running: true,
    awaitingStart: null,
    endsAt: now + ready.remainingMs,
    segmentStartedAt: ready.mode === "pomodoro" ? now : null,
    statusText: MODES[ready.mode].label,
  };
}

export function pauseSession(state, now) {
  if (!state.running || state.endsAt == null) return flushFocus(state, now);

  const remainingMs = Math.max(0, state.endsAt - now);
  return flushFocus(
    {
      ...state,
      running: false,
      endsAt: null,
      remainingMs,
      statusText: "Pausado",
    },
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
    return {
      ...selectMode({ ...stopped, completedPomodoros }, nextMode, now),
      awaitingStart: "break",
      statusText: "Foco concluído",
    };
  }

  return {
    ...selectMode(stopped, "pomodoro", now),
    awaitingStart: "focus",
    statusText: "Pausa concluída",
  };
}

export function filledSessions(completedPomodoros, mode) {
  const cycle = completedPomodoros % POMODOROS_UNTIL_LONG_BREAK;
  if (mode === "longBreak" && cycle === 0 && completedPomodoros > 0) {
    return POMODOROS_UNTIL_LONG_BREAK;
  }
  return cycle;
}

export function sessionLabel(completedPomodoros, mode) {
  return `Focos: ${filledSessions(completedPomodoros, mode)} de ${POMODOROS_UNTIL_LONG_BREAK}`;
}

export function actionLabel(state) {
  if (state.running) return "Pausar";
  if (state.awaitingStart === "break") return "Começar intervalo";
  if (state.awaitingStart === "focus") return "Voltar ao foco";
  if (state.remainingMs < state.durationMs) return "Continuar";
  return "Começar";
}

export function completionMessage(endedMode) {
  if (endedMode === "pomodoro") {
    return "Foco concluído. Hora da pausa.";
  }
  return "Pausa encerrada. Hora de focar.";
}
