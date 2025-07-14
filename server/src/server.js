const express = require("express");
const server = express();
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const mainRouter = require('./routes/mainRouter');
const client = new MercadoPagoConfig( { acces_token: process.env.MP_ACCEST_TOKEN } );

server.use(express.json());
server.use( cors() );
server.use( (req,res,next) =>
{
    req.mercadoPagoClient = client;
    next();
})
server.use(mainRouter);

module.exports = server;