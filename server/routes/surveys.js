/// <reference path="../../typings/tsd.d.ts" />

var express = require('express');
var Survey = require('../models/survey');

var router = express.Router();

// Retrive list of surveys
router.get('/', function(req, res) {
    Survey.find(function(error, surveys) {
        if(error) {
            console.log(error);
            res.end(error);
        }
        res.render('survey/index', {
            title: 'Survey List - Do My Survey',
            user: req.user,
            surveys: surveys
        });
    });
});

// form for creating a survey
router.get('/create', function(req, res) {
    if(!req.user) res.redirect("/");
    res.render('survey/create', {
        title: 'Create a New Survey - Do My Survey',
        user: req.user
    });
});

// handle survey post to server
router.post('/create', function(req, res, next) {
    if(!req.user) res.redirect("/");
    
    // check if the survey already exists
    Survey.find({ surveyName: req.body.surveyName }, function(error, survey) {
        // exit if a survey with the same name
        if(survey) { 
            res.redirect('back');
            res.end();
            return;
        }
        
        // create survey object
        var survey = {
            surveyName: req.body.surveyName,
            creator: req.user.username,
            questions: []
        };
        
        // append any questions added that aren't blank
        for(var i = 0; i < req.body.question.length; i++) {
            var question = req.body.question[i];
            
            if(question.trim() == "") continue;
            
            survey['questions'].push({
                name: question,
                responses: []
            });
        }
        
        // save the survey object to the db
        Survey.create(survey, function(error, survey) {
            if(error) {
                console.log(error);
                res.end(error);
            }
            res.redirect("/survey/" + survey.surveyName);
        });
    });
});

router.get('/:name', function(req, res, next) {
    Survey.find({ surveyName: req.params.name }, function(error, surveys) {
        if(error) {
            console.log(error);
            res.end(error);
        }
        if(surveys.length != 1) {
            res.redirect("/survey");
            res.end();
        }
        
        res.render('survey/view', {
            title: surveys[0].surveyName + ' - Do My Survey',
            user: req.user,
            survey: surveys[0]
        });
    });
});

// render the survey
router.post('/:name', function(req, res, next) {
    Survey.find({ surveyName: req.params.name }, function(error, surveys) {
        if(error) {
            console.log(error);
            res.end(error);
        }
        if(surveys.length != 1) {
            res.redirect("/survey");
            res.end();
        }
    });
});

// delete the survey
router.get('/:name/delete', function(req, res) {
    if(!req.user) {
        res.redirect("/survey");
        res.end();
    }
    Survey.find({ surveyName: req.params.name }, function(error, surveys) {
        if(error) {
            console.log(error);
            res.end(error);
        }
        console.log(surveys);
        if(surveys.length != 1) {
            res.redirect("/survey");
            res.end();
            return;
        }
        Survey.findByIdAndRemove(surveys[0]._id, function(error, survey) {
            if(error) {
                console.log(error);
                res.end(error);
            }
            res.redirect("/survey");
        });
    });
});

module.exports = router;
