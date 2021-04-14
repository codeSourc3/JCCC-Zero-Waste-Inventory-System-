module.exports = {
    Success : {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NO_CONTENT: 204
    },
    Redirect: {
        MOVED_PERMANENTLY: 301,
        FOUND: 302
    },
    ClientError: {
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        PAYMENT_REQUIRED: 402,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        METHOD_NOT_ALLOWED: 405,
        NOT_ACCEPTABLE: 406,
        CONFLICT: 409,
        PRECONDITION_REQUIRED: 428,
        PRECONDITION_FAILED: 412
    },
    ServerError: {
        INTERNAL_SERVER_ERROR: 500,
        NOT_IMPLEMENTED: 501,
        BAD_GATEWAY: 502,
        SERVICE_UNAVAILABLE: 503
    }
};