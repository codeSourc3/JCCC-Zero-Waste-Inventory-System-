const {Task, BinTask} = require('./tasks');

/**
 * @typedef {Object} InternLiteral
 * @property {Number} internId - the intern id.
 * @property {String} firstName - the first name.
 * @property {String} lastName - the last name.
 */

/**
 * Represents an intern. Can add tasks, remove tasks, edit tasks, change their name, etc.
 */
class Intern {

    /**
     * Constructs an Intern.
     * 
     * @param {Number} id 
     * @param {String} firstName 
     * @param {String} lastName 
     */
    constructor(id, firstName, lastName) {
        this._internId = id;
        this._firstName = firstName;
        this._lastName = lastName;
        this._tasks = [];
    }

    get internId() {
        return this._internId;
    }

    set internId(value) {
        this._internId = Number(value);
    }

    get firstName() {
        return this._firstName;
    }

    get lastName() {
        return this._lastName;
    }

    static fromObject(obj) {
        const {internId, firstName, lastName} = obj;
        return new Intern(internId, firstName, lastName);
    }

    /**
     * 
     * @param {Object} object 
     * @returns {boolean} True if the object is 
     * an instance of Intern or has the properties
     * of Intern.
     */
    equals(object) {
        let isEqual = false;
        if (object instanceof Intern) {
            isEqual = true;
        } else if ('internId' in object && 'firstName' in object && 'lastName' in object) {
            if (object.internId === this._internId) isEqual = true;
            if (object.firstName === this._firstName) isEqual = true;
            if (object.lastName === this._lastName) isEqual = true;
        }
        return isEqual;
    }

    /**
     * Changes the name of the Intern.
     * 
     * @param {String} newFirstName 
     * @param {String} newLastName 
     */
    changeName(newFirstName, newLastName) {
        if (newFirstName && newLastName) {
            this._firstName = newFirstName;
            this._lastName = newLastName;
        } else if (newFirstName) {
            this._firstName = newFirstName;
        } else if (newLastName) {
            this._lastName = newLastName;
        }
    }

    /**
     * 
     * @param {InternLiteral} obj 
     * @returns an Intern object.
     */
    static fronObject(obj) {
        const {internId, firstName, lastName} = obj;
        return new Intern(Number(internId), firstName, lastName);
    }

    toJSON() {
        const self = this;
        return {
            internId: self._internId,
            firstName: self._firstName,
            lastName: self._lastName
        };
    }

    /**
     * 
     * @param {Task | BinTask} task 
     */
    addTask(task) {
        task.intern = this._internId;
        this._tasks.push(task);
    }

    removeTask(index) {
        this._tasks.splice(index, 1);
    }

    editTask(index, task) {
        this._tasks[index] = task;
    }

    getTask(index) {
        return this._tasks[index];
    }
}

module.exports = Intern;