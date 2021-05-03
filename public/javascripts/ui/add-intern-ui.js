import { RestClient } from '../api/rest-client.js';
// Custom Javascript. Don't care if you don't like it. I'm tired.
const keys = [
    'first-name', 'last-name', 'user-name', 'password', 'confirm-password'
];
const elements = document.forms[0].elements;
function handleSubmit(e) {
    e.preventDefault();
    // compare
    let pass = elements.namedItem(keys[3]).value;
    let confPass = elements.namedItem(keys[4]).value;
    let normPass = pass.normalize();
    let normConfPass = confPass.normalize();
    let password;
    if (normPass === normConfPass) {
        console.log('It works');
        const obj = {
            internId: 1,
            firstName: String(elements.item(0).value),
            lastName: String(elements.item(1).value),
            username: String(elements.item(2).value),
            password: String(elements.item(3).value), 
            role: 'Intern'
        };
        const client = RestClient.getInstance();
        client.post('interns', obj).catch(err => console.error(err));
    }
    return false;
}

document.forms[0].addEventListener('submit', handleSubmit);