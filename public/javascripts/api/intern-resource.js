import {ResourceRepository} from './resource-repo.js';
import {Resources} from './rest-client.js';
import {checkPropertiesMatch} from '../types.js';
const Role = {
    Admin: 'Admin',
    Intern: 'Intern'
};

class User {
    constructor(internId, firstName, lastName, username, role=Role.Intern) {
        this.internId = Number(internId);
        this.firstName = String(firstName);
        this.lastName = String(lastName);
        this.username = String(username);
        this.role = String(role);
    }

    /**
     * 
     * @param {Object} obj 
     * @returns {User}
     */
    static fromObject(obj) {
        const {internId, firstName, lastName, username, role} = obj;
        return new User(internId, firstName, lastName, username, role);
    }
    
    toString() {
        return `Intern Id: ${this.internId}, Name: ${this.firstName} ${this.lastName}, Username: ${this.username}, Role: ${this.role}`;
    }
}



class UserRepository extends ResourceRepository {
    constructor() {
        super(Resources.INTERNS);
    }

    /**
     * 
     * @param {Intern} intern 
     * @returns {Promise<number>} a promise containing the new id.
     */
    async add(intern) {
        
        const newIntern = convertToIntern(intern);
        let id = await super.add(newIntern);
        return id;
    }

    async remove(internId) {
        const id = Number(internId);
        let succeeded = await super.remove(id);
        
        return succeeded;
    }

    async update(internId, intern) {
        const updatedId = Number(internId);
        const id = await super.update(updatedId, intern);
        return id;
    }

    async get(internId) {
        const id = Number(internId);
        const result = await super.get(id);
        const intern = User.fromObject(result);
        return intern;
    }

    async getAll(offset=0, limit=10) {
        const results = await super.getAll(offset, limit);
        const interns = results.map(result => User.fromObject(result));
        return interns;
    }

}

export {User, UserRepository};