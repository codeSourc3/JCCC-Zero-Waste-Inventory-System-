import * as rest from '../api/fetch.js';

/**
 * 
 * @typedef {Object} Bin
 * @property {number} binId - the bin id.
 * @property {string} binType - the bin type
 * @property {number} lastBinWeight
 * @property {boolean} isReturned
 * @property {string} location
 * @property {string} notes
 */

/**
 * 
 * @param {*} bin 
 * @returns 
 */
export const addBin = async (bin) => {
    const id = await rest.create('/bins', bin);
    return id;
};

/**
 * Finds a bin.
 * @param {number} id 
 * @returns {{success: boolean, message: string | undefined, data: Bin}}
 */
export async function findBin(id) {
    let binId = parseInt(id);
    const bin = await rest.get(`/bins/${binId}`);
    return bin;
};

export const getOutBins = async () => {
    const bins = await rest.get('/bins/out');
    return bins;
};

export const getPreviousWeights = async (binId) => {
    const weights = await rest.get('/bins/' + Number(binId) + '/weights');
    return weights;
};

const isPresent = (value, func) => {
    if (typeof(value) !== 'undefined') {
        func(value);
    }
};

export const updateBin = async (id, {location, notes, isReturned, binType, lastBinWeight}) => {
    const obj = {};
    isPresent(location, value => obj.location = value);
    isPresent(notes, value => obj.notes = value);
    isPresent(isReturned, value => obj.isReturned = value);
    isPresent(binType, value => obj.isReturned = value);
    isPresent(lastBinWeight, value => obj.lastBinWeight = value);
    const result = await rest.update(`/bins/${Number(id)}`, obj);
    return result;
};

export const removeBin = async (id, status='Lost') => {
    const result = await rest.remove('/bins/' + Number(id), {status: status});
    return result;
};