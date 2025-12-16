/**
 * Simple CSV helpers for client-side export (no external deps)
 */

export function escapeCsvValue(v) {
  const s = v == null ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export function buildCsv(rows = [], headers = []) {
  const head = headers.join(",");
  const lines = [head];
  for (const r of rows) {
    const vals = headers.map((h) => {
      // support mapping by header key (if row is object)
      const v = r[h] ?? r[h.toLowerCase()] ?? "";
      return escapeCsvValue(v);
    });
    lines.push(vals.join(","));
  }
  return lines.join("\n");
}

export function downloadCsv(content, filename = `export-${new Date().toISOString()}.csv`) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportObjectsToCsv(rows = [], columns = [], filename) {
  if (!rows || rows.length === 0) return null;
  const csv = buildCsv(rows, columns);
  downloadCsv(csv, filename ?? `orders-${new Date().toISOString()}.csv`);
  return csv;
}

export default {
  escapeCsvValue,
  buildCsv,
  downloadCsv,
  exportObjectsToCsv,
};
