/**
 * CSV Helper
 * ===========
 * Helper untuk export data ke format CSV tanpa library eksternal.
 * 
 * Method:
 * - escapeCsvValue: Escape value untuk format CSV
 * - buildCsv: Bangun string CSV dari array data
 * - downloadCsv: Download string CSV sebagai file
 * - exportObjectsToCsv: Export array object ke file CSV
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

// Download menggunakan data URL
export function downloadCsv(content, filename = `export-${new Date().toISOString()}.csv`) {
  const encodedContent = encodeURIComponent(content);
  const dataUrl = `data:text/csv;charset=utf-8,${encodedContent}`;
  
  // window.open untuk trigger download
  const newWindow = window.open(dataUrl, '_blank');
  if (newWindow) {
    newWindow.document.title = filename;
  }
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
