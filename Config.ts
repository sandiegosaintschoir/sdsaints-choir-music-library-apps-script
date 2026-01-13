// ============================================
// CONFIGURATION - Column Mappings
// ============================================

const SHEET_NAMES = {
    ITEMS_SHEET: "Items",
};

// Items Sheet Column Indices (0-based for array access)
const ITEMS_SHEET = {
    HEADER_ROW: 1,
    UNIQUE_ID_COL: 1,
    STATUS_COL: 3,
};

// Check Out Form Response Indices (0-based for e.values array)
const CHECKOUT_FORM = {
    USER_EMAIL: 1,
    RETURN_DATE: 2,
    ITEM_IDS: 3,
    USER_NAME: 4,
};

// Check In Form Response Indices (0-based for e.values array)
const CHECKIN_FORM = {
    ITEM_IDS: 2,
};
