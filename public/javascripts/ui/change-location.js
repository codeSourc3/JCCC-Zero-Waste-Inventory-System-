import * as bin from './bin.js';
import {bindToForm, formToObj} from './form.js';


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
    const obj = formToObj(e.target);
    let returned = 'isReturned' in obj;
    obj.isReturned = returned;
    //console.log({obj});
    let binId = parseInt(sessionStorage.getItem('binId'));
    obj.binId = binId;
    const {success, data, message} = await bin.updateBin(obj.binId, obj);
    if (success) {
        showSuccess(data);
    } else {
        showError(message);
    }
});