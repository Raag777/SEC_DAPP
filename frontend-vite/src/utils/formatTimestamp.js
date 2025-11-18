// src/utils/formatTimestamp.js
export function fmt(ts) {
  if (!ts) return "N/A";

  const date = new Date(Number(ts) * 1000);
  return date.toLocaleString();
}
