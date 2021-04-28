const express = require('express');
const router = express.Router();
const path = require('path');
const role = require('../models/role');
const authorize = require('../utils/authorize');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

router.get('/dashboard', authorize(), (req, res) => {
  if (!req.user) {
    //
  } else if (req.user.role === role.Admin) {
    // Send admin-dashboard.html
    res.sendFile('admin-dashboard.html', {root: './private/'});
  } else {
    // Send intern-dashboard.html
    res.sendFile('intern-dashboard.html', {root: './private/'});
  }
});

router.get('/login', (req, res) => {
  res.sendFile('login.html', {root: './public/'});
});



module.exports = router;
