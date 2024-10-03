const createError = require('http-errors');
const express = require('express');
const path = require('path');
//const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('env', 'DEV'); // KDT has to be set here 

const e = app.get('env');
if( e == 'DEV' ) {
    console.log('dev mode');
    process.env.SERVER_PATH = 'localhost';
} else {
    console.log('PROD');
    process.env.SERVER_PATH = 'xx.xxx.2xxx.xxx';
}
console.log(process.env.SERVER_PATH); 

process.env.SECRET = '5dcb1e4cf280993773b92dd5379b73352aa9457a8fc54f9b2546ddca36bc2670';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// mongoDB service
const dbs = require('../cmn/dbs');
dbs.initDB();

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;