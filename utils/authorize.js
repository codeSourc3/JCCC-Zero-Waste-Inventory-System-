const jwt = require('express-jwt');
const { secret } = require('../login-secrets.json');

module.exports = authorize;

function authorize(roles=[]) {
    if (typeof(roles) === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({secret, algorithms: ['HS256']}),
        // authorize based on user role
        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized.
                return res.status(401).json({message: 'Unauthorized'})
            }

            // authentication and authorization successful
            next();
        }
    ]
}