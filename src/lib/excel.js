/**
 * Simple Excel export helpers for client-side (no external deps)
 * Uses HTML table format which Excel can open
 */

export function buildExcelContent(rows = [], headers = []) {
  // Build HTML table that Excel can open
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Sheet1</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 8px; }
        th { background-color: #f0f0f0; font-weight: bold; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>
        </thead>
        <tbody>
  `;

  for (const row of rows) {
    html += '<tr>';
    for (const header of headers) {
      const value = row[header] ?? '';
      html += `<td>${escapeHtml(String(value))}</td>`;
    }
    html += '</tr>';
  }

  html += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  return html;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function downloadExcel(content, filename = `export-${new Date().toISOString()}.xls`) {
  const blob = new Blob([content], { 
    type: 'application/vnd.ms-excel;charset=utf-8;' 
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportObjectsToExcel(rows = [], columns = [], filename) {
  if (!rows || rows.length === 0) return null;
  const content = buildExcelContent(rows, columns);
  downloadExcel(content, filename ?? `export-${new Date().toISOString()}.xls`);
  return content;
}

export default {
  buildExcelContent,
  downloadExcel,
  exportObjectsToExcel,
};
