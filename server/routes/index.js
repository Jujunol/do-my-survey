/// <reference path="../../typings/tsd.d.ts" />

var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    if(req.user) {
        res.redirect('/survey');
    }
    res.render('index', { 
        title: 'Do My Survey',
        user: req.user
    });
});

router.get('/dashboard', function(req, res) {
    if(!req.user) {
        res.redirect('/');
    }
    res.render('dashboard', { 
        title: 'Dashboard - Do My Survey',
        user: req.user
    });
});

module.exports = router;
