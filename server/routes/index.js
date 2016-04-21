/// <reference path="../../typings/tsd.d.ts" />

var express = require('express');
var Survey = require('../models/survey');

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
    Survey.find({ creator: req.user.username }, function(err, surveys) {
        if(err) {
            console.log(err);
            res.end(err);
        }
        // Surveys only last for the month, then they're closed
        var oneMonth = 1000 * 60 * 60 * 24 * 30; //ms - s - m - h - d
        var activeSurvey = 0, closedSurvey = 0;
        if(surveys) {
            for(var i = 0; i < surveys.length; i++) {
                if((new Date() - new Date(surveys[i].created)) < oneMonth) activeSurvey++;
                else closedSurvey++;
            }
        }
        res.render('dashboard', { 
            title: 'Dashboard - Do My Survey',
            user: req.user,
            surveys: surveys,
            activeSurveyCount: activeSurvey,
            closedSurveyCount: closedSurvey,
            totalSurveyCount: surveys.length
        });
    });
});



module.exports = router;
