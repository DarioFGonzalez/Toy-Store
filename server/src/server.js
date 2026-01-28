const express = require("express");
const server = express();
const cors = require('cors');
const { MercadoPagoConfig } = require('mercadopago');
const { v2: cloudinary } = require('cloudinary'); 
const nodemailer = require('nodemailer');
const mainRouter = require('./routes/mainRouter');
const { initializeLockerManager } = require("./services/PudoLockerManager");

const client = new MercadoPagoConfig( { accessToken: process.env.MP_ACCESS_TOKEN } );

cloudinary.config(
{
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const corsOptions =
{
  origin: 'https://toy-store-tau.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204
};

server.use( process.env.NODE_ENV === 'prouction' ? cors(corsOptions) : cors() );

server.use( express.json()) ;
server.use( (req,res,next) =>
{
    req.mercadoPagoClient = client;
    req.mailerTransporter = transporter;
    next();
})
server.use(mainRouter);

module.exports = server;