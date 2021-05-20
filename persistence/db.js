const {GoogleSpreadsheet, GoogleSpreadsheetWorksheet} = require('google-spreadsheet');
const config = require('../config/config.json');
const credentials = require('../config/client_secret.json');

/** @type {GoogleSpreadsheet} */
let doc;


module.exports = (async () => {
    doc = new GoogleSpreadsheet(config.production.sheetId);
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    return doc;
})().catch(err => {
    console.error('Database was not setup correctly ', err);
    process.abort();
});