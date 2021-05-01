const jwt = require('jsonwebtoken');
const {secret, life} = require('../../config/login-secrets.json').accessToken;
const crypto = require('crypto');
const InternRepository = require('../../persistence/intern-repository.js');
const millis = require('../timeToMillis.js');
/**
 * Adds jwt to the request object and continues through the chain.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.validJWTNeeded = (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            req.jwt = jwt.verify(req.cookies.jwt, secret);
            console.group('JWT Token');
            console.dir(req.jwt);
            console.groupEnd();
            next();
        } catch (err) {
            res.status(403).send({});
        }
    } else if (req.cookies.ref) {
        console.info('No jwt token, only refresh token');
        next();
    }
};
/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const createNewAccessToken = async (req, res) => {
    // Creates a new access token using the user id, 
    const internRepo = await InternRepository.load();
    let userId = parseInt(req.cookies.user_id);
    const user = await internRepo.getById(userId);
    if (user) {
        // user exists. append fields to body.
         req.body = {
            internId: user.internId,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            role: user.role,
            refreshKey: req.cookies.refK
        };
        let accessToken = jwt.sign(req.body, secret, {
            expiresIn: life
        });
        console.group('Creating new access token');
        console.dir(accessToken);
        console.groupEnd();
        res.clearCookie('jwt');
        res.cookie('jwt', accessToken, {httpOnly: true, secure: true, maxAge: millis.stringToMillis(life)});
        req.jwt = req.body;
    }
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.validRefreshNeeded = async (req, res, next) => {
    if (!req.cookies.jwt && req.cookies.ref) {
        // Playing with hashbrowns.
        let b = Buffer.from(req.cookies.ref, 'base64');
        let refresh_token = b.toString();
        let hash = crypto.createHmac('sha512', req.cookies.refK).update(req.cookies.user_id + secret).digest('base64');
        if (hash === refresh_token) {
            // create new access token.
            await createNewAccessToken(req, res);
            console.groupCollapsed('Valid Refresh Needed Middleware');
            console.dir(req.body);
            console.info('Showing new JWT Cookie');
            console.groupEnd();
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