'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

//mongoose.Promise = global.Promise;

mongoose.connect('mongodb://35.153.98.79:27017/isaprejusta', (err, res) => {
    if (err) {
        throw err;
    }
    else {
        console.log('la base esta corriendo correctamente...');
        app.listen(port, function () {
            console.log("v0.2 - el servidor del api rest activo en http://35.153.98.79:" + port)

            let now = new Date();
            console.log('La fecha actual es', now);
        });
    }
});




