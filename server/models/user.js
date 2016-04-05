/// <reference path="../../typings/tsd.d.ts" />

var mongoose = require("mongoose");
var passportMongoose = require("passport-local-mongoose");

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

schema.plugin(passportMongoose);

module.exports = mongoose.model('User', schema);