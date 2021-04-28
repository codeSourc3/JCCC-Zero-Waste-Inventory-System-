const express = require('express');
const router = express.Router();

const internRoute = require('./interns');
router.use('/interns', internRoute);

const taskRoute = require('./tasks');
router.use('/tasks', taskRoute);

const binRoute = require('./bins');
router.use('/bins', binRoute);

const authRoute = require('./auth');
router.use('/auth', authRoute);


module.exports = router;