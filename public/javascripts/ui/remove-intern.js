import * as intern from './interns.js';
import {bindToForm, formToObj} from './form.js';

const messageEl = document.getElementById('message');

bindToForm('remove-intern-form', async (e) => {
    e.preventDefault();
    const obj = formToObj(e.target);
    if (!obj['isSure']) {
        return;
    }
    const {success, message} = await intern.removeIntern(obj.internId);
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