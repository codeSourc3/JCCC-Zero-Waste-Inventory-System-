import * as bin from './bin.js';
import {bindToForm, formToObj} from './form.js';

const messageEl = document.getElementById('message');
messageEl.hidden = true;
bindToForm('remove-bin-form', async (e) => {
    e.preventDefault();
    const obj = formToObj(e.target);
    obj.binId = Number(sessionStorage.getItem('binId'));
    let binIsLost = obj.binStatus === 'Lost';
    const {success, message} = await bin.removeBin(obj.binId, binIsLost);
    if (success) {
        showSuccess(message);
    } else {
        showError(message);
    }
});

function showSuccess(message) {
    if (messageEl.classList.contains('error')) {
        messageEl.classList.add('error');
    }
    messageEl.hidden = false;
    messageEl.textContent = message;
}

function showError(message) {
    messageEl.classList.add('error');
    messageEl.hidden = false;
    messageEl.textContent = message;
}