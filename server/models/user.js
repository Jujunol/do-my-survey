/// <reference path="../../typings/tsd.d.ts" />

var mongoose = require("mongoose");

var schema = new mongoose.Schema({
    username: String,
    hash: String,
    created: {
        type: Date,
        default: Date.now
    }, 
    recentSurveys: [],
    createdSurveys: [],
    photoUri: String
});

exports.User = mongoose.model('User', schema);