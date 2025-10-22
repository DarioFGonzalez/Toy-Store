const axios = require('axios');
const {Router} = require('express');
const pudoRouter = Router();
const PudoTokenManager = require('../services/PudoTokenManager');
const { getLockerLocations, getLockersByLocation } = require('../handlers/pudoHandlers/getLockers');

pudoRouter.get( '/locations', getLockerLocations );
pudoRouter.get( '/:zone', getLockersByLocation );

module.exports = pudoRouter;