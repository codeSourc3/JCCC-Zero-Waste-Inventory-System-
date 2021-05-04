import * as bin from './bin.js';
import {bindToForm, formToObj} from './form.js';

bindToForm('remove-bin-form', async (e) => {
    e.preventDefault();
    const obj = formToObj(e.target);
    console.log({obj});
});