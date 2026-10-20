export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function wrapAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

export function lerpAngle(from, to, t) {
  const delta = wrapAngle(to - from);
  return from + delta * t;
}

export function dist2(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

export function rand(min, max) {
  return min + Math.random() * (max - min);
}
