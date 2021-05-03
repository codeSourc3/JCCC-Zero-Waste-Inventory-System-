const express = require('express');
const router = express.Router();
const auth = require('../../utils/middlewares/auth-validation-middleware.js');
const internRoute = require('./interns');
router.use('/interns', auth.validJWTNeeded, auth.validRefreshNeeded, internRoute);

const taskRoute = require('./tasks');
router.use('/tasks', taskRoute);

const binRoute = require('./bins');
router.use('/bins', binRoute);

const authRoute = require('./auth');
router.use('/auth', authRoute);


module.exports = router;