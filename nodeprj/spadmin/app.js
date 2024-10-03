const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const plyrRouter = require('./routes/players');
const apiRouter = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));

//const bodyParser = require('body-parser');
//app.use(bodyParser);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS is enabled for all origins
app.use(cors());
// CORS is enabled for the selected origins
const corsOptions = {
    origin: [ 'http://localhost:4000' ]
};
process.env.CORS = corsOptions;

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/util', utilRouter);
app.use('/plyr', plyrRouter);
//api
app.use('/api', apiRouter);


/* app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); */

process.env.SECRET = '5dcb1e4cf280993773b92dd5379b73352aa9457a8fc54f9b2546ddca36bc2670';

/*
// hhtps use
app.use (function (req, res, next) {
	if (req.secure) {
			// request was via https, so do no special handling
			next();
	} else {
			// request was via http, so redirect to https
			res.redirect('https://' + req.headers.host + req.url);
	}
});
*/

const dbs = require('../cmn/dbs');	// mongoDB
dbs.initDB();

/*
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    });

// HTTPS experiment
app.use(function(req,resp,next){
    if (req.headers['x-forwarded-proto'] == 'http') {
        console.log('In HTTPS');
        return resp.redirect(301, 'https://' + req.headers.host + '/');
        
    } else {
        return next();
    }
  });
*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
