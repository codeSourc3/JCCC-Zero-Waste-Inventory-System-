import {RestClient} from './rest-client.js';

class RestError extends Error {
    /**
     * 
     * @param {string} message 
     * @param {Error} error 
     */
    constructor(message) {
        super(message);
    }
}

class ResourceRepository {

    /**
     * 
     * @param {string} resource 
     */
    constructor(resource) {
        this._client = new RestClient();
        this._resource = resource;
    }

    /**
     * 
     * @param {Object} resource 
     * @returns {Promise<number>} a number as a response.
     */
    async add(resource) {
        let result;
        try {
            result = await this._client.post(this._resource, resource);
        } catch (err) {
            throw new RestError('Error with ResourceRepository#add(resource): ' + err);
        }
        if (response.error) {
            throw new RestError('Server responded with: ' + response.error);
        }
        return result.id;
    }

    /**
     * 
     * @param {number} id 
     * @param {Object} newResource 
     * @returns {Promise<number>}
     */
    async update(id, newResource) {
        let response;
        try {
            response = await this._client.put(this._resource, id, newResource);
        } catch (err) {
            throw new RestError('Error with ResourceRepository#update(id, resource): ' + err);
        }
        if (response.error) {
            throw new RestError('Server responded with: ' + response.error);
        }
        return response.id;
    }

    /**
     * 
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    async remove(id) {
        let response;
        try {
            response = await this._client.delete(this._resource, id);
        } catch (err) {
            throw new RestError('Error with ResourceRepository#delete: ' + err);
        }
        if (response.error) {
            throw new RestError('Server responded with: ' + response.error);
        }
        return response.succeeded;
    }

    /**
     * 
     * @param {number} id 
     * @returns {Promise<object>}
     */
    async get(id) {
        let response;
        try {
            response = await this._client.getOne(this._resource, Number(id));
        } catch (err) {
            throw new RestError('Error with ResourceRepository#get: ' + err);
        }
        if (response.error) {
            throw new RestError('Server responded with: ' + response.error);
        }
        return response;
    }

    /**
     * 
     * @param {number} offset 
     * @param {number} limit 
     * @returns {Promise<object[]>}
     */
    async getAll(offset=0, limit=10) {
        let response;
        try {
            response = await this._client.getAll(this._resource, offset, limit);
        } catch (err) {
            throw new RestError('Error with ResourceRepository#getAll: ' + err);
        }
        if (response.error) {
            throw new RestError('Server responded with: ' + response.error);
        }
        return response;
    }
}

export {RestError, ResourceRepository};