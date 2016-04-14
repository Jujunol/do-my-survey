/// <reference path="../../typings/tsd.d.ts" />

var express = require('express');
var Survey = require('../models/survey');

var router = express.Router();

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

router.get('/create', function(req, res) {
    if(!req.user) res.redirect("/");
    res.render('survey/create', {
        title: 'Create a New Survey - Do My Survey',
        user: req.user
    });
});

router.post('/create', function(req, res, next) {
    if(!req.user) res.redirect("/");
    
    Survey.find({ surveyName: req.body.surveyName }, function(error, survey) {
        if(survey) { 
            res.redirect('back');
            res.end();
            return;
        }
        
        var survey = {
            surveyName: req.body.surveyName,
            creator: req.user.username,
            questions: []
        };
        
        for(var i = 0; i < req.body.question.length; i++) {
            var question = req.body.question[i];
            
            if(question.trim() == "") continue;
            
            survey['questions'].push({
                name: question,
                responses: []
            });
        }
        
        Survey.create(survey, function(error, survey) {
            if(error) {
                console.log(error);
                res.end(error);
            }
            res.redirect("/survey/" + survey.surveyName);
        });
    });
});

router.get('/delete/:id', function(req, res) {
    Survey.findById(req.params.id, function(error, survey) {
        if(error) {
            console.log(error);
            res.end(error);
        }
        Survey.findByIdAndRemove(req.params.id, function(error, survey) {
            if(error) {
                console.log(error);
                res.end(error);
            }
            res.redirect("/survey")
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

module.exports = router;
