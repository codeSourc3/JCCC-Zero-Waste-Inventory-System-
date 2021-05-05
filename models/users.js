const Role = require('./role');

/**
 * Represents a User of the system. Has a username and 
 * password
 */
class User {

    /**
     * 
     * @param {string} username 
     * @param {string} password 
     */
    constructor(internId, firstName, lastName, username, password, role=Role.Intern) {
        this._internId = Number(internId);
        this._firstName = String(firstName);
        this._lastName = String(lastName);
        this._username = String(username).normalize();
        this._password = String(password); // don't normalize a hashed password.
        this._role = role;
    }

    static fromObject(obj) {
        let {internId, firstName, lastName, username, password, role} = obj;
        return new User(internId, firstName, lastName, username, password, role);
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

    get username() {
        return this._username;
    }

    get password() {
        return this._password;
    }

    get role() {
        return this._role;
    }

    toJSON() {
        return { internId: this._internId, firstName: this._firstName, lastName: this._lastName, username: this._username, password: this._password, role: this._role};
    }
}
module.exports = User;