const {GoogleSpreadsheet, GoogleSpreadsheetWorksheet} = require('google-spreadsheet');
const config = require('../config/config.json');
const credentials = require('../config/client_secret.json');

/** @type {GoogleSpreadsheet} */
let doc;


module.exports = (async () => {
    doc = new GoogleSpreadsheet(config.sheetId);
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    return doc;
})();