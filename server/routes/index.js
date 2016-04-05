/// <reference path="../../typings/tsd.d.ts" />

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET sign up page. */
router.get('/sign_up', function (req, res, next) {
    res.render('sign_up', { title: 'Please Sign up' });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
    res.render('login', { title: 'Please Login' });
});


module.exports = router;
