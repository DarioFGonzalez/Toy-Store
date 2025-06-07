const express = require("express");
const server = express();
const mainRouter = require('./routes/mainRouter');

server.use(express.json());
server.use(mainRouter);

module.exports = server;