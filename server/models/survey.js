/// <reference path="../../typings/tsd.d.ts" />

var mongoose = require("mongoose");

var schema = new mongoose.Schema({
    surveyName: String,
    creator: String,
    created: {
        type: Date,
        default: Date.now
    },
    closeDate: {
        type: Date
        // default: new Date().setDate(new Date() + 1000 * 60 * 60 * 24 * 7) // ms - s - m - h - d
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