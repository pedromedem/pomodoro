export function createAudio() {
  let ctx = null;
  let ambient = [];
  let ambientGain = null;

  function context() {
    if (!ctx) ctx = new AudioContext();
    return ctx;
  }

  function playChime(current) {
    const now = current.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, index) => {
      const osc = current.createOscillator();
      const gain = current.createGain();
      const startAt = now + index * 0.12;
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.08, startAt + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.45);
      osc.connect(gain).connect(current.destination);
      osc.start(startAt);
      osc.stop(startAt + 0.5);
    });
  }

  return {
    async resume() {
      const current = context();
      if (current.state === "suspended") await current.resume();
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
      master.gain.value = 0.02;
      master.connect(current.destination);
      ambientGain = master;

      [196, 246.94, 329.63, 392].forEach((freq, index) => {
        const osc = current.createOscillator();
        const gain = current.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.value = 0.2 / (index + 1);
        osc.connect(gain).connect(master);
        osc.start();
        ambient.push(osc);
      });
    },

    stopAmbient() {
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
