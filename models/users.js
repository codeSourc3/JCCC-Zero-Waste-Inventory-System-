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
    constructor(username, password, role=Role.Intern) {
        this._username = username.normalize();
        this._password = password.normalize();
        this._role = role;
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
        return { username: this._username, password: this._password};
    }
}
module.exports = User;