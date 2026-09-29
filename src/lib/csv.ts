// Client-side CSV conversion and file download utilities for Escape in Yoga

/**
 * Converts headers and row data into a properly formatted CSV string
 */
export function convertToCSV(
  headers: string[],
  rows: (string | number)[][]
): string {
  const escapeCell = (cell: string | number): string => {
    const stringVal = cell !== null && cell !== undefined ? String(cell) : "";
    // Escape double quotes by doubling them and enclose the entire cell in quotes
    return `"${stringVal.replace(/"/g, '""')}"`;
  };

  const headerLine = headers.map(escapeCell).join(",");
  const rowLines = rows.map((row) => row.map(escapeCell).join(","));

  return [headerLine, ...rowLines].join("\n");
}

/**
 * Triggers client-side browser download for a CSV file
 */
export function downloadCSV(filename: string, csvContent: string): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
