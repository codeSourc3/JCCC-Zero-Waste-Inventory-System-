const express = require('express');
const path = require('path');
const app = express();
const logger = require('morgan');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cookieParser());
const apiRouter = require('./routes/rest/api');

app.use('/api/v1', apiRouter);




app.use(express.static(path.join(__dirname, 'public')));


const index = require('./routes/home');

app.use('/', index);
app.get('/packages/html5-qrcode.min.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/html5-qrcode/minified/html5-qrcode.min.js');
});

app.use(require('./utils/global-handler.js'));

module.exports = app;
