const express = require("express");
const server = express();
const cors = require('cors');
const mainRouter = require('./routes/mainRouter');

server.use(express.json());
server.use( cors() );
server.use(mainRouter);

module.exports = server;