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
    BLUE_CART: 'Blue Cart',
    OTHER: 'Other',
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
};

class Bin {
    /**
     * Constructor for creating the Bin object.
     * 
     * @param {number} id the bin id.
     * @param {BinType} type the bin type.
     * @param {number} weight the last bin weight.
     * @param {boolean} isReturned if the bin is returned.
     * @param {string} location the current location of the bin.
     * @param {string} notes any notes on the bin.
     */
    constructor(id, type=BinType.EOC, weight=0.0, isReturned=true, location='', notes='') {
        /**@private */
        this._binId = id;
        /**@private */
        this._binType = type;
        /**@private */
        this._lastBinWeight = weight;
        /**@private */
        this._isReturned = isReturned;
        /**@private */
        this._location = location;
        /**@private */
        this._notes = notes;
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
        return this._lastBinWeight;
    }

    get isReturned() {
        return this._isReturned;
    }

    get location() {
        return this._location;
    }

    get notes() {
        return this._notes;
    }

    static fromObject(object) {
        let {binId, binType, lastBinWeight, isReturned, location, notes} = object;
        if (typeof(binId) !== 'number') {
            binId = Number(binId);
        }
        if (typeof(lastBinWeight) !== 'number') {
            lastBinWeight = Number(lastBinWeight);
        }
        if (typeof(isReturned) === 'string') {
            isReturned = new Boolean(isReturned.toLowerCase());
        }
        return new Bin(binId, binType, lastBinWeight, isReturned, location, notes);
    }

    toJSON() {
        const bool = new Boolean(this._isReturned);
        return {
            binId: this._binId,
            binType: this._binType,
            lastBinWeight: this._lastBinWeight,
            isReturned: bool.toString().toUpperCase(),
            location: this._location,
            notes: this._notes
        };
    }

    equals(object) {
        let isEqual = false;
        if (object instanceof Bin) {
            isEqual = object.binId === this.binId;
            isEqual = object.binType === this.binType;
            isEqual = object.lastBinWeight === this.lastBinWeight;
            isEqual = object.isReturned === this.isReturned;
            isEqual = object.location === this.location;
            isEqual = object.notes === this.notes;
        } else if ('binId' in object && 'binType' in object && 'lastBinWeight' in object 
        && 'isReturned' in object && 'location' in object && 'notes' in object) {
            isEqual = this._binId === object.binId;
            isEqual = this._binType === object.binType;
            isEqual = this._lastBinWeight === object.lastBinWeight;
            isEqual = this._isReturned === object.isReturned;
            isEqual = this._location === object.location;
            isEqual = this._notes === object.notes;
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
        return this._lastBinWeight;
    }

    set weight(value) {
        if (typeof(value) === 'number' && Number.isInteger(value)) {
            this._lastBinWeight = value;
        } else {
            this._lastBinWeight = Number(value);
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