// Escape strings for CSV downloads and guard against spreadsheet formula injection.
export function csvCell(value) {
  let text = String(value ?? "");
  if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}
export function csvRow(values) { return values.map(csvCell).join(","); }
