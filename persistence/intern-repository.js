const db = require('./db');
const {Intern, Admin} = require('../models/interns');
const {TaskStatus, Task, BinTask} = require('../models/tasks');
const { GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } = require('google-spreadsheet');
const role = require('../models/role');

/**
 * 
 * @class
 */
class InternRepository {

    constructor(doc) {
        /**@private */
        this._doc = doc;
        /**
         * @private
         * @type {GoogleSpreadsheetWorksheet} */
        this._sheet = this._doc.sheetsByTitle['Interns'];
        /**
         * @type {GoogleSpreadsheetRow[]}
         * @private
         */
        this._unsavedRows = [];
    }
    
    static async load() {
        const database = await db;
        return new InternRepository(database);
    }

    /**
     * Gets a list of Interns offset by a parameter and 
     * limited by another parameter.
     * 
     * @param {Number} offset the offset rows to be retrieved.
     * @param {Number} limit the maximum amount of rows to be retrieved.
     * @returns {Promise<Intern[]>} a Promise containing an array of Intern objects.
     */
    async getAll(offset = 0, limit = 10) {
        // assert offset >= 0 && limit > 0

        const results = await this._sheet.getRows({offset, limit});
        const interns = results.map(row => Intern.fromObject(row));
        return interns;
    }

    async findByUsernameAndPassword(username, password) {
        const results = await this._sheet.getRows();
        const user = results.find(u => u.username === username && u.password === password);
        /**@type {Admin | Intern} */
        let result;
        if (user.role === role.Admin) {
            result = Admin.fromObject(user);
        } else {
            result = Intern.fromObject(user);
        }
        return result;
    }


    /**
     * Gets an Intern by id.
     * 
     * @param {Number} id the id starting at 1
     * @returns {Promise<Intern>} a Promise containing an Intern.
     */
    async getById(id) {
        const internId = Number(id);
        // Gets a single Intern
        const interns = await this._sheet.getRows();
        let intern = interns.find(row => Number(row.internId) === internId);
        if (!intern) {
            throw new Error(`Intern of ${internId} was not found.`);
        }
        intern = Intern.fromObject(intern);
        return intern;
    }

    /**
     * Adds an Intern to the end of the sheet.
     * 
     * @param {Intern} intern the Intern to add.
     * @returns {Promise<number>} the index the Intern was added to.
     */
    async add(intern) {
        // Validates the intern before adding it.
        const ids = (await this._sheet.getRows()).map(row => Number(row.internId));
        let nextId = Math.max(...ids);
        nextId++;

        if (intern instanceof Intern) {
            intern.internId = nextId;
            let addedRow = await this._sheet.addRow(intern.toJSON());
            this._unsavedRows.push(addedRow);
            return addedRow.rowIndex;
        } else {
            throw new TypeError(`Expected an Intern object, not ${intern}`);
        }
    }

    /**
     * Updates an existing intern.
     * 
     * @param {number} internId 
     * @param {Intern | Object} newIntern 
     * @returns {Promise<number>} the row index updated.
     */
    async update(internId, newIntern) {
        // find the intern by id.
        const rows = await this._sheet.getRows();
        // find the intern.
        const row = rows.find(row => Number(row.internId) === Number(internId));
        if (!row) {
            throw new Error(`Intern has to exist to be updated.`);
        }
        let object = newIntern;
        if (newIntern instanceof Intern) {
            object = newIntern.toJSON();
        }
        for (const key in object) {
            if (key !== 'internId' && object[key]) {
                row[key] = object[key];
            }
        }
        this._unsavedRows.push(row);
        return row.rowIndex - 1;
    }

    /**
     * 
     * @param {number} internId 
     * @returns {Promise<boolean>} a Promise resolving to true if 
     * the intern was successfully deleted and false otherwise.
     */
    async delete(internId) {
        /**@todo maybe attempt to use unsaved rows first. */
        const rows = await this._sheet.getRows();
        const targetRow = rows.find(row => Number(row.internId) === Number(internId));
        if (targetRow) {
            // delete row
            await targetRow.delete();
            return true;
        } else {
            return false;
        }
    }
    

    /**
     * Saves all changes since the last save to the sheet.
     */
    async save() {
        for (const intern of this._unsavedRows) {
            await intern.save();
        }
        this._unsavedRows = [];
    }
}

module.exports = InternRepository;