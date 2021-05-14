const db = require('./db');
const {WeightHistory} = require('../models/weight-history');
const { GoogleSpreadsheet, GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } = require('google-spreadsheet');


class WeightHistoryRepository {

    /**
     * 
     * @param {GoogleSpreadsheet} doc 
     */
    constructor(doc) {
        /**@private */
        this._doc = doc;
        /**
         * @private
         * @type {GoogleSpreadsheetWorksheet}
         */
        this._sheet = this._doc.sheetsByTitle['WeightHistory'];
        /**
         * @type {GoogleSpreadsheetRow[]}
         * @private
         */
        this._unsavedRows = [];
    }

    /**
     * 
     * @returns {Promise<WeightHistoryRepository>}
     */
    static async load() {
        const database = await db;
        return new WeightHistoryRepository(database);
    }

    /**
     * 
     * @param {number} offset 
     * @param {number} limit 
     * @returns {Promise<WeightHistory[]>}
     */
    async getAll(offset = 0, limit = 10) {
        const results = await this._sheet.getRows({offset, limit});
        const weightHistory = results.map(row => WeightHistory.fromObject(row));
        return weightHistory;
    }

    /**
     * 
     * @param {number} binId 
     * @returns {Promise<WeightHistory[]>}
     */
    async getByBinId(binId) {
        const id = Number(binId);
        const results = await this._sheet.getRows();
        const binWeights = results.filter(row => Number(row.binId) === id);
        const weights = binWeights.map(row => WeightHistory.fromObject(row));
        return weights;
    }

    /**
     * 
     * @param {WeightHistory} weightHistory the weight history to add.
     * @returns {Promise<number>}
     */
    async add(weightHistory) {
        const ids = (await this._sheet.getRows()).map(row => Number(row.weightId));
        let nextId = Math.max(...ids) + 1;


        if (weightHistory instanceof WeightHistory) {
            weightHistory.weightId = nextId;
            let addedRow = await this._sheet.addRow(weightHistory.toJSON());
            this._unsavedRows.push(addedRow);
            return nextId;
        } else {
            throw new TypeError(`Expected an WeightHistory object, not ${weightHistory}`);
        }
    }

    /**
     * 
     * @param {number} id
     * @returns {Promise<WeightHistory>} 
     */
    async getById(id) {
        const weightId = Number(id);
        const rows = await this._sheet.getRows();
        let row = rows.find(row => Number(row.weightId) === weightId);
        if (!row) {
            throw new Error(`WeightHistory of ${weightId} was not found.`);
        }
        let weightHistory = WeightHistory.fromObject(row);
        return weightHistory;
    }

    /**
     * Updates the WeightHistory by the weight id and returns
     * the row updated. 
     * 
     * @param {number} weightId 
     * @param {WeightHistory | Object} newWeight the entity to update with.
     * @returns {Promise<number>}
     */
    async update(weightId, newWeight) {
        
        // try to use unsaved rows first.
        let row = this._unsavedRows.find(row => Number(row.weightId) == Number(weightId));
        const rows = await this._sheet.getRows();
        if (!row) {
            row = rows.find(row => Number(row.weightId) === Number(weightId));
        }
        // row of weight id couldn't be found in unsaved rows or the sheet.
        if (!row) {
            throw new Error(`Weight History has to exist to be updated.`);
        }
        // make JS object enumerable.
        let object = newWeight;
        if (newWeight instanceof WeightHistory) {
            object = newWeight.toJSON();
        }
        // overwrite all properties except the weight id.
        for (const key in object) {
            if (key !== 'weightId' && object[key]) {
                row[key] = object[key];
            }
        }
        this._unsavedRows.push(row);
        return row.rowIndex;
    }


    /**
     * Deletes the WeightHistory object from the sheet.
     * 
     * @param {number} weightId the id of the weight.
     * @returns {Promise<boolean>} a Promise resolving to
     * true if the weight history was successfully deleted
     * and false otherwise.
     */
    async delete(weightId) {
        const id = Number(weightId);
        // Use unsaved rows first.
        let targetRow = this._unsavedRows.find(row => Number(row.weightId) === id);
        if (typeof targetRow === 'undefined') {
            targetRow = (await this._sheet.getRows()).find(row => Number(row.weightId) === id);
        } 
        if (targetRow) {
            await targetRow.delete();
            return true;
        } else {
            return false;
        }

    }


    /**
     * 
     */
    async save() {
        for (const weight of this._unsavedRows) {
            await weight.save();
        }
        this._unsavedRows = [];
    }
}

module.exports = WeightHistoryRepository;