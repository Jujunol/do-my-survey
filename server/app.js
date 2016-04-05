/// <reference path="../typings/tsd.d.ts" />

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var auth = require('./routes/auth');

var users = require('./routes/users');

var app = express();

// attempt connection to db
mongoose.connect('mongodb://root:root@ds011870.mlab.com:11870/do-my-surveydb');

// test our connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error to db'));
db.once('open', function(callback) {
    console.log("Db connection successful");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: "MonSecret",
    resave: true,
    saveUnitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Setup static routing
app.use('/scripts', express.static(path.join(path.dirname(__dirname), 'public')));
app.use('/lib', express.static(path.join(path.dirname(__dirname), 'lib')));

// Setup routing
app.use('/', routes);
app.use('/', auth);

// Passport configuration
var userModel = require('./models/user');
passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
