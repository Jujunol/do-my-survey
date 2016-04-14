/// <reference path="../../typings/tsd.d.ts" />

var mongoose = require("mongoose");

var schema = new mongoose.Schema({
    surveyName: String,
    creator: String,
    created: {
        type: Date,
        default: Date.now
    },
    questions: [
        {
            name: String,
            responses: [
                {
                    username: String,
                    reply: String
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Survey', schema);
// exports.Survey = mongoose.model('Survey', schema);