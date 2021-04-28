const role = require('./role');
const {Task, BinTask} = require('./tasks');
const User = require('./users');
/**
 * @typedef {Object} InternLiteral
 * @property {Number} internId - the intern id.
 * @property {String} firstName - the first name.
 * @property {String} lastName - the last name.
 */

/**
 * Represents an intern. Can add tasks, remove tasks, edit tasks, change their name, etc.
 */
class Intern extends User {

    /**
     * Constructs an Intern.
     * 
     * @param {Number} id 
     * @param {String} firstName 
     * @param {String} lastName 
     */
    constructor(id, firstName, lastName, username, password) {
        super(id, firstName, lastName, username, password, role.Intern);
        this._tasks = [];
    }

    

    static fromObject(obj) {
        const {internId, firstName, lastName, username, password} = obj;
        return new Intern(internId, firstName, lastName, username, password);
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

    

    toJSON() {
        return super.toJSON();
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

    get tasks() {
        return this._tasks;
    }
}

class Admin extends User {
    /**
     * 
     * @param {Number} internId 
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {string} username 
     * @param {string} password 
     */
    constructor(internId, firstName, lastName, username, password) {
        super(internId, firstName, lastName, username, password, role.Admin);
    }

    static fromObject(obj) {
        let {internId, firstName, lastName, username, password} = obj;
        return new Admin(internId, firstName, lastName, username, password);
    }

    
    toJSON() {
        return super.toJSON();
    }
}

module.exports = {Intern, Admin};