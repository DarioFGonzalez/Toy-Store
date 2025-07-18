const express = require("express");
const server = express();
const cors = require('cors');
const { MercadoPagoConfig } = require('mercadopago');
const mainRouter = require('./routes/mainRouter');
const client = new MercadoPagoConfig( { accessToken: process.env.MP_ACCESS_TOKEN } );

server.use(express.json());
server.use( cors() );
server.use( (req,res,next) =>
{
    req.mercadoPagoClient = client;
    req.backendUrl = 'https://toy-store-zw00.onrender.com/';
    next();
})
server.use(mainRouter);

module.exports = server;