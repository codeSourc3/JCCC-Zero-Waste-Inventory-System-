import {Resources, RestClient} from '../api/rest-client.js';
import { checkPropertiesMatch } from '../types.js';
import { ResourceRepository } from './resource-repo.js';

class BinWeight {
    constructor(binId, weight, dateEmptied=new Date()) {
        this.binId = Number(binId);
        this.weight = Number(weight);
        this.dateEmptied = dateEmptied;
    }

    getTimeSinceWeighed() {
        const now = Date.now();
        const timeSinceMillis = now - this.dateEmptied;
        const timeSince = new Date(timeSinceMillis);
        return timeSince;
    }
}

class Bin {
    constructor(id, type, weight, isReturned, location, notes) {
        this.binId = Number(id);
        this.binType = String(type);
        this.lastBinWeight = weight;
        this.isReturned = new Boolean(isReturned);
        this.location = String(location);
        this.notes = String(notes);
        this.previousWeights = [];
    }

    static fromObject(obj) {
        if (checkPropertiesMatch(obj, ...Bin.properties())) {
            return new Bin(obj.binId, obj.binType, obj.lastBinWeight, obj.isReturned, obj.location, obj.notes);
        } else {
            throw new TypeError(`Could not convert ${JSON.stringify(obj)} to Bin.`);
        }
    }

    static properties() {
        return ['binId', 'binType', 'lastBinWeight', 'isReturned', 'location', 'notes'];
    }

    weigh(weight) {
        const prevWeight = new BinWeight(this.binId, this.lastBinWeight);
        this.lastBinWeight = Math.abs(weight);
        this.previousWeights.push(prevWeight);
    }

    getPreviousWeights() {
        return this.previousWeights;
    }

    toJSON() {
        return {
            binId: this.binId,
            binType: this.binType,
            lastBinWeight: this.lastBinWeight,
            isReturned: this.isReturned,
            location: this.location,
            notes: this.notes
        };
    }
}

const toBin = row => Bin.fromObject(row);

class BinRepository extends ResourceRepository {
    constructor() {
        super(Resources.BINS);
    }

    async getAll(offset=0, limit=10, predicate=(row)=>true) {
        const results = await super.getAll(offset, limit);
        const bins = results.filter(predicate).map(toBin);
        return bins;
    }

    async add(bin) {
        let id;
        if (bin instanceof Bin) {
            id = await super.add(task);
        } else if (checkPropertiesMatch(bin, ...Bin.properties())) {
            id = await super.add(Bin.fromObject(bin));
        }
        return id;
    }

    async remove(binId) {
        const id = Number(binId);
        let succeeded = await super.remove(id);
        return succeeded;
    }

    async update(binId, bin) {
        const updateId = Number(binId);
        const id = await super.update(updateId, bin);
        return id;
    }

    async get(binId) {
        const id = Number(binId);
        const result = await super.get(id);
        const bin = toBin(result);
        return bin;
    }
}

export {Bin, BinWeight, BinRepository};