import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatClock, formatDuration, formatTitle } from "../src/js/format.js";
import {
  completionMessage,
  createInitialState,
  pauseSession,
  selectMode,
  sessionLabel,
  startSession,
  tick,
  visibleFocusMs,
} from "../src/js/state.js";

const POMODORO_MS = 25 * 60 * 1000;

function finishRunning(state, now) {
  const running = startSession(state, now);
  return tick(running, running.endsAt);
}

describe("format", () => {
  it("keeps a full minute on screen until a whole second has elapsed", () => {
    assert.deepEqual(formatClock(POMODORO_MS), {
      minutes: "25",
      seconds: "00",
    });
    assert.deepEqual(formatClock(POMODORO_MS - 1), {
      minutes: "25",
      seconds: "00",
    });
    assert.deepEqual(formatClock(POMODORO_MS - 1000), {
      minutes: "24",
      seconds: "59",
    });
    assert.deepEqual(formatClock(0), { minutes: "00", seconds: "00" });
  });

  it("formats elapsed focus time from zero", () => {
    assert.equal(formatDuration(0), "00:00:00");
    assert.equal(formatDuration(61_000), "00:01:01");
  });

  it("builds the tab title from the clock and the status", () => {
    assert.equal(formatTitle(POMODORO_MS, "Time to Focus!"), "25:00 | Time to Focus!");
  });
});

describe("timer state", () => {
  it("counts down from the end timestamp instead of subtracting one tick", () => {
    const running = startSession(createInitialState(), 0);
    const early = tick(running, 999);
    const flipped = tick(running, 1000);

    assert.equal(early.finished, false);
    assert.equal(formatClock(early.state.remainingMs).minutes, "25");
    assert.equal(formatClock(flipped.state.remainingMs).seconds, "59");
    assert.equal(running.endsAt, POMODORO_MS);
  });

  it("finishes on the end timestamp and arms a short break", () => {
    const result = tick(startSession(createInitialState(), 0), POMODORO_MS);

    assert.equal(result.finished, true);
    assert.equal(result.endedMode, "pomodoro");
    assert.equal(result.state.mode, "shortBreak");
    assert.equal(result.state.running, false);
    assert.equal(result.state.remainingMs, 5 * 60 * 1000);
    assert.equal(result.state.completedPomodoros, 1);
    assert.equal(completionMessage(result.endedMode), "Focus session complete. Time for a break.");
  });

  it("does not finish one millisecond early", () => {
    const running = startSession(createInitialState(), 0);
    const result = tick(running, POMODORO_MS - 1);
    assert.equal(result.finished, false);
    assert.equal(result.state.mode, "pomodoro");
  });

  it("catches up when a background tab wakes up after the end", () => {
    const running = startSession(createInitialState(), 0);
    const result = tick(running, POMODORO_MS + 60_000);

    assert.equal(result.finished, true);
    assert.equal(result.state.mode, "shortBreak");
    assert.equal(result.state.running, false);
  });

  it("switches to a long break on the fourth focus session", () => {
    let state = createInitialState();
    for (let session = 0; session < 4; session += 1) {
      state = selectMode(state, "pomodoro", session);
      const result = finishRunning(state, session);
      state = result.state;
    }

    assert.equal(state.mode, "longBreak");
    assert.equal(state.completedPomodoros, 4);
    assert.equal(sessionLabel(4, "longBreak"), "Focus sessions: 4/4");
  });

  it("returns to focus when a break ends and keeps the session count", () => {
    const onBreak = selectMode(createInitialState(), "shortBreak", 0);
    const result = finishRunning({ ...onBreak, completedPomodoros: 2 }, 10);

    assert.equal(result.finished, true);
    assert.equal(result.state.mode, "pomodoro");
    assert.equal(result.state.completedPomodoros, 2);
    assert.equal(result.state.remainingMs, POMODORO_MS);
    assert.equal(completionMessage("shortBreak"), "Break is over. Time to focus.");
  });

  it("restarts the current mode when start is pressed at zero", () => {
    const ended = { ...createInitialState(), remainingMs: 0 };
    const restarted = startSession(ended, 50);

    assert.equal(restarted.running, true);
    assert.equal(restarted.remainingMs, POMODORO_MS);
    assert.equal(restarted.endsAt, 50 + POMODORO_MS);
  });

  it("pauses without moving the end forward", () => {
    const running = startSession(createInitialState(), 1_000);
    const paused = pauseSession(running, 11_000);

    assert.equal(paused.running, false);
    assert.equal(paused.endsAt, null);
    assert.equal(paused.remainingMs, POMODORO_MS - 10_000);

    const resumed = startSession(paused, 30_000);
    assert.equal(resumed.endsAt, 30_000 + paused.remainingMs);
  });

  it("counts focus time only while a pomodoro is running", () => {
    let state = startSession(createInitialState(), 0);
    state = pauseSession(state, 10_000);
    assert.equal(state.focusMs, 10_000);
    assert.equal(visibleFocusMs(state, 50_000), 10_000);

    state = startSession(state, 20_000);
    assert.equal(visibleFocusMs(state, 22_000), 12_000);
    state = pauseSession(state, 25_000);
    assert.equal(state.focusMs, 15_000);

    state = startSession(selectMode(state, "shortBreak", 30_000), 30_000);
    state = pauseSession(state, 40_000);
    assert.equal(state.focusMs, 15_000);
  });

  it("ignores an unknown mode", () => {
    const initial = createInitialState();
    assert.equal(selectMode(initial, "nope", 0), initial);
  });
});
