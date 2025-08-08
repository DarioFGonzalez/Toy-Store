const express = require("express");
const server = express();
const cors = require('cors');
const { MercadoPagoConfig } = require('mercadopago');
const mainRouter = require('./routes/mainRouter');
const client = new MercadoPagoConfig( { accessToken: process.env.MP_ACCESS_TOKEN } );

server.use( cors() );
server.use(express.json());
server.use( (req,res,next) =>
{
    req.mercadoPagoClient = client;
    next();
})
server.use(mainRouter);

module.exports = server;