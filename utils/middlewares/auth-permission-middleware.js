const Role = require('../../models/role.js');
const jwt = require('jsonwebtoken');
const {secret} = require('../../config/login-secrets.json').accessToken;

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.sameUserCantDoThisAction = (req, res, next) => {
    let userId = req.jwt.internId;
    if (req.params.internId !== userId) {
       next();
    } else {
        res.status(400).send();
    }
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.onlySameUserOrAdmin = (req, res, next) => {
    let userRole = String(req.jwt.role);
    let internId = req.jwt.internId;
    if (req.params && req.params.internId && internId === req.params.internId) {
        next();
    } else {
        if (userRole === Role.Admin) {
            next();
        } else {
            res.status(403).send({error: ''});
        }
    }
};

/**
 * 
 * @param {string[]} roles - user roles that are authorized to use this route.
 */
module.exports.authorizedFor = (roles = []) => {
    if (typeof(roles) === 'string') {
        roles = [roles];
    }
    return (req, res, next) => {
        let user = req.jwt;
        if (!user || (roles.length && !roles.includes(user.role))) {
            res.status(401).json({error: 'Unauthorizd'});
        }
        next();
    };
};