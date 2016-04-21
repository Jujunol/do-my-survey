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
