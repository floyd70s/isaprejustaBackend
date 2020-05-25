'use strict'
var fs = require('fs')
var path = require('path')
var User = require('../models/user')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('../services/jwt')
var nodemailer = require('nodemailer');
const ejs = require('ejs');


function pruebas(req, res) {
    res.status(200).send({
        message: 'prueba de controlador'
    })
}
/**
 * @author CPerez
 * @param {*} req 
 * @param {*} res
 * @description: funcion de registro de usuarios 
 */
function saveUser(req, res) {
    console.clear()
    console.log('inicio de registro de usuario - saveUser')
    console.log(JSON.stringify(req.body))

    const id = Math.floor(100000 + Math.random() * 900000)
    console.log('new pass:' + id)

    var user = new User()
    var params = req.body
    let now = new Date();

    user.id = id
    user.name = params.name
    user.surname = params.surname
    user.rut = params.rut
    user.phone = params.phone
    user.email = params.email
    user.letter = 'letter'
    user.extraInfo = params.extraInfo
    user.date = now
    user.status = 'inicial'

    console.log('------ saveUser ------')
    console.log(user.name)
    console.log(user.surname)
    console.log(user.rut)
    console.log(user.phone)
    console.log(user.email)
    console.log(user.letter)
    console.log(user.extraInfo)

    console.log(user.date)
    console.log(user.status)

    if (user.name != null &&
        user.surname != null &&
        user.rut != null &&
        user.phone != null &&
        user.email != null 
    ) {
        //guardar usuario
        user.save((err, userStored) => {
            if (err) {
                console.log('error 500: ' + err.message)
                res.status(500).send({ message: err.message })
            } else {
                if (!userStored) {
                    console.log('error 404: No se ha registrado el usuario')
                    res.status(404).send({ message: 'No se ha registrado el usuario' })
                } else {
                    console.log('200 usuario registrado.')
                    sendEmail(user, user.id)
                    res.status(200).send({ user: userStored })
                }
            }
        })
    }
    else {
        res.status(500).send({ message: 'complete los campos' })
    }
}

/**
 * @author CPerez
 * @param {*} req 
 * @param {*} res 
 * @description funcion de actualizacion de datos de usuarios.
 */
function updateUser(req, res) {
    var userId = req.params.id
    var update = req.body

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar usuario' })
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el usuario' })
            } else {
                res.status(200).send({ user: userUpdated })
            }
        }
    })
}
/**
 * @author CPerez
 * @param {*} req 
 * @param {*} res
 * @description funcion que permite subir una imagen al usuario 
 */
function uploadImage(req, res) {
    console.log('-------- uploadImage --------')
    console.log('request'+req)
    var userId = req.params.id
    var file_name = 'No subido...'
     console.log(req.files)
    
     if (req.files) {
        var file_path = req.files.image.path
        var file_split= file_path.split('/')
        var file_name= file_split[2]
        var ext_file= file_name.split('.')
        var file_ext= ext_file[1]

        if (file_ext=='jpg'||file_ext=='gif'||file_ext=='png' || file_ext=='jpeg'|| file_ext=='doc'|| file_ext=='docx'|| file_ext=='pdf'){
            User.findByIdAndUpdate(userId,{letter:file_name}, (err,userUpdated)=>{
                if (!userUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar la imagen' })
                    console.log('404 No se ha podido actualizar la imagen')
                }else {
                    res.status(200).send({ User: userUpdated })
                    console.log('200 -ok')
                }
            })
        }else{
            res.status(404).send({ message: 'La extension no es correcta' })
            console.log('404 La extension no es correcta')
        } 
    } else {
        res.status(404).send({ message: 'No se ha subido ninguna imagen' })
        console.log('404 No se ha subido ninguna imagen')
        
    }
}
/**
 * @author Cperez
 * @param {*} req 
 * @param {*} res 
 */
function getImageFile(req, res) {
    var imageFile = req.params.imageFile
    var path_file = './uploads/users/' + imageFile
    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file))
        } else {
            res.status(200).send({ message: 'no existe la imagen' })
        }
    })
}
function getUsers(req, res) {
    var rut = req.params.rut
    console.log('busqueda de usuario por rut: ' + rut)

    User.find({}, (err, user) => {
        if (err) {
            res.status(500).send({ message: err })
        } else {
            if (!User) {
                res.status(400).send({ message: 'el usuario no existe' })
            } else {
                res.status(200).send({ user })
            }
        }
    })
}
/**
 * @author CPerez
 * @param {*} req 
 * @param {*} res 
 * @description funcion de ingreso de usuarios.
 */
function getUserByRut(req, res) {
    var params = req.body
    var rut = params.rut
    var email = params.email
    var password = params.password

    console.log('-------getUserByRut------------')
    console.log('Body:' + JSON.stringify(params))
    console.log('rut:' + rut)

    User.findOne({ rut: rut }, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' })
        } else {
            if (!user) {
                res.status(205).send({ message: 'El rut no Existe' })
            } else {
                console.log('devuelve usuario')
                res.status(200).send({ user })
            }
        }
    })
}
function generateQR(msg, QRName) {
    //Salida a fichero .svg en la ruta códigos
    var qr = require('qr-image');
    var fs = require('fs');
    var code = qr.image(msg, { type: 'svg' });
    var output = fs.createWriteStream('codes/' + QRName)
    code.pipe(output);
}
function sendEmail(user, id) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'justiciaisapre@gmail.com',
            pass: 'Elvis1007'
        }
    });

    let mailOptions = {
        from: '<justiciaisapre@gmail.com>',
        to: user.email,
        subject: 'Ya estamos trabajando para tí  ✔ - ' + user.name,
        html: ejs.render(fs.readFileSync('templates/welcome2/welcome.ejs', 'utf-8'), { name: user.name, code: id }),
        attachments: [{
            path: 'templates/welcome2/img/stickerEmail.png',
            cid: 'unique@justiciaisapre.cl' //same cid value as in the html img src
        }, {
            path: 'templates/welcome2/img/logo.png',
            cid: 'unique2@justiciaisapre.cl' //same cid value as in the html img src
        }]
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });

}

module.exports = {
    pruebas,
    saveUser,
    updateUser,
    uploadImage,
    getImageFile,
    getUserByRut,
    getUsers,
    generateQR
}
