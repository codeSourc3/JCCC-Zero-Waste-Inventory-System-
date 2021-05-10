import * as intern from './interns.js';
import {bindToForm, formToObj} from './form.js';

const messageEl = document.getElementById('message');
messageEl.hidden = true;

bindToForm('change-password-form', async e => {
    e.preventDefault();
    const form = e.target;
    const obj = formToObj(e.target);
    let password = String(obj.password).normalize();
    let confirmPassword = String(obj['confirmPassword']).normalize();
    let cookieParts = document.cookie.split('=');
    let internId = parseInt(cookieParts[1]);
    if (password === confirmPassword) {
        const {success, data, message} = await intern.changePassword(internId, password);
        if (success) {
            showSuccess(data);
        } else {
            showError(message);
        }
    } else {
        showError('Passwords don\'t match. Password' + password + ' Confirm: ' + confirmPassword);
    }
    form.reset();
});

function showSuccess(data) {
    messageEl.hidden = false;
    messageEl.textContent = `User ${data.id}'s password has been changed`;
}

function showError(message) {
    messageEl.hidden = false;
    messageEl.textContent = message;
}