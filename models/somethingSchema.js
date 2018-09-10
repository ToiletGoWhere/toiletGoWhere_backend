'use strict'

var mongoose = require('mongoose'),
    Schame = mongoose.Schema;

module.exports =
    mongoose.model('Something', {
        _id: String
    })