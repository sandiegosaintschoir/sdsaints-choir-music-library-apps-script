// ============================================
// Utility Functions
// ============================================

function stripNonAlphanumeric(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getColNumberByHeaderName(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    headerName: string,
    headerRow: number,
): number {
    const range = sheet.getRange(headerRow, 1, 1, sheet.getLastColumn());
    const values = range.getDisplayValues()[0];
    for (let col = 0; col < values.length; col++) {
        if (values[col] === headerName) {
            return col + 1;
        }
    }
    throw new Error(
        `[getColNumberByHeaderName] Could not find col with name ${headerName} in row ${headerRow}`,
    );
}

// Gets the max value in a column. If there are no numbers or it is empty, it returns -1
function getMaxValueInCol(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    col: number,
    row: number = 1,
): number {
    const range = sheet.getRange(row, col, sheet.getLastRow());
    const vals = range
        .getValues()
        .flat()
        .filter((v) => v && typeof v === "number");

    if (vals.length === 0) {
        return -1;
    }

    return Math.max(...vals);
}
