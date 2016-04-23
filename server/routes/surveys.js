/// <reference path="../../typings/tsd.d.ts" />

var express = require('express');
var Survey = require('../models/survey');
var User = require('../models/user');

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
    Survey.find({ surveyName: req.body.surveyName }, function(error, surveys) {
        // exit if a survey with the same name
        if(surveys.length > 0) { 
            res.redirect('back');
            res.end();
            return;
        }
        
        // create survey object
        var survey = {
            surveyName: req.body.surveyName,
            creator: req.user.username,
            closeDate: req.body.closeDate,
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

router.get('/reports', function(req, res, next) {
    if(!req.user) {
        res.redirect("/survey");
        res.end();
    }
    Survey.find({ creator : req.user.username }, function(err, surveys) {
        if(err) {
            console.log(err);
            res.redirect('/dashboard');
            return;
        }
        
        var activeSurvey = 0, closedSurvey = 0;
        if(surveys && surveys.length > 0) {
            for(var i = 0; i < surveys.length; i++) {
                if((new Date() - surveys[i].closeDate) <= 0) activeSurvey++;
                else closedSurvey++;
            }
            activeSurvey = (activeSurvey / surveys.length) * 100;
            closedSurvey = (closedSurvey / surveys.length) * 100;
        }
                
        res.render('survey/reports', {
            title: 'Reports - Do My Survey', 
            user: req.user,
            surveys: surveys,
            activePercent: activeSurvey,
            closedPercent: closedSurvey
        });
    });
});

router.get('/reports/:id', function(req, res, next) {
    if(!req.user) {
        res.redirect("/survey");
        res.end();
    }
    Survey.find({ creator : req.user.username, surveyName : req.params.id }, function(err, surveys) {
        if(err || !surveys || surveys.length != 1) {
            // console.log(err);
            res.redirect('/survey/reports');
            res.end();
            return;
        }
                
        res.render('survey/report-survey', {
            title: 'Report - Do My Survey', 
            user: req.user,
            survey: surveys[0]
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
            return;
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
        
        var survey = surveys[0];
        for(var i = 0; i < req.body.response.length && i < survey.questions.length; i++) {
            var response = req.body.response[i];
            
            if(response.trim() == "") continue;
            
            survey.questions[i].responses.push({
                username: (req.user ? req.user.username : null),
                reply: response
            });
           
            // var responseIndex = "questions[" + i + "].responses"; 
            // Survey.update({ _id : survey._id }, {
            //     "$push" : { responseIndex : {
            //         username: (req.user ? req.user.username : null),
            //         reply: response
            //     } }
            // }, function(error, survey) {
            //     if(error) {
            //         console.log(error);
            //     }
            //     console.log(survey);
            // });
        }
        
        Survey.update({ _id : survey._id }, {
            questions: survey.questions
        }, function(error, numberOfRows) {
            if(error) {
                console.log(error);
            }
            console.log(numberOfRows);
            console.log(survey);
        });
        
        if(req.user) {
            User.findByIdAndUpdate(req.user._id, {
                "$push" : { recentSurveys : survey.surveyName }
            });
        }
        
        res.redirect("/survey");
    });
});

// delete the survey
router.get('/:name/delete', function(req, res) {
    if(!req.user) {
        res.redirect("/survey");
        res.end();
        return;
    }
    Survey.find({ surveyName: req.params.name }, function(error, surveys) {
        if(error) {
            console.log(error);
            res.end(error);
        }
        if(surveys.length != 1 || surveys[0].creator != req.user.username) {
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

// force close the survey
router.get('/:name/close', function(req, res) {
    if(!req.user) {
        res.redirect("/survey");
        res.end();
        return;
    }
    Survey.find({ surveyName: req.params.name }, function(error, surveys) {
        if(error) {
            console.log(error);
            res.end(error);
        }
        if(surveys.length != 1 || surveys[0].creator != req.user.username) {
            res.redirect('/survey/reports');
            res.end();
            return;
        }
        Survey.findByIdAndUpdate(surveys[0]._id, { 
            closeDate : new Date(Date.now - 1500) 
        }, function (err, survey) {
            if(err) {
                console.log(err);
            }
            res.redirect('/survey/reports');
        });
    });
});

module.exports = router;
