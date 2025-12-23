/**
 * Excel Helper
 * =============
 * Helper untuk export data ke format Excel (HTML table) tanpa library eksternal.
 */

export function buildExcelContent(
  rows = [],
  headers = [],
  title = "Laporan Pesanan"
) {
  const exportDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; color: #334155; }
        .title { font-size: 24px; font-weight: bold; color: #15803d; margin-bottom: 5px; }
        .subtitle { font-size: 14px; color: #64748b; margin-bottom: 20px; font-style: italic; }
        table { border-collapse: collapse; width: 100%; border: 2px solid #e2e8f0; }
        th { 
          background-color: #22C55E; 
          color: #ffffff; 
          font-weight: bold; 
          padding: 12px 8px; 
          border: 1px solid #16a34a;
          text-transform: uppercase;
          font-size: 13px;
        }
        td { padding: 10px 8px; border: 1px solid #e2e8f0; font-size: 12px; vertical-align: middle; }
        .even-row { background-color: #f8fafc; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="${headers.length}" style="border:none;">
            <div class="title">🥬 GREECERI STORE - ${escapeHtml(title).toUpperCase()}</div>
            <div class="subtitle">Data laporan diekspor pada: ${exportDate}</div>
          </td>
        </tr>
      </table>

      <table>
        <thead>
          <tr>
            ${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
  `;

  rows.forEach((row, index) => {
    html += `<tr class="${index % 2 === 0 ? "" : "even-row"}">`;
    for (const header of headers) {
      const value = row[header] ?? "";
      html += `<td>${escapeHtml(String(value))}</td>`;
    }
    html += "</tr>";
  });

  html += `
        </tbody>
      </table>
      <div style="margin-top: 20px; font-size: 11px; color: #888;">
        © ${new Date().getFullYear()} Greeceri Store - Fresh & Quality Products
      </div>
    </body>
    </html>
  `;

  return html;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Perbaikan fungsi generateFilename sesuai permintaan
function generateFilename() {
  const now = new Date();
  const dateStr = now
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-"); // Mengubah format tanggal menjadi DD-MM-YYYY
    
  return `Laporan Pesanan Greeceri Store (${dateStr}).xls`;
}

export function downloadExcel(content, filename) {
  // Jika filename tidak dikirim dari luar, gunakan format default baru
  const finalFilename = filename ?? generateFilename();
  const encodedContent = encodeURIComponent(content);
  const dataUrl = `data:application/vnd.ms-excel;charset=utf-8,${encodedContent}`;

  const newWindow = window.open(dataUrl, "_blank");
  if (newWindow) {
    newWindow.document.title = finalFilename;
  }
}

export function exportObjectsToExcel(
  rows = [],
  columns = [],
  filename,
  title = "Laporan Pesanan"
) {
  if (!rows || rows.length === 0) return null;
  const content = buildExcelContent(rows, columns, title);
  // Menggunakan filename yang sudah disesuaikan
  downloadExcel(content, filename ?? generateFilename());
  return content;
}

export default {
  buildExcelContent,
  downloadExcel,
  exportObjectsToExcel,
};