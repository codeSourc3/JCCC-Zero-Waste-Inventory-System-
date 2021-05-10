import * as bin from './bin.js';
import {formToObj, bindToForm} from './form.js';

const homeButton = document.getElementById('js-return-home');
const messageEl = document.getElementById('message');
window.addEventListener('DOMContentLoaded', e => {
    let binId = parseInt(window.sessionStorage.getItem('binId'));
    const binIdElement = document.getElementById('bin-id');
    binIdElement.textContent = `${binId}`;
});
bindToForm('js-weigh-bin', async e => {
    e.preventDefault();
    const obj = formToObj(e.target);
    let binId = parseInt(sessionStorage.getItem('binId'));
    const {success, data, message} = await bin.updateBin(binId, obj);
    if (success) {
        showSuccess(data);
    } else {
        showError(message);
    }
    e.target.reset();
});

function showSuccess(data) {
    messageEl.hidden = false;
    messageEl.textContent = `Bin ${data.id} weighed`;
}

function showError(message) {
    messageEl.hidden = false;
    messageEl.textContent = message;
}

homeButton.addEventListener('click', e => {
    sessionStorage.removeItem('binId');
    location.href = '/dashboard';
}, {passive: true});