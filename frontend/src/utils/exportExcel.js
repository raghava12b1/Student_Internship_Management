import * as XLSX from "xlsx";


/**
 * Export an array of objects to an Excel (.xlsx) file.
 *
 * @param {Object[]} data       - Array of row objects.
 * @param {Object[]} columns    - Column definitions: { header, key }.
 * @param {string}   [filename] - Download file name (default: "report.xlsx").
 */
export const exportToExcel = (
  data,
  columns,
  filename = "report.xlsx"
) => {

  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }


  /*
   * Build rows with only the specified columns
   * and use the header labels as keys.
   */

  const rows = data.map((item) => {

    const row = {};

    columns.forEach((col) => {
      row[col.header] = item[col.key] ?? "--";
    });

    return row;

  });


  /*
   * Create workbook and worksheet.
   */

  const worksheet = XLSX.utils.json_to_sheet(rows);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Report"
  );


  /*
   * Auto-size columns based on header length.
   */

  const columnWidths = columns.map((col) => ({
    wch: Math.max(
      col.header.length + 2,
      15
    ),
  }));

  worksheet["!cols"] = columnWidths;


  /*
   * Trigger browser download.
   */

  XLSX.writeFile(workbook, filename);

};
