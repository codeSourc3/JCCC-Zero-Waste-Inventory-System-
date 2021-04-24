const db = require('./db');
const {Bin} = require('../models/bins');
const { GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow, GoogleSpreadsheet } = require('google-spreadsheet');

/**
 * 
 * @class
 */
class BinRepository {


    /**
     * 
     * @param {GoogleSpreadsheet} doc 
     */
    constructor(doc) {
        /**
         * @private
         */
        this._doc = doc;
        
        /**
         * @type {GoogleSpreadsheetWorksheet}
         * @private
         */
        this._sheet = this._doc.sheetsByTitle['Bins'];

        /**
         * @type {GoogleSpreadsheetRow[]}
         * @private
         */
        this._unsavedRows = [];
    }

    /**
     * 
     * @returns {Promise<BinRepository>} a new BinRepository.
     */
    static async load() {
        const database = await db;
        return new BinRepository(database);
    }

    /**
     * Gets a list of Bins offset by a parameter and 
     * limited by another parameter.
     * 
     * @param {Number} offset the offset rows to be retrieved.
     * @param {Number} limit the maximum amount of rows to be retrieved.
     * @returns {Promise<Bin[]>} a Promise containing an array of Bin objects.
     */
    async getAll(offset = 0, limit = 10) {
        // assert offset >= 0 && limit > 0

        const results = await this._sheet.getRows({offset, limit});
        const bins = results.map(row => Bin.fromObject(row));
        return bins;
    }

    /**
     * Gets all bins that are out.
     * 
     * @returns {Promise<Bin[]>} a promise resolving to bins.
     */
    async getOutBins() {
        const rows = await this._sheet.getRows();
        const outBins = rows.filter(row => !row.isReturned).map(row => Bin.fromObject(row));
        return outBins;
    }

    /**
     * Gets a Bin by id.
     * 
     * @param {Number} id the id starting at 1
     * @returns a Promise containing an Intern.
     */
    async getById(id) {
        // Gets a single Intern
        let binId = Number(id);
        const bins = await this._sheet.getRows();
        let bin = bins.find(row => Number(row.binId) === binId);
        if (!bin) {
            throw new Error(`Bin of id=${id} does't exist.`);
        }
        let binObj = Bin.fromObject(bin);
        return binObj;
    }

    /**
     * Adds an Bin to the end of the sheet.
     * 
     * @param {Bin} bin the Bin to add.
     */
    async add(bin) {
        // Validates the bin before adding it.
        const binId = this._sheet.rowCount + 1;
        if (intern instanceof Bin) {
            bin.binId = binId;
            let addedRow = await this._sheet.addRow(bin);
            this._unsavedRows.push(addedRow);
            return addedRow.rowIndex - 1;
        } else {
            throw new TypeError(`The object ${bin} is not a Bin object.`);
        }
    }

    /**
     * Attempts to delete a bin by its id.
     * 
     * @param {number} binId the id of the bin to delete, starting at 1.
     * @returns {Promise<boolean>} a promise resolving to true if 
     * the bin was deleted, false otherwise.
     */
    async delete(binId) {
        const rows = await this._sheet.getRows();
        const id = Number(binId);
        const targetRow = rows.find(row => Number(row.binId) === id);
        if (targetRow) {
            // row with bin id exists.
            await targetRow.delete();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Attempts to update an existing bin.
     * Adds to the list of unsaved changes.
     * 
     * @param {number} binId 
     * @param {Bin | Object} newBin 
     * @returns {Promise<number>} a promise resolving to the row number updated.
     */
    async update(binId, newBin) {
        const rows = await this._sheet.getRows();
        // find bin
        const id = Number(binId);
        const row = rows.find(row => Number(row.binId) === id);
        if (!row) {
            throw new Error(`Bin of ${binId} doesn't exist or has been deleted`);
        }
        if (!newBin) {
            throw new Error('New bin is undefined or null.');
        }
        // update the row's attributes with the new bins attributes.
        let object = newBin;
        if (newBin instanceof Bin) {
            object = newBin.toJSON();
        }
        for (const key in object) {
            if (key !== 'binId' && object[key]) {
                row[key] = object[key];
            }
        }
        this._unsavedRows.push(row);
        return row.rowIndex - 1;
    }

    /**
     * Saves all changes since the last save to the sheet.
     */
    async save() {
        for (const bin of this._unsavedRows) {
            await bin.save();
        }
        this._unsavedRows = [];
    }
}

module.exports = BinRepository;