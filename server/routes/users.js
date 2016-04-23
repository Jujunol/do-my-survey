/// <reference path="../../typings/tsd.d.ts" />

var express = require('express');
var User = require('../models/user');

var router = express.Router();

router.get('/profile', function(req, res) {
    if(!req.user) {
        res.redirect('/');
        res.end();
    }
    res.render('user/profile', {
        title: 'My Profile - Do My Survey',
        user: req.user
    });
});

router.post('/profile', function(req, res) {
    if(!req.user) {
        res.redirect('/');
        res.end();
    }
    User.findByIdAndUpdate(req.user._id, {
        username: req.body.username
    }, function(err, user) {
        if(err) {
            // console.log(err);
        }
        return res.redirect("/");
    });
});

router.get('/:id/delete', function(req, res) {
    if(!req.user) {
        return res.redirect('/');
    }
    User.findByIdAndRemove(req.params.id, function(err, user) {
        return res.redirect('/');
    });
});

// router.get('/:id', function(req, res) {
//     if(!req.user) {
//         res.redirect('/');
//         res.end();
//     }
//     User.findById(req.params.id, function(err, user) {
//         if(err) {
//             console.log(err);
//             res.end(err);
//         }
//         res.render('user/')
//     });
// });

module.exports = router;
