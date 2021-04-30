const InternRepository = require('../persistence/intern-repository');
const jwt = require('jsonwebtoken');
const config = require('../config/login-secrets.json');
const role = require('../models/role');
const httpCodes = require('../utils/http-codes');
const User = require('../models/users');
const crypto = require('crypto');




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
        console.dir(req.body);
        console.assert(req.body.password !== undefined);
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
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
 * Converts minutes to milliseconds
 * @param {string | number} minutes string in the form of "15m" or number representing minutes.
 * @returns {number} number in milliseconds.
 */
const minutesToMillis = (minutes) => {
    // if param is "15m", strip m and convert to number.
    let parsedMinutes;
    if (typeof(minutes) === 'string' && minutes.endsWith('m')) {
        parsedMinutes = parseInt(minutes.replace('m', ''));
    } else {
        parsedMinutes = minutes;
    }
    return parsedMinutes * 60 * 1000;
};

/**
 * Converts days to milliseconds.
 * @param {string | number} days string in the form of "15d" or number.
 * @returns {number} number in milliseconds.
 */
const daysToMillis = (days) => {
    // param may be in the form of "15d".
    let parsedDays;
    if (typeof(days) === 'string' && days.endsWith('d')) {
        parsedDays = parseInt(days.replace('d', ''));
    } else {
        parsedDays = days;
    }
    let hours = parsedDays * 24;
    let minutes = hours * 60;
    let milliseconds = minutesToMillis(minutes);
    return milliseconds;
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
    res.cookie('jwt', token, {httpOnly: true, secure: true, maxAge: minutesToMillis(config.accessToken.life)});
    return res;
};

/**
 * 
 * @param {import('express').Response} res 
 * @param {string} token the value to set for the cookie.
 * @returns {import('express').Response} the response for method chaining.
 */
const addRefreshToken = (res, token) => {
    res.cookie('ref', token, {httpOnly: true, secure: true, maxAge: daysToMillis(config.refreshToken.life)});
    return res;
};

/**
 * 
 * @param {import('express').Response} res 
 * @param {string} key 
 */
const addRefreshKey = (res, key) => {
    res.cookie('refK', key, {httpOnly: true, secure: true, maxAge: daysToMillis(config.refreshToken.life)});
};

/**
 * 
 * @param {import('express').Response} res 
 * @param {*} id 
 */
const addIdToken = (res, id) => {
    // I did this because I couldn't find another way easily.
    res.cookie('user_id', id, {httpOnly: true, secure: true, maxAge: daysToMillis(config.refreshToken.life)});
};

/**
 * 
 * @param {import('express').Response} res 
 */
const clearIdToken = (res) => {
    res.clearCookie('user_id', {httpOnly: true, secure: true});
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
        addRefreshKey(res, salt);
        addAccessToken(res, token);
        addRefreshToken(res, refresh_token);
        res.redirect('/dashboard');
    } catch(err) {
        res.status(500).send({message: err.message});
    } 
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports.logout = (req, res) => {
    clearAccessToken(res);
    clearRefreshToken(res).redirect('/');
};

/**
 * Should be called by 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports.refreshToken = (req, res) => {
    try {
        req.body = req.jwt;
        let token = jwt.sign(req.body, config.accessToken.secret, {
        });
        res.status(201).clearCookie('jwt', {httpOnly: true, secure: true}).cookie('jwt', token, {httpOnly: true, secure: true, maxAge: minutesToMillis(config.accessToken.life)});
    } catch (err) {
        res.status(500).send({error: err.message});
    }
};