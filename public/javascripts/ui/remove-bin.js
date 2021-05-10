import * as bin from './bin.js';
import {bindToForm, formToObj} from './form.js';

const messageEl = document.getElementById('message');
messageEl.hidden = true;
/**@type {HTMLInputElement} */
const binIdInput = document.getElementById('binId');
if (sessionStorage.getItem('binId')) {
    binIdInput.defaultValue = sessionStorage.getItem('binId');
}
const toBinInfo = document.getElementById('to-bin-info');


bindToForm('remove-bin-form', async (e) => {
    e.preventDefault();
    const obj = formToObj(e.target);

    obj.binId = parseInt(obj.binId)
    let binIsLost = obj.binStatus === 'Lost';
    const {success, message} = await bin.removeBin(obj.binId, binIsLost);
    if (success) {
        showSuccess(message);
    } else {
        showError(message);
    }
    e.target.reset();
});

function showSuccess(message) {
    if (messageEl.classList.contains('error')) {
        messageEl.classList.add('error');
    }
    messageEl.hidden = false;
    messageEl.textContent = message;
    // can't have the user going back to a bin that doesn't exist.
    toBinInfo.hidden = true;
}

function showError(message) {
    messageEl.classList.add('error');
    messageEl.hidden = false;
    messageEl.textContent = message;
}