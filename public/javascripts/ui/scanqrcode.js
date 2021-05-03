const importURL = './javascripts/api';

async function findBin(id) {
    const module = await import('../api/bin-resource.js');
    const repo = new module.BinRepository();
    try {
        const bin = await repo.get(id);
        console.info(bin.toJSON());
        return bin.toJSON();
    } catch (err) {
        console.error(err);
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
const qrScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
qrScanner.render(onScanSuccess, onScanFailure);