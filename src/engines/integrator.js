export function step(state, derivatives, dt) {
  const next = { ...state };
  for (const key in derivatives) {
    next[key] = state[key] + derivatives[key] * dt;
  }
  return next;
}