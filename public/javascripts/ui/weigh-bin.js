import * as bin from './bin.js';
import {formToObj, bindToForm} from './form.js';

const messageEl = document.getElementById('message');

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
});

function showSuccess(data) {
    messageEl.hidden = false;
    messageEl.textContent = `Bin ${data.id} weighed`;
}

function showError(message) {
    messageEl.hidden = false;
    messageEl.textContent = message;
}