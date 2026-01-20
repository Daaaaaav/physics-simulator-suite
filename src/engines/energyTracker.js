export function computeEnergy({ y, v, m = 1, k = 0 }, type = "gravity") {
  const g = 9.8;

  const KE = 0.5 * m * v * v;

  let PE = 0;
  if (type === "gravity") {
    PE = m * g * y;
  } else if (type === "spring") {
    PE = 0.5 * k * y * y;
  }

  return { KE, PE, E: KE + PE };
}
