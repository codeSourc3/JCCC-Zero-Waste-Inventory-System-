/**
 * @author codeSourc3
 * Gives us a default request function.
 */
const apiHost = '/api/v1';


function objectToQueryString(obj) {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
}

async function request(url, params, method='GET') {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // if param exists and method is GET, add query string to url
    if (params) {
        if (method === 'GET') {
            url += '?' + objectToQueryString(params);
        } else {
            options.body = JSON.stringify(params);
            
        }
    }

    const response = await fetch(apiHost + url, options);
    console.dir(response);
    const result = await response.json();
    return result;
}

function get(url, params) {
    return request(url, params);
}

function create(url, params) {
    return request(url, params, 'POST');
}

function replace(url, params) {
    return request(url, params, 'PUT');
}

function update(url, params) {
    return request(url, params, 'PATCH');
}

function remove(url, params) {
    return request(url, params, 'DELETE');
}

export {get, create, replace, remove, update};