const jwt = require('express-jwt');
const config = require('../config/login-secrets.json');
const InternRepository = require('../persistence/intern-repository');

module.exports = authorize;

function authorize(roles=[]) {
    if (typeof(roles) === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({
            secret: config.accessToken.secret, 
            algorithms: ['HS256'],
            getToken(req) {
                if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                    return req.headers.authorization.split(' ')[1];
                } else if (req.cookies && req.cookies.jwt) {
                    return req.cookies.jwt;
                } else {
                    return null;
                }
            }
        }),
        // authorize based on user role
        /**
         * 
         * @param {import('express').Request} req 
         * @param {import('express').Response} res 
         * @param {import('express').NextFunction} next 
         * @returns 
         */
        async (req, res, next) => {
            const repo = await InternRepository.load();
            console.info('From authorize middleware', req.user);
            const account = await repo.getById(Number(req.user.sub));
            if (!account || (roles.length && !roles.includes(req.user.role))) {
                // user's role is not authorized.
                return res.status(401).json({message: 'Unauthorized'})
            }

            // authentication and authorization successful
            req.user.role = account.role;
            next();
        }
    ]
}

