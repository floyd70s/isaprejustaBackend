'use strict'
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = Schema({
    name: String,
    rut: String,
    isapre: String,
    rutIsapre: String,
    legalRepresentative: String,
    riseIsapre: String,
    tribunal: String,
    nationality: String,
    maritalStatus: String,
    address: String,
    isapreAddress: String,
    planName: String,
    codePlan: String,
    dateEmision: Date,
    dateIssue: Date,
    codeMail: String,
    adjustmentPercentage: String,
    planBase: String,
    planBaseIncr: String
})

module.exports = mongoose.model('User', UserSchema)
