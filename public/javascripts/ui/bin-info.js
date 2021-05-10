'use strict';

const binInfo = document.getElementById('js-bin-info');

async function findBin(id) {
    const module = await import('./bin.js');
    const { success, data, message } = await module.findBin(id);
    if (success) {
        return data;
    } else {
        throw new Error(message);
    }
}

async function getBins(offset = 0, limit = 10) {
    const module = await import('../api/bin-resource.js');
    const repo = new module.BinRepository();
    const bins = await repo.getAll(offset, limit);
    return bins;
}


async function getOutBins() {
    const module = await import('../api/bin-resource.js');
    const repo = new module.BinRepository();
    const outBins = await repo.getOutBins();
    return outBins;
}

async function getWeights(binId) {
    const id = parseInt(binId);
    const module = await import('./bin.js');
    const { success, data, message } = await module.getPreviousWeights(id);
    if (success) {
        return data;
    } else {
        throw new Error(message);
    }
}

async function getFullBin(binId) {
    const id = parseInt(binId);
    const bin = await findBin(id);
    bin.previousWeights = await getWeights(id);
    return bin;
}

/**
 * 
 * @param {import('../api/bin-resource').Bin} bin 
 */
function displayBin(bin) {
    const binInfo = document.getElementById('js-bin-info');
    const html = `
    <p>Bin Id: ${bin.binId}</p>
    <p>Bin Type: ${bin.binType}</p>
    <p>Last Bin Weight: ${bin.lastBinWeight}</p>
    <p>Location: ${bin.location}</p>
    <p>Notes: ${bin.notes}</p>
    <p>Previous Weights</p>
    <ul>
        ${bin.previousWeights?.map(weight => `<li>${displayWeight(weight)}</li>`)}
    </ul>
    `;
    binInfo.innerHTML = html;
}

/**
 * 
 * @param {import('../api/bin-resource').BinWeight} binWeight 
 */
function displayWeight(binWeight) {
    return `
    Date Emptied: ${binWeight.dateEmptied}, Weight: ${binWeight.weight}
    `;
}


window.onload = (e) => {
    if (sessionStorage.getItem('binId')) {
        let id = parseInt(sessionStorage.getItem('binId'));
        getFullBin(id).then(displayBin).catch(err => {
            binInfo.classList.add('error');
            binInfo.textContent = 'Bin could not be found';
            sessionStorage.removeItem('binId');
            location.href = './getBinInfo.html';
        });
    }
};