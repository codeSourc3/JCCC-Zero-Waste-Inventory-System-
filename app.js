const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const logger = require('morgan');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

const apiRouter = require('./routes/rest/api');

app.use('/api/v1', apiRouter);



//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const index = require('./routes/home');

app.use('/', index);


module.exports = app;
