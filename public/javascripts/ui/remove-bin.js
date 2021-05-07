import * as bin from './bin.js';
import {bindToForm, formToObj} from './form.js';

bindToForm('remove-bin-form', async (e) => {
    e.preventDefault();
    const obj = formToObj(e.target);
    let binIsLost = obj.binStatus === 'Lost';
    const result = await bin.removeBin(obj.binId, binIsLost);
    console.log({result});
});