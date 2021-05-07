import * as rest from '../api/fetch.js';

export const addBin = async ({binId, binType='EOC'}) => {
    const id = await rest.create('/bins', {binId, binType});
    return id;
};

export const getOutBins = async () => {
    const bins = await rest.get('/bins/out');
    return bins;
};

export const getPreviousWeights = async (binId) => {
    const weights = await rest.get('/bins/' + Number(binId) + '/weights');
    return weights;
};

export const updateBin = async (id, {location, notes, isReturned, binType, lastBinWeight}) => {
    const result = await rest.update('/bins/' + Number(id), {location, notes, isReturned, binType, lastBinWeight});
    return result;
};

export const removeBin = async (id, isLost=false) => {
    const result = await rest.remove('/bins/' + Number(id), {isLost: isLost});
    return result;
};