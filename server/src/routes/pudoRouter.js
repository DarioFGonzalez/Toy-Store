const axios = require('axios');
const {Router} = require('express');
const pudoRouter = Router();
const PudoTokenManager = require('../services/PudoTokenManager');
const { getLockerLocations, getLockersByLocation } = require('../handlers/pudoHandlers/getLockers');
const { getAllOrders, getOrderById } = require('../handlers/pudoHandlers/getOrders');
const postQuote = require('../handlers/pudoHandlers/postQuote');
const postOrder = require('../handlers/pudoHandlers/postOrder');

pudoRouter.get( '/orders', getAllOrders );
pudoRouter.get( '/orders/:id', getOrderById );
pudoRouter.get( '/locations', getLockerLocations );
pudoRouter.get( '/:zone', getLockersByLocation );
pudoRouter.post( '/quote', postQuote );
pudoRouter.post( '/order/:id', async (req, res) =>
{
    const id = req.params.id;

    try
    {
        let mailer = req.mailerTransporter;
        await postOrder( { id, mailer } );

        return res.status(200).json( { postOrderRoute: 'Order creada' } );
    }
    catch( err )
    {
        console.error( err );
        return res.status(500).json( { postOrderRoute: err.message } );
    }
})

module.exports = pudoRouter;