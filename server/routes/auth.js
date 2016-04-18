/// <reference path="../../typings/tsd.d.ts" />

var express = require('express');
var passport = require('passport');
var User = require('../models/user');

var router = express.Router();

router.get('/login', function(req, res) {
    if(req.user) {
        res.redirect('/dashboard');
    }
    res.render('login', {
        title: 'Existing User'
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

router.get('/signup', function(req, res) {
    if(req.user) {
        res.redirect('/dashboard');
    }
    res.render('signup', {
        title: 'Create a new Account'
    });
});

router.post('/signup', function(req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if(err) {
            return res.render('signup', { user: user });
        }
        
        // use passport.authenicate if don't want them to login after register
        res.redirect('/login');
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
})

module.exports = router;