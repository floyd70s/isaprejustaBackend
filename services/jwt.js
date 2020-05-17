'use strict'
var jwt = require('jwt-simple')
var moment = require('moment')
var secret = require('../secret')

/**
 * @author CPerezD
 * @param {*} user 
 * @description creacion del token con JWT
 */
exports.createToken =
    function (user) {
        var payload = {
            sub: user._id,
            name: user.name,
            rut: user.rut,
            email: user.email,
            role: user.role,
            phone: user.phone,
            bank_account:user.bank_account,
            bank:user.bank,
            iat: moment().unix,
            exp: moment().add(1, 'days').unix
        }
        return jwt.encode(payload, secret)
    }