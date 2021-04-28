const express = require('express');

const router = express.Router();

const role = require('../../models/role');
const authValidation = require('../../utils/middlewares/auth-validation-middleware.js');

const auth = require('../../services/auth-controller.js');

router.post('/login', auth.isPasswordAndUserMatch, auth.login);

router.post('/logout', auth.logout);

router.post('/refresh', authValidation.validJWTNeeded, authValidation.verifyRefreshBodyField, authValidation.validRefreshNeeded, auth.refreshToken);

module.exports = router;