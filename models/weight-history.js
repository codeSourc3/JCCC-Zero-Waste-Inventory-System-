const {Bin} = require('./bins');

/**
 * Parses a date written in the format MM/DD/YYYY
 * @param {string} string a string representing a date in the format MM/DD/YYYY
 * @returns {Date} the parsed date.
 */
const parseDate = (string) => {
    let parts = string.split('/');
    let month = parseInt(parts[0]);
    let day = parseInt(parts[1]);
    let year = parseInt(parts[2]);
    const parsedDate = new Date();
    parsedDate.setFullYear(year, month - 1, day);
    return parsedDate;
};

/**
 * Converts a date into a string.
 * @param {Date} date the date.
 * @returns {string} a string in the form MM/DD/YYYY
 */
const dateToString = (date) => {
    return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
};

class WeightHistory {

    /**
     * Constructs an individual record of the a bins weight.
     * 
     * @param {number} weightId
     * @param {number} binId 
     * @param {number} weight 
     * @param {Date} dateEmptied 
     */
    constructor(weightId, binId, weight, dateEmptied = new Date()) {
        /**@private */
        this._weightId = weightId;
        /**@private */
        this._binId = binId;
        /**@private */
        this._weight = weight;
        /**@private */
        this._dateEmptied = dateEmptied;
    }

    static fromObject(obj) {
        let {weightId, binId, weight, dateEmptied} = obj;
        if (typeof dateEmptied === 'string') {
            let date = parseDate(dateEmptied);
            dateEmptied = date;
        }
        return new WeightHistory(weightId, binId, weight, dateEmptied);
    }

    get weightId() {
        return this._weightId;
    }

    set weightId(value) {
        this._weightId = Number(value);
    }

    get binId() {
        return this._binId;
    }

    get weight() {
        return this._weight;
    }

    get dateEmptied() {
        return this._dateEmptied;
    }

    toJSON() {
        return {
            weightId: Number(this._weightId),
            binId: Number(this._binId),
            weight: Number(this._weight),
            dateEmptied: dateToString(this._dateEmptied)
        };
    }
}

module.exports = {WeightHistory};