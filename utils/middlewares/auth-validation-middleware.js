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
    if (req.cookies.jwt) {
        try {
            req.jwt = jwt.verify(req.cookies.jwt, secret);
            next();
        } catch (err) {
            res.status(403).send({});
        }
    } else if (req.cookies.ref) {
        next();
    }
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.validRefreshNeeded = (req, res, next) => {
    if (!req.cookies.jwt && req.cookies.ref) {
        // Playing with hashbrowns.
        let b = Buffer.from(req.cookies.ref, 'base64');
        let refresh_token = b.toString();
        let hash = crypto.createHmac('sha512', req.cookies.refK).update(req.cookies.user_id + secret).digest('base64');
        if (hash === refresh_token) {
            req.body = req.jwt;
            next();
        } else {
            res.status(400).send({error: 'Invalid refresh token'});
        }
    } else if (req.cookies.jwt) {
        next();
    } else {
        // both the access token and refresh token expired. 
        res.redirect('/login');
    }
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.redirectToRefresh = (req, res, next) => {
    if (!req.cookies.jwt) {
        // JWT token expired. Attempt to refresh
    } else {
        next();
    }
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.verifyRefreshBodyField = (req, res, next) => {
    if (req.cookies && req.cookies.ref) {
        next();
    } else {
        res.status(400).send({error: 'Need to pass refresh_token field.'});
    }
};