const express = require("express");
const server = express();
const cors = require('cors');
const { MercadoPagoConfig } = require('mercadopago');
const { v2: cloudinary } = require('cloudinary'); 
const mainRouter = require('./routes/mainRouter');
const client = new MercadoPagoConfig( { accessToken: process.env.MP_ACCESS_TOKEN } );

cloudinary.config(
{
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

server.use( cors() );
server.use( express.json()) ;
server.use( (req,res,next) =>
{
    req.mercadoPagoClient = client;
    next();
})
server.use(mainRouter);

module.exports = server;