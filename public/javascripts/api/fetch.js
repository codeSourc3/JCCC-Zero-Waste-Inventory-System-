/**
 * @author codeSourc3
 * Gives us a default request function.
 */
const apiHost = '/api/v1';


function objectToQueryString(obj) {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
}

/**
 * 
 * @param {string} url 
 * @param {Headers} params 
 * @param {string} method 
 * @returns {Promise<any>}
 */
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

    // Ian - .catch or .then if error 401, then resend - from Collin
    const response = await fetch(apiHost + url, options);
    const result = await response.json();
    return result;
}

/**
 * 
 * @param {string} url 
 * @param {object} params 
 * @returns {Promise<any>}
 */
function get(url, params) {
    return request(url, params);
}

/**
 * 
 * @param {string} url 
 * @param {object} params 
 * @returns {Promise<any>}
 */
function create(url, params) {
    return request(url, params, 'POST');
}

/**
 * 
 * @param {string} url 
 * @param {object} params 
 * @returns {Promise<any>}
 */
function replace(url, params) {
    return request(url, params, 'PUT');
}

/**
 * 
 * @param {string} url 
 * @param {object} params 
 * @returns {Promise<any>}
 */
function update(url, params) {
    return request(url, params, 'PATCH');
}

/**
 * 
 * @param {string} url 
 * @param {object} params 
 * @returns {Promise<any>}
 */
function remove(url, params) {
    return request(url, params, 'DELETE');
}

export {get, create, replace, remove, update};