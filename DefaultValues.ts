function initNewRowsWithDefaultValues(
    e: GoogleAppsScript.Events.SheetsOnChange,
) {
    // Initialize new rows in the Items table with default values

    const sheet = e.source.getActiveSheet();

    if (e.changeType !== "INSERT_ROW") return;
    if (sheet.getName() !== SHEET_NAMES.ITEMS_SHEET) return;

    const uniqueIdCol = ITEMS_SHEET.UNIQUE_ID_COL;
    const statusCol = ITEMS_SHEET.STATUS_COL;
    const headerRow = ITEMS_SHEET.HEADER_ROW;

    const range = sheet.getSelection().getActiveRange();
    if (!range)
        throw new Error("[autoGenerateUniqueIds] There was no active selection");

    // the next id to assign would be the max id plus 1
    const maxId = getMaxValueInCol(sheet, uniqueIdCol, headerRow + 1);
    let curId = maxId === -1 ? 1 : maxId + 1;

    const startRow = range.getRow();
    const numRows = range.getNumRows();
    let newValues = range.getValues();
    for (let i = 0; i < newValues.length; i++) {
        newValues[i][uniqueIdCol - 1] = curId++;
        newValues[i][statusCol - 1] = "Newly Created";
    }

    sheet
        .getRange(startRow, 1, numRows, 3)
        .setValues(newValues.map((row) => row.splice(0, 3)));
}
