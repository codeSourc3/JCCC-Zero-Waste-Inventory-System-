/**
 * This module is responsible for querying the REST API.
 * @module
 */



const API_ENDPOINT = '/api/v1';

const Resources = {
    BINS: 'bins',
    TASKS: 'tasks',
    INTERNS: 'interns'
};

class RestClient {
    constructor() {
        this._endPoint = API_ENDPOINT;
        
    }

    static getInstance() {
        if (this._instance === undefined) {
            this._instance = new RestClient();
        }
        return this._instance;
    }

    /**
     * 
     * @param {string} resource 
     * @param {number} offset 
     * @param {number} limit 
     * @returns {Promise<Object[]>}
     */
    async getAll(resource, offset = 0, limit = 10) {
        const queryParams = new URLSearchParams();
        queryParams.append('offset', offset);
        queryParams.append('limit', limit);

        const relativeURL = `${this._endPoint}/${String(resource)}?${queryParams.toString()}`;

        const response = await fetch(relativeURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error(`Query of %s rows %d to %d returned a response of %d`, resource, offset, offset + limit, response.status);
            throw new Error('Network request was not OK');
        } 
        return response.json();

    }

    async getOne(resource, id) {
        const url = `${this._endPoint}/${String(resource)}/${Number(id)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error('GET Request of id %d of %s returned a response %d', id, resource, response.status);
            throw new Error('GET Request was not OK.');
        }
        return response.json();
    }

    async post(resource, data) {
        const relativeURL = `${this._endPoint}/${String(resource)}`;
        const response = await fetch(relativeURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return response.json();
    }

    async put(resource, id,  data) {
        const relativeURL = `${this._endPoint}/${String(resource)}/${Number(id)}`;
        const response = await fetch(relativeURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const jsonResult = await response.json();
        console.log('PUT result: ', jsonResult);
        return jsonResult;
    }

    async delete(resource, id) {
        const relativeURL = `${this._endPoint}/${String(resource)}/${Number(id)}`;
        const response = await fetch(relativeURL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.json();
    }
}



export {RestClient, Resources};