import {RestClient} from '../api/rest-client.js';

const getInterns = async (binId) => {
    const client = RestClient.getInstance();
    const results = await client.getAll('interns');
    return results;
};

