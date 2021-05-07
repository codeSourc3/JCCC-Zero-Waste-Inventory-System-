const jwt = require('jsonwebtoken');
const {secret, life} = require('../../config/login-secrets.json').accessToken;
const crypto = require('crypto');
const InternRepository = require('../../persistence/intern-repository.js');
const millis = require('../timeToMillis.js');
const util = require('util');
const logger = util.debuglog('auth-validation');
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
            next();
        } catch (err) {
            res.status(403).send({success: false, message: 'Invalid access token.'});
        }
    } else if (req.cookies.ref) {
        logger('No jwt token, only refresh token');
        next();
    } else {
        res.redirect('/login');
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
         const body = {
            internId: user.internId,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            role: user.role,
            refreshKey: req.cookies.refK
        };
        let accessToken = jwt.sign(body, secret, {
            expiresIn: life
        });
        res.clearCookie('jwt');
        res.cookie('jwt', accessToken, {httpOnly: true, secure: true, maxAge: millis.stringToMillis(life)});
        req.jwt = body;
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
            logger('Password matches,', req.jwt);
            next();
        } else {
            res.status(400).send({success: false, message: 'Invalid refresh token'});
        }
    } else if (req.cookies.jwt) {
        next();
    } else {
        // both the access token and refresh token expired. 
        logger('Both refresh and access tokens expired');
        res.redirect('/login');
    }
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.autoLogin = (req, res, next) => {
    if (req.cookies.ref) {
        // User can still be logged in. Direct them to /dashboard.
        // /dashboard will refresh the tokens automatically.
        res.redirect('/dashboard');
    } else {
        // User not logged in.
        next();
    }
};

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
        res.status(400).send({success: false, message: 'Need to pass refresh_token field.'});
    }
};