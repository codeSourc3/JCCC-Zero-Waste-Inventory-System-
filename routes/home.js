const express = require('express');
const router = express.Router();
const path = require('path');
const role = require('../models/role');
const auth = require('../utils/middlewares/auth-validation-middleware.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});



router.get('/dashboard', auth.validJWTNeeded, auth.validRefreshNeeded, (req, res) => {
  console.groupCollapsed('Dashboard parameters check');
  console.info('Getting dashboard has req.jwt', ('jwt' in req));
  console.info('Getting dashboard has req.body', ('body' in req));
  console.info('Getting JWT', req.jwt);
  console.groupEnd();
  // If user has access token use it. Otherwise refresh it and then use it.
  try {
    if((req.jwt.role === role.Admin) ||(req.body.role === role.Admin)) {
      // Send admin-dashboard.html
      res.sendFile('admin-dashboard.html', {root: './private/'});
    } else {
      // Send intern-dashboard.html
      res.sendFile('intern-dashboard.html', {root: './private/'});
    }
  } catch (err) {
    console.error('Error with getting dashboard', err);
    res.status(500).json({message: 'Error: ' + err.stack});
  }
});

router.get('/login', (req, res) => {
  res.sendFile('login.html', {root: './public/'});
});



module.exports = router;
