const {Router} = require("express");
const productRouter = require('./productsRouter');
const fillUp = require("../handlers/init/fillUp");
const checkoutRouter = require("./checkoutRouter");
const cartRouter = require("./cartRouter");

const mainRouter = Router();

mainRouter.use( '/product', productRouter );
mainRouter.use( '/cart', cartRouter );
mainRouter.use( '/checkout', checkoutRouter );
mainRouter.post( '/fill', fillUp );

module.exports = mainRouter;