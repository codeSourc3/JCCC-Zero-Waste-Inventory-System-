const jwt = require('jsonwebtoken');
const {secret} = require('../../config/login-secrets.json').accessToken;
const crypto = require('crypto');

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.validJWTNeeded = (req, res, next) => {
    if (req.headers.authorization) {
        try {
            let authorization = req.headers.authorization.split(' ');
            if (authorization[0] !== 'Bearer') {
                res.status(401).send({message: 'Unauthorized'});
            } else {
                req.jwt = jwt.verify(authorization[1], secret);
            }
        } catch (err) {
            res.status(403).send({});
        }
    } else {
        res.status(401).send();
    }
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.validRefreshNeeded = (req, res, next) => {
    let b = Buffer.from(req.body.refresh_token, 'base64');
    let refresh_token = b.toString();
    let hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.internId + secret).digest('base64');
    if (hash === refresh_token) {
        req.body = req.jwt;
    } else {
        res.status(400).send({error: 'Invalid refresh token'});
    }
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.verifyRefreshBodyField = (req, res, next) => {
    if (req.body && req.body.refresh_token) {
        next();
    } else {
        res.status(400).send({error: 'Need to pass refresh_token field.'});
    }
};