const headers = ["Submission Date", "Purchase Date", "Supplier", "Phone Number", "Category", "Amount", "Currency", "Description", "Receipt URL"];

const expenseRow = (expense) => [
  expense.submissionDate || "",
  expense.purchaseDate || "",
  expense.supplier || "",
  String(expense.phone ?? ""),
  expense.category || "",
  expense.rawAmount ?? "",
  expense.currencySign || "",
  expense.description || "",
  expense.receiptUrl || "",
];

export async function createExpenseExport(expenses) {
  const rows = expenses.map(expenseRow);

  // Load the workbook library only when an Excel export is requested.
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Expenses");
  sheet.addRow(headers);
  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.columns.forEach((column, index) => {
    column.width = [20, 20, 28, 22, 24, 16, 12, 45, 30][index];
  });
  for (const values of rows) {
    const row = sheet.addRow(values);
    const url = String(values[8]);
    if (/^https?:\/\//i.test(url)) {
      row.getCell(9).value = { text: "View receipt", hyperlink: url };
      row.getCell(9).font = { color: { argb: "FF0563C1" }, underline: true };
    }
  }
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}
