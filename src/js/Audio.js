const music = new Audio(new URL("../sounds/town.mp3", import.meta.url));
const bell = new Audio(new URL("../sounds/bell.wav", import.meta.url));

music.loop = true;
music.volume = 0.45;
bell.volume = 0.55;

function playBell() {
  bell.currentTime = 0;
  bell.play().catch(() => {});
}

export function createAudio() {
  return {
    playStart() {
      playBell();
    },

    playDone() {
      playBell();
    },

    startAmbient() {
      music.play().catch(() => {});
    },

    stopAmbient() {
      music.pause();
      music.currentTime = 0;
    },
  };
}
