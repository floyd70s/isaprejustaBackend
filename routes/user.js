'use strict'

/**
 * @author CPerezD
 * @description aca se definen las rutas para el modelo usuario
 */

var express = require('express')
var UserController = require('../controllers/user')
var api = express.Router();
var md_auth = require('../middlewares/authenticated')

// var multipart = require('connect-multiparty')
// var md_upload = multipart({ uploadDir: 'uploads/users' })

var crypto = require('crypto')
var multer = require('multer');
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/users');
    },
    filename(req, file = {}, cb) {
        const { originalname } = file;
        const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + fileExtension);
        });
    },
});

var mul_upload = multer({ dest: 'uploads/users', storage });


api.get('/probando-controlador', UserController.pruebas)
api.post('/saveUser', UserController.saveUser)
// api.post('/upload-Image-user/:id', [md_upload], UserController.uploadImage)
api.post('/upload-image-user/:id', [mul_upload.single('image')], UserController.upImage)
api.get('/get-Image-user/:imageFile', UserController.getImageFile)
api.post('/get-user-by-rut', UserController.getUserByRut)
api.get('/get-users', UserController.getUsers)
module.exports = api
