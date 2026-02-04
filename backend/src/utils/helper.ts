export function toUTC7(exp?: number) {
  return exp ? new Date(exp * 1000 + 7 * 60 * 60 * 1000).toISOString() : null;
}