
import {Logger} from './logger.js';


const SERVICE_URL = 'https://script.google.com/macros/s/AKfycbzHcafkTY9CgmkPlXtmT_YVSMqOuOgg0Lpzd_YMr1pUsLlzoYytkdAT_0q0VjtaoSPX/exec';

const logger = new Logger();

const pluralToSingular = str => str.substring(0, str.length - 1);

function buildURL({ table, id, action }) {
    let url = SERVICE_URL;
    if (table) {
        url += `?q=${table}`;
        if (id) {
            url += `/${id}`;
        }
        if (action) {
            url += `&action=${action.toLowerCase()}`;
        }
    }
    return url;
}

export async function getData(table) {
    let url = buildURL({
        table
    });
    //console.log(`Get Request: ${url}`);
    let start = performance.now();
    const response = await fetch(url, {
        method: 'GET',

        redirect: 'follow'
    });
    const result = await response.json();
    let end = performance.now();
    const duration = end - start;
    

    //console.log(processedResult, ' Took: ' + duration);
    return result;
}
//getData('interns');

export async function getDataById(table, id) {
    let url = buildURL({
        table,
        id
    });
    const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow'
    });
    const json = await response.json();
    return json;
}

export async function postData(table, data) {
    let url = buildURL({
        table,
        action: 'post'
    });

    logger.log(JSON.stringify(data, 0, 2));
    const response = await fetch(url, {
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify(data)
    });
    //const result = await response.json();
    //console.log(result);
    //return result;
}

export async function deleteData(table, id) {
    let url = buildURL({
        table,
        id,
        action: 'delete'
    });
    const body = {
        [pluralToSingular(table) + 'Id']: id
    };
    const response = await fetch(url, {
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify(body)
    });
    const result = await response.json();
    return result;
}

export async function putData(table, id, data) {
    let url = buildURL({
        table,
        id,
        action: 'put'
    });
    const response = await fetch(url, {
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
}

export async function processJSON(jsonString) {
    const results = JSON.parse(jsonString);
    return results;
}



