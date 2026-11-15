const MUSIC_KEY = "pomodoro.musicVolume";
const BELL_KEY = "pomodoro.bellVolume";

const music = new Audio(new URL("../sounds/town.mp3", import.meta.url));
const bell = new Audio(new URL("../sounds/bell.wav", import.meta.url));

music.loop = true;

function clamp(value) {
  return Math.min(1, Math.max(0, value));
}

function stored(key, fallback) {
  try {
    const value = Number(localStorage.getItem(key));
    if (Number.isFinite(value)) return clamp(value);
  } catch {
    // Storage can be blocked. The default volume still applies.
  }
  return fallback;
}

function save(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // The slider still changes this visit.
  }
}

function playBell() {
  bell.currentTime = 0;
  bell.play().catch(() => {});
}

export function createAudio() {
  music.volume = stored(MUSIC_KEY, 0.45);
  bell.volume = stored(BELL_KEY, 0.55);

  return {
    musicVolume() {
      return music.volume;
    },
    bellVolume() {
      return bell.volume;
    },
    setMusicVolume(value) {
      music.volume = clamp(value);
      save(MUSIC_KEY, music.volume);
    },
    setBellVolume(value) {
      bell.volume = clamp(value);
      save(BELL_KEY, bell.volume);
    },
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
