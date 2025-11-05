const axios = require('axios');
const {Router} = require('express');
const pudoRouter = Router();
const PudoTokenManager = require('../services/PudoTokenManager');
const { getLockerLocations, getLockersByLocation } = require('../handlers/pudoHandlers/getLockers');
const postQuote = require('../handlers/pudoHandlers/postQuote');

pudoRouter.get( '/locations', getLockerLocations );
pudoRouter.get( '/:zone', getLockersByLocation );
pudoRouter.post( '/quote', postQuote );

module.exports = pudoRouter;