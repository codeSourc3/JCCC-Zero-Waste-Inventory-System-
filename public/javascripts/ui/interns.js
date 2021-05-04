import * as rest from '../api/fetch.js';
import {User} from '../api/intern-resource.js';




/**
 * 
 * @returns Promise<User[]> a list of users.
 */
export const getInterns = async (offset=0, limit=10) => {
    
    const results = await rest.get('/interns', {offset, limit});
    const interns = results.map(intern => User.fromObject(intern));
    return interns;
};


export const changePassword = async (internid, newPassword) => {
    const result = await rest.get('/interns' + Number(internId), {password: String(newPassword).normalize()});
    console.log({result});
};

export const addIntern = async (intern) => {
    const response = await rest.create('/interns', intern);
    return response;
};


