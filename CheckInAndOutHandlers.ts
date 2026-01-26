function handleCheckInSubmission(
    e: GoogleAppsScript.Events.SheetsOnFormSubmit,
    itemsSheet: GoogleAppsScript.Spreadsheet.Sheet,
) {
    if (e.range.getSheet().getName() !== SHEET_NAMES.CHECKIN_RESPONSES) return;

    const timestamp = e.values[CHECKIN_FORM.TIMESTAMP_INDEX];
    const itemIdsString = e.values[CHECKIN_FORM.ITEM_IDS_INDEX];
    const itemIds = parseItemIds(itemIdsString);
    const itemIdSet = new Set(itemIds);

    Logger.log(
        `[handleCheckInSubmission] Checking in items with the following ID's: ${JSON.stringify(itemIds)}`,
    );

    const itemRows = getRequestedItemRows(itemsSheet, itemIdSet);
    for (let itemRow of itemRows) {
        Logger.log(
            `[handleCheckInSubmission] Updating item row to checked in: ${itemRow}`,
        );
        const statusCell = itemsSheet.getRange(
            itemRow,
            ITEMS_SHEET.STATUS_COL,
            1,
            ITEMS_SHEET.CHECKIN_UPDATE_NUM_COLS,
        );
        statusCell.setValues([
            [ITEMS_SHEET.ITEM_CHECKED_IN_TEXT, timestamp, "", ""],
        ]);
    }
}

function handleCheckOutSubmission(
    e: GoogleAppsScript.Events.SheetsOnFormSubmit,
    itemsSheet: GoogleAppsScript.Spreadsheet.Sheet,
) {
    if (e.range.getSheet().getName() !== SHEET_NAMES.CHECKOUT_RESPONSES) return;

    const timestamp = e.values[CHECKOUT_FORM.TIMESTAMP_INDEX];
    const itemIdsString = e.values[CHECKOUT_FORM.ITEM_IDS_INDEX];
    const itemIds = parseItemIds(itemIdsString);
    const itemIdSet = new Set(itemIds);
    const userName = e.values[CHECKOUT_FORM.USER_NAME_INDEX];
    const userEmail = e.values[CHECKOUT_FORM.USER_EMAIL_INDEX];

    Logger.log(
        `[handleCheckOutSubmission] Checking out items with the following ID's: ${JSON.stringify(itemIds)}`,
    );

    const itemRows = getRequestedItemRows(itemsSheet, itemIdSet);
    for (let itemRow of itemRows) {
        Logger.log(
            `[handleCheckOutSubmission] Updating item row to checked out: ${itemRow}`,
        );
        const statusRange = itemsSheet.getRange(
            itemRow,
            ITEMS_SHEET.STATUS_COL,
            1,
            ITEMS_SHEET.CHECKIN_UPDATE_NUM_COLS,
        );
        statusRange.setValues([
            [ITEMS_SHEET.ITEM_CHECKED_OUT_TEXT, timestamp, userName, userEmail],
        ]);
    }
}

function parseItemIds(itemIdsString: string): string[] {
    // Match a regular expression which captures numbers inside "[_" and "_]" delimiters
    const ids = Array.from(itemIdsString.matchAll(/\[_(\d+)_\]/g), (m) => m[1]);
    return ids;
}

function getRequestedItemRows(
    itemsSheet: GoogleAppsScript.Spreadsheet.Sheet,
    itemIdSet: Set<string>,
): number[] {
    if (itemsSheet.getName() !== SHEET_NAMES.ITEMS_SHEET) {
        throw new Error(
            "[getRequestedItemRows] Tried to get the unique ids from a sheet that was not the items sheet",
        );
    }

    const startRow = ITEMS_SHEET.HEADER_ROW + 1;
    const idRange = itemsSheet.getRange(
        ITEMS_SHEET.HEADER_ROW + 1,
        ITEMS_SHEET.UNIQUE_ID_COL,
        itemsSheet.getLastRow(),
    );
    const idValues = idRange.getDisplayValues().flat();
    let requestedRowNumbers = [];
    for (let i = 0; i < idValues.length; i++) {
        if (itemIdSet.has(idValues[i].trim())) {
            requestedRowNumbers.push(i + startRow);
        }
    }
    return requestedRowNumbers;
}

// TODO: If we decide to normalize the date format, we could do it here,
// but since google forms do not include a timezone in the timestamp, we
// want to make sure we interpret the timestamp string without a timezone.
// When we use the Date class, I believe it will interpret the timestamp as
// being in the UTC timezone which could lead to issues. Instead we should infer
// that the timestamp from the google form is in the correct timezone and
// use it directly.
// function formatDate(timestamp: string): string {
//     const date = new Date(timestamp);
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${month}/${day}/${year}`; // Format: mm/dd/yyyy
// }
