const {Router} = require("express");
const productRouter = require('./productsRouter');
const checkoutRouter = require("./checkoutRouter");
const cartRouter = require("./cartRouter");
const adminRouter = require("./adminRouter");
const bannerRouter = require("./bannerRouter");

const mainRouter = Router();

mainRouter.use( '/product', productRouter );
mainRouter.use( '/cart', cartRouter );
mainRouter.use( '/checkout', checkoutRouter );
mainRouter.use( '/admin', adminRouter );
mainRouter.use( '/banner' , bannerRouter );

module.exports = mainRouter;