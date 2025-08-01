const {Router} = require('express');
const { getCarts, getCartById } = require('../handlers/cartHandlers/getCarts');
const postCart = require('../handlers/cartHandlers/postCart');
const updateCart = require('../handlers/cartHandlers/updateCart');
const deleteCart = require('../handlers/cartHandlers/deleteCart');
const cleanCart = require('../handlers/cartHandlers/cleanCart');
const checkToken = require('../middleware/checkToken');

const cartRouter = Router();

cartRouter.post( '/', postCart );
cartRouter.get( '/:id', getCartById );
cartRouter.patch( '/:id', updateCart );
cartRouter.delete( '/clean/:id', cleanCart );
cartRouter.delete( '/:id', deleteCart );

cartRouter.use( checkToken );

cartRouter.get( '/', getCarts );

module.exports = cartRouter;