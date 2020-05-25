'use strict'

/**
 * @author CPerezD
 * @description aca se definen las rutas para el modelo usuario
 */

var express= require('express')
var UserController=require('../controllers/user')
var api= express.Router();
var md_auth= require('../middlewares/authenticated')

var multipart=require('connect-multiparty')
var md_upload=multipart({uploadDir:'./uploads/users'})

api.get('/probando-controlador',UserController.pruebas)
api.post('/saveUser',UserController.saveUser)
api.post('/upload-Image-user/:id',[md_upload],UserController.uploadImage)
api.get('/get-Image-user/:imageFile',UserController.getImageFile)
api.post('/get-user-by-rut',UserController.getUserByRut) 
api.get('/get-users',UserController.getUsers) 
module.exports=api
 