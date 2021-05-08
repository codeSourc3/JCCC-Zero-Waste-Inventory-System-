import * as fetch from '../api/fetch.js';
import {formToObj, bindToForm} from './form.js';
// Custom Javascript. Don't care if you don't like it. I'm tired.
const messageEl = document.getElementById('message');

bindToForm('js-new-user-form', async e => {
    e.preventDefault();
    let form = e.target;
    console.assert(form instanceof HTMLFormElement);
    const obj = formToObj(form);
    let normalizedPassword = String(obj['password']).normalize();
    let normalizedConfirmationPassword = String(obj['confirmPassword']).normalize();
    if (normalizedPassword === normalizedConfirmationPassword) {
        // submit object
        try {
            obj.password = normalizedPassword;
            const result = await fetch.create('/interns', obj);
            let {success, data, message} = result;
            if (success) {
                showSuccess(data);
            } else {
                showError(message);
            }
        } catch (err) {
            console.error(err);
        }
    } else {
        showPasswordError();
    }
});

/**
 * 
 * @param {{id}} data 
 */
function showSuccess(data) {
    if (messageEl.classList.contains('error')) {
        messageEl.classList.remove('error');
    }
    messageEl.hidden = false;
    messageEl.textContent = `Intern of ${data.id} was created`;
}

function showError(message) {
    messageEl.classList.add('error');
    messageEl.hidden = false;
    messageEl.textContent = message;
}
function showPasswordError() {
    messageEl.classList.add('error');
    messageEl.hidden = false;
    messageEl.textContent = 'Passwords do not match.';
}

