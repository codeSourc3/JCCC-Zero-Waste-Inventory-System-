const importURL = './javascripts/api';

async function findBin(id) {
    let binId = parseInt(id);
    const module = await import('./bin.js');
    let {success, message, data} = await module.findBin(binId);
    if (success) {
        return data;
    } else {
        return message;
    }
}


const jsBin = document.getElementById('js-bin');
/**
 * @author Enzo Mayo
 */
function onScanSuccess(qrMessage) {
    // To test if it works.
    console.log(`QR matched = ${qrMessage}`);
    // Found bin id parse it.
    let parts = qrMessage.split('=');
    let binId = parseInt(parts[1]);
    console.info('Bin Id: ', binId);
    findBin(binId).then(persistInfo).then(goToBinInfo).catch(err => {
        console.error(err);
    });
}


function goToBinInfo() {
    location.href = './getBinInfoAfter.html';
}

/**
 * 
 * @param {import('../api/bin-resource').Bin} bin 
 */
function persistInfo(bin) {
    window.sessionStorage.setItem('binId', String(bin.binId));
}

function onScanFailure(error) {
    // should try to ignore and keep scanning.
    ;
}
/**
 * @type {import('html5-qrcode')}
 */
const qrScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 300 });
qrScanner.render(onScanSuccess, onScanFailure);