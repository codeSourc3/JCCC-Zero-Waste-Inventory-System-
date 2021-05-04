const InternRepository = require('../persistence/intern-repository');
const jwt = require('jsonwebtoken');
const config = require('../config/login-secrets.json');
const role = require('../models/role');
const httpCodes = require('../utils/http-codes');
const User = require('../models/users');
const crypto = require('crypto');
const millis = require('../utils/timeToMillis.js');




/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @returns 
 */
module.exports.isPasswordAndUserMatch = async (req, res, next) => {
    const repo = await InternRepository.load();
    const user = await repo.findByUsernameAndPassword(req.body.username);
    if (!user) {
        res.status(404).send({message: 'No user found'});
    } else {
        let passwordFields = user.password.split('$');
        let salt = passwordFields[0];
        console.group('Checking if password and user match');
        console.dir(req.body);
        console.assert(req.body.password !== undefined);
        console.groupEnd();
        let hash = crypto.createHmac('sha512', salt).update(req.body.password.normalize()).digest('base64');
        console.log('Derived hash', hash);
        console.log('Hash from password', passwordFields[1]);
        if (hash === passwordFields[1]) {
            req.body = {
                internId: user.internId,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role
            };
            next();
        } else {
            console.error('Password Or Username Invalid - ', user.toJSON());
            res.status(400).send({errors: 'Invalid e-mail or password'});
        }
    }
};



/**
 * 
 * @param {import('express').Response} res 
 * @returns {import('express').Response}
 */
const clearAccessToken = (res) => {
    res.clearCookie('jwt', {httpOnly: true, secure: true});
    return res;
};

/**
 * 
 * @param {import('express').Response} res 
 * @returns {import('express').Response}
 */
const clearRefreshToken = (res) => {
    res.clearCookie('ref', {httpOnly: true, secure: true});
    return res;
};

/**
 * 
 * @param {import('express').Response} res the response object.
 * @param {string} token the value to set for the cookie.
 * @returns {import('express').Response} the response for method chaining.
 */
const addAccessToken = (res, token) => {
    res.cookie('jwt', token, {httpOnly: true, secure: true, maxAge: millis.stringToMillis(config.accessToken.life)});
    return res;
};

/**
 * 
 * @param {import('express').Response} res 
 * @param {string} token the value to set for the cookie.
 * @returns {import('express').Response} the response for method chaining.
 */
const addRefreshToken = (res, token) => {
    res.cookie('ref', token, {httpOnly: true, secure: true, maxAge: millis.stringToMillis(config.refreshToken.life)});
    return res;
};

/**
 * 
 * @param {import('express').Response} res 
 * @param {string} key 
 */
const addRefreshKey = (res, key) => {
    res.cookie('refK', key, {httpOnly: true, secure: true, maxAge: millis.stringToMillis(config.refreshToken.life)});
};

/**
 * 
 * @param {import('express').Response} res 
 * @param {*} id 
 */
const addIdToken = (res, id) => {
    // I did this because I couldn't find another way easily.
    res.cookie('user_id', id, {secure: true, maxAge: millis.stringToMillis(config.refreshToken.life)});
};

/**
 * 
 * @param {import('express').Response} res 
 */
const clearIdToken = (res) => {
    res.clearCookie('user_id', {secure: true});
};

/**
 * 
 * @param {import('express').Response} res 
 */
const clearRefreshKey = (res) => {
    res.clearCookie('refK', {httpOnly: true, secure: true});
};

/**
 * Takes in a request body. Must be called after validateJWT.
 * Salts and hashes the password entered and generates a 
 * JWT access token and refresh token. It then sets them as
 * cookies, with expiration dates.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @example
 * POST /api/v1/auth/login Body: {username: value, password: value}
 */
module.exports.login = async (req, res, next) => {
    try {
        let refreshId = req.body.internId + config.accessToken.secret;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64');
        req.body.refreshKey = salt;
        let token = jwt.sign(req.body, config.accessToken.secret, {
            expiresIn: config.accessToken.life
        });
        let b = Buffer.from(hash);
        let refresh_token = b.toString('base64');
        addIdToken(res, req.body.internId);
        addRefreshKey(res, req.body.refreshKey);
        addAccessToken(res, token);
        addRefreshToken(res, refresh_token);
        res.redirect('/dashboard');
    } catch(err) {
        console.error('Login Error: ', err);
        res.status(500).send({message: err.message});
    } 
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @example
 * POST /api/v1/auth/logout
 */
module.exports.logout = (req, res) => {
    clearAccessToken(res);
    clearRefreshKey(res);
    clearIdToken(res);
    clearRefreshToken(res).redirect('/');
};

/**
 * Should be called by 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @example
 * POST /api/v1/auth/refresh
 */
module.exports.refreshToken = (req, res) => {
    try {
        req.body = req.cookies.jwt;
        let token = jwt.sign(req.body, config.accessToken.secret, {
        });
        res.status(201).clearCookie('jwt', {httpOnly: true, secure: true}).cookie('jwt', token, {httpOnly: true, secure: true, maxAge: millis.stringToMillis(config.accessToken.life)});
    } catch (err) {
        res.status(500).send({error: err.message});
    }
};