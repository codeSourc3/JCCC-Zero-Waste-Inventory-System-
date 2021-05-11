import * as bin from './bin.js';
import {bindToForm, formToObj} from './form.js';

const homeButton = document.getElementById('js-return-home');
const messageEl = document.getElementById('message');

const showSuccess = (data) => {
    messageEl.hidden = false;
    let binId = sessionStorage.getItem('binId');
    messageEl.textContent = `Location of ${binId} changed.`;
};

const showError = (message) => {
    messageEl.classList.add('error');
    messageEl.textContent = message;
};

bindToForm('new-location-form', async (e) => {
    e.preventDefault();
    const form = e.target;
    const obj = formToObj(e.target);
    console.dir(obj);
    let regex = /storage/i;
    let stringLocation = String(obj['location']);
    if (obj.notes.length === 0) {
        // fixes Issue #62
        obj.notes = ' ';
    }
    obj.isReturned = regex.test(stringLocation);
    let binId = parseInt(sessionStorage.getItem('binId'));
    obj.binId = binId;
    const {success, data, message} = await bin.updateBin(obj.binId, obj);
    if (success) {
        showSuccess(data);
    } else {
        showError(message);
    }
    form.reset();
});

homeButton.addEventListener('click', e => {
    sessionStorage.removeItem('binId');
    location.href = '/dashboard';
}, {passive: true});