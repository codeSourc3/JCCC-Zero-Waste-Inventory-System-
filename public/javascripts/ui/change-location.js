import * as bin from './bin.js';
import {bindToForm, formToObj} from './form.js';


bindToForm('new-location-form', async (e) => {
    e.preventDefault();
    const obj = formToObj(e.target);
    let returned = 'isReturned' in obj;
    obj.isReturned = returned;
    //console.log({obj});
    
    const result = await bin.updateBin(obj.binId, obj);
    console.log({result});
});