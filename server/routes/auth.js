/// <reference path="../../typings/tsd.d.ts" />

var express = require('express');
var passport = require('passport');
var User = require('../models/user');

var router = express.Router();

router.get('/login', function(req, res) {
    res.render('login', {
        title: 'Existing User',
        user: req.user
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login'
}));

router.get('/register', function(req, res) {
    res.render('register', {
        title: 'Create a new Account',
        user: req.user
    })
});

router.post('/register', function(req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if(err) {
            return res.render('register', { user: user });
        }
        
        // use passport.authenicate if don't want them to login after register
        res.redirect('/login');
    });
});

router.post('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
})

module.exports = router;