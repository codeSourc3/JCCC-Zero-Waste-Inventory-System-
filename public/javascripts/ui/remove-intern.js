import * as intern from './interns.js';
import {bindToForm, formToObj} from './form.js';

bindToForm('remove-intern-form', async (e) => {
    e.preventDefault();
    const obj = formToObj(e.target);
    const result = await intern.removeIntern(obj.internId);
    console.log({result});
});