const {Bin} = require('./bins');

class WeightHistory {

    /**
     * Constructs an individual record of the a bins weight.
     * 
     * @param {number} weightId
     * @param {number} binId 
     * @param {number} weight 
     * @param {Date} dateEmptied 
     */
    constructor(weightId, binId, weight, dateEmptied) {
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
        const {weightId, binId, weight, dateEmptied} = obj;
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
            dateEmptied: this._dateEmptied
        };
    }
}

module.exports = {WeightHistory};