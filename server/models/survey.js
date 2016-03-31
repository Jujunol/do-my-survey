/// <reference path="../../typings/tsd.d.ts" />

var mongoose = require("mongoose");

var schema = new mongoose.Schema({
    surveyName: String,
    creator: String,
    created: {
        type: Date,
        default: Date.now
    },
    questions: {
        question: {
            name: String,
            responses: {
                response: {
                    username: String,
                    reply: String
                }
            }
        }
    }
});

exports.User = mongoose.model('User', schema);