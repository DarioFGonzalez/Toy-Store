const {Router} = require('express');
const pudoRouter = Router();
const PudoTokenManager = require('../services/PudoTokenManager');

pudoRouter.post('/', async (req, res) =>
{
    const token = await PudoTokenManager.getValidToken();

    return res.status(200).json( { token } );
} );

module.exports = pudoRouter;