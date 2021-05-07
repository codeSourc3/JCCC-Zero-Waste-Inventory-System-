import * as bin from './bin.js';
import {bindToForm, formToObj} from './form.js';

bindToForm('add-bin-form', async e => {
    e.preventDefault();
    const obj = formToObj(e.target);
    obj.lastBinWeight = 0.0;
    obj.isReturned = false;
    obj.location = '';
    obj.notes = '';
    const result = await bin.addBin(obj);
    console.info({result});
    let {success, data, message} = obj;
    console.info('Success: %s, Data: %O, Message: %s', success, data, message);
});