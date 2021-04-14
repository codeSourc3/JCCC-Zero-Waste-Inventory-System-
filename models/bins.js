/**
 * The model for the Bin resource. Takes care of business logic and validation.
 * 
 * @author Enzo Mayo
 * @todo Create the class
 */

/**
 * @readonly
 * @enum {string}
 */
const BinType = {
    EOC: 'EOC',
    /**
     * Determines if the value matches anything in the enum.
     * 
     * @param {string} value the enum value.
     * @returns {boolean} true if a match was found.
     */
    valueMatches(value) {
        const values = Object.values(BinType);
        return values.includes(value);
    }
}

class Bin {
    constructor(id, type=BinType.EOC, weight=0.0, isReturned=true) {
        /**@private */
        this._binId = id;
        /**@private */
        this._binType = type;
        /**@private */
        this._binWeight = weight;
        /**@private */
        this._isReturned = isReturned;
    }

    get binId() {
        return this._binId;
    }

    set binId(value) {
        const id = Number(value);
        if (id > 0) {
            this._binId = id;
        }
    }

    get binType() {
        return this._binType;
    }

    get binWeight() {
        return this._binWeight;
    }

    get isReturned() {
        return this._isReturned;
    }

    static fromObject(object) {
        let {binId, binType, binWeight, isReturned} = object;
        if (typeof(binId) !== 'number') {
            binId = Number(binId);
        }
        if (typeof(binWeight) !== 'number') {
            binWeight = Number(binWeight);
        }
        if (typeof(isReturned) === 'string') {
            isReturned = new Boolean(isReturned.toLowerCase());
        }
        return new Bin(binId, binType, binWeight, isReturned);
    }

    toObject() {
        const self = this;
        const bool = new Boolean(self._isReturned);
        return {
            binId: self._binWeight,
            binType: self._binType,
            binWeight: self._binWeight,
            isReturned: bool.toString().toUpperCase()
        };
    }

    equals(object) {
        let isEqual = false;
        if (object instanceof Bin) {
            isEqual = object.binId === this.binId;
            isEqual = object.binType === this.binType;
            isEqual = object.binWeight === this.binWeight;
            isEqual = object.isReturned === this.isReturned;
        } else if ('binId' in object && 'binType' in object && 'binWeight' in object && 'isReturned' in object) {
            isEqual = this._binId === object.binId;
            isEqual = this._binType === object.binType;
            isEqual = this._binWeight === object.binWeight;
            isEqual = this._isReturned === object.isReturned;
        }
        return isEqual;
    }

    get id() {
        return this._binId;
    }

    get type() {
        return this._binType;
    }

    set type(value) {
        if (BinType.valueMatches(value)) {
            this._binType = value;
        }
    }

    get weight() {
        return this._binWeight;
    }

    set weight(value) {
        if (typeof(value) === 'number' && Number.isInteger(value)) {
            this._binWeight = value;
        } else {
            this._binWeight = Number(value);
        }
    }

    returnBin() {
        this._isReturned = true;
    }

    checkOutBin() {
        this._isReturned = false;
    }

    toArray() {
        return [this._binId, this._binType, this._binWeight, this._isReturned];
    }
}

module.exports = {Bin, BinType};