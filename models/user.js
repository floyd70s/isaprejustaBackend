'use strict'
var mongoose= require('mongoose')
var Schema= mongoose.Schema

var UserSchema= Schema({
    id:String,
    name:String,
    surname:String,
    rut:String,
    phone:Number,
    email:String,
    letter:String,
    extraInfo:String,
    status:String,
    date:Date 
})

module.exports= mongoose.model('User',UserSchema)
