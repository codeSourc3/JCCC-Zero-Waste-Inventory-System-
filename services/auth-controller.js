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
 * Takes in a request body. Must be called after validateJWT
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
        res.status(201).send({accessToken: token, refreshToken: refresh_token});
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
    res.clearCookie('jwt').status(httpCodes.Success.OK).redirect('/');
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports.refreshToken = (req, res) => {
    try {
        req.body = req.jwt;
        let token = jwt.sign(req.body, config.refreshToken.secret, {
            expiresIn: config.refreshToken.life
        });
        res.status(201).send({id: token});
    } catch (err) {
        res.status(500).send({error: err.message});
    }
};