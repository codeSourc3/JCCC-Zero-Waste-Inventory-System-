import * as bin from './bin.js';
import {bindToForm, formToObj} from './form.js';

const messageEl = document.getElementById('message');

bindToForm('add-bin-form', async e => {
    e.preventDefault();
    const obj = formToObj(e.target);
    obj.lastBinWeight = 0.0;
    obj.isReturned = false;
    obj.location = '';
    obj.notes = '';
    const result = await bin.addBin(obj);
    console.info({result});
    let {success, data, message} = result;
    if (success) {
        showSuccess(data);
    } else {
        showError(message);
    }
    e.target.reset();
});

function showSuccess(data) {
    // add bin id to sessionStorage and go to binInfo.html
    sessionStorage.setItem('binId', String(data.id));
    location.href = '/getBinInfoAfter.html';
}

function showError(message) {
    messageEl.classList.add('error');
    messageEl.hidden = false;
    messageEl.textContent = message;
}