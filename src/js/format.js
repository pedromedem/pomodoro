export function formatClock(ms) {
  const safe = Number.isFinite(ms) ? ms : 0;
  const totalSeconds = safe <= 0 ? 0 : Math.ceil(safe / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return {
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export function formatDuration(ms) {
  const totalSeconds = Math.floor(
    Math.max(0, Number.isFinite(ms) ? ms : 0) / 1000,
  );
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatFocus(ms) {
  const totalMinutes = Math.floor(Math.max(0, Number.isFinite(ms) ? ms : 0) / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}`;
}

export function formatTitle(ms, statusText) {
  const clock = formatClock(ms);
  return `${clock.minutes}:${clock.seconds} | ${statusText}`;
}
