'use strict'

var express = require('express');
var bodyParser=require('body-parser');
var app=express();
const morgan = require('morgan');		
const cors = require('cors');
//cargar rutas
var user_routes= require('./routes/user')

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
   


//cabeceras http 
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method,');
    res.header('content-type: application/json; charset=utf-8')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next()
})

// Middleware use
app.use(morgan('dev'));     					// Permite ver por consola las peticiones HTTP que llegan al servidor
app.use(bodyParser.urlencoded({ extended: true }));		// Convierte las peticiones del cliente ...
app.use(bodyParser.json());		// ... y las pasa a formato JSON
app.use(cors());		//Deshabilitar los cors		



//rutas base
app.use('/api',user_routes);

module.exports=app;
