import {ResourceRepository} from './resource-repo.js';
import {Resources} from './rest-client.js';
import {checkPropertiesMatch} from '../types.js';



class Intern {
    constructor(internId, firstName, lastName) {
        this.internId = Number(internId);
        this.firstName = String(firstName);
        this.lastName = String(lastName);
    }

    static fromObject(obj) {
        if (checkPropertiesMatch(obj, ...Intern.properties())) {
            return new Intern(obj.internId, obj.firstName, obj.lastName);
        } else {
            throw new TypeError(`Failed to convert ${JSON.stringify(obj)}.`);
        }
    }

    static properties() {
        return ['internId', 'firstName', 'lastName'];
    }

    claimTask(task) {
        task.internId = this.internId;
    }
}



/**
 * 
 * @param {Object} obj 
 * @returns {Intern} an intern.
 */
const convertToIntern = (obj) => {
    if (!obj instanceof Intern) {
        return obj;
    } else {
        return Intern.fromObject(obj);
    }
};

class InternRepository extends ResourceRepository {
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
        const intern = Intern.fromObject(result);
        return intern;
    }

    async getAll(offset=0, limit=10) {
        const results = await super.getAll(offset, limit);
        const interns = results.map(result => Intern.fromObject(result));
        return interns;
    }

}

export {Intern, InternRepository};