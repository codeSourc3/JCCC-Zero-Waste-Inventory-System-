import { RestClient } from '../api/rest-client.js';
import * as fetch from '../api/fetch.js';
import defaultHandle from './form.js';
// Custom Javascript. Don't care if you don't like it. I'm tired.
const form = document.forms[0];
const elements = form.elements;
/**
 * 
 * @param {Event} e 
 * @returns 
 */
async function handleSubmit(e) {
    e.preventDefault();
    console.info('Event type', e.type);
    const data = new FormData(e.target);
    const obj = {};
    data.forEach((value, key) => {
        obj[key] = value;
    });
    form.reset();
    console.info({obj});
    let normalizedPassword = String(obj['password']).normalize();
    
    let normalizedConfirmationPassword = String(obj['confirmPassword']).normalize();
    if (normalizedPassword === normalizedConfirmationPassword) {
        console.log('Passwords are equal');
        // submit object
        try {
            await fetch.create('/interns', obj);
        } catch (err) {
            console.error(err);
        }
    } else {
        showPasswordError();
    }
    
    
}

function showPasswordError() {
    console.error('Passwords do not match');
}

document.forms[0].addEventListener('submit', handleSubmit);