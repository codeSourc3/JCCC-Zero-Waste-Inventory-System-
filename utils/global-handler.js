const { TokenExpiredError } = require("jsonwebtoken");

const errorHandler = (err, req, res, next) => {
    if (typeof(err) === 'string') {
        // custom application error
        return res.status(400).json({message: err});
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({message: 'Invalid Token'});
    }

    if (err instanceof TokenExpiredError) {
        res.redirect('/login');
    }

    // default to 500 server error.
    return res.status(500).json({success: false, message: err.message});
};

module.exports = errorHandler;