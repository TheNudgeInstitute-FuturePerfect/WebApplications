import { utils, writeFile } from "xlsx";
import { date, duration } from "../../tools";

export const generateExcelSheet = (apiResponse, headers, fields, filename) => {
  const workbook = utils.book_new();
  const sheetData = [];

  // Add header row
  sheetData.push(headers);

  // Convert the API response into sheet data
  apiResponse.forEach((item) => {
    const rowData = fields.map((field) => {
      if (field.key === "virtual") {
        if (field.function === "duration") {
          return duration(...field.arguments.map((argument) => item[argument]));
        }
      }
      return field.type === "date" ? date(item[field.key]) : item[field.key];
    });
    sheetData.push(rowData);
  });

  const worksheet = utils.aoa_to_sheet(sheetData);
  utils.book_append_sheet(workbook, worksheet, "Sheet1");

  writeFile(workbook, filename);
};
