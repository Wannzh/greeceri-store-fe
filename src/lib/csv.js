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

export function buildCsv(rows = [], headers = [], title = "Greeceri Store") {
  const lines = [];

  // Add title header
  lines.push(`"${title}"`);
  lines.push(
    `"Tanggal Export: ${new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}"`
  );
  lines.push(""); // Empty line

  // Add column headers
  const head = headers.join(",");
  lines.push(head);

  // Add data rows
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

// Generate filename dengan tanggal
function generateFilename() {
  const now = new Date();
  const dateStr = now
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  return `Laporan Pesanan Greeceri Store (${dateStr}).csv`;
}

// Download menggunakan data URL
export function downloadCsv(content, filename) {
  const finalFilename = filename ?? generateFilename("Laporan Pesanan");
  const encodedContent = encodeURIComponent(content);
  const dataUrl = `data:text/csv;charset=utf-8,${encodedContent}`;

  // window.open untuk trigger download
  const newWindow = window.open(dataUrl, "_blank");
  if (newWindow) {
    newWindow.document.title = finalFilename;
  }
}

export function exportObjectsToCsv(
  rows = [],
  columns = [],
  filename,
  title = "Laporan Pesanan Greeceri Store"
) {
  if (!rows || rows.length === 0) return null;
  const csv = buildCsv(rows, columns, title);
  downloadCsv(csv, filename ?? generateFilename("Laporan Pesanan"));
  return csv;
}

export default {
  escapeCsvValue,
  buildCsv,
  downloadCsv,
  exportObjectsToCsv,
};
