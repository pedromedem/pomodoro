const LOOP_SECONDS = 8;
const MELODY = [
  [0, 392],
  [0.5, 440],
  [1, 494],
  [1.5, 523.25],
  [2.25, 494],
  [2.75, 440],
  [3.5, 392],
  [4.25, 349.23],
  [5, 392],
  [5.75, 440],
  [6.5, 494],
  [7.25, 392],
];

export function createAudio() {
  let ctx = null;
  let ambient = [];
  let ambientGain = null;
  let loopTimer = null;

  function context() {
    if (!ctx) ctx = new AudioContext();
    return ctx;
  }

  function tone(current, freq, startAt, duration, peak) {
    const osc = current.createOscillator();
    const gain = current.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(peak, startAt + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    osc.connect(gain).connect(current.destination);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.02);
  }

  function playChime(current) {
    const now = current.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, index) => {
      tone(current, freq, now + index * 0.12, 0.45, 0.18);
    });
  }

  function scheduleLoop(current, when) {
    MELODY.forEach(([beat, freq]) => {
      const osc = current.createOscillator();
      const gain = current.createGain();
      const startAt = when + beat;
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.12, startAt + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.42);
      osc.connect(gain).connect(ambientGain);
      osc.start(startAt);
      osc.stop(startAt + 0.46);
      ambient.push(osc);
    });
  }

  return {
    async resume() {
      const current = context();
      if (current.state === "suspended") await current.resume();
    },

    playStart() {
      const current = context();
      if (current.state === "suspended") return;
      tone(current, 880, current.currentTime, 0.18, 0.16);
    },

    playDone() {
      const current = context();
      if (current.state === "suspended") {
        current.resume().then(() => playChime(current)).catch(() => {});
        return;
      }
      playChime(current);
    },

    startAmbient() {
      this.stopAmbient();
      const current = context();
      const master = current.createGain();
      master.gain.value = 0.9;
      master.connect(current.destination);
      ambientGain = master;

      const pad = current.createOscillator();
      const padGain = current.createGain();
      pad.type = "sine";
      pad.frequency.value = 196;
      padGain.gain.value = 0.08;
      pad.connect(padGain).connect(master);
      pad.start();
      ambient.push(pad);

      const arm = () => {
        if (!ambientGain) return;
        scheduleLoop(current, current.currentTime + 0.05);
      };
      arm();
      loopTimer = setInterval(arm, LOOP_SECONDS * 1000);
    },

    stopAmbient() {
      clearInterval(loopTimer);
      loopTimer = null;
      ambient.forEach((osc) => {
        try {
          osc.stop();
        } catch {
          // The oscillator was already stopped.
        }
      });
      ambient = [];
      if (ambientGain) {
        ambientGain.disconnect();
        ambientGain = null;
      }
    },
  };
}
