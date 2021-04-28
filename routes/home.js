const express = require('express');
const router = express.Router();
const path = require('path');
const role = require('../models/role');
const auth = require('../utils/middlewares/auth-validation-middleware.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

router.get('/dashboard', auth.validJWTNeeded, (req, res) => {
  if (!req.jwt) {
    //
  } else if (req.jwt.role === role.Admin) {
    // Send admin-dashboard.html
    console.debug('Sending Admin Dashboard');
    res.sendFile('admin-dashboard.html', {root: './private/'});
  } else {
    // Send intern-dashboard.html
    console.debug('Sending Intern Dashboard');
    res.sendFile('intern-dashboard.html', {root: './private/'});
  }
});

router.get('/login', (req, res) => {
  res.sendFile('login.html', {root: './public/'});
});



module.exports = router;
