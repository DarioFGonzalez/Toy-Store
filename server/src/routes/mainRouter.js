const {Router} = require("express");
const productRouter = require('./productsRouter');

const mainRouter = Router();

mainRouter.use( '/product', productRouter );

module.exports = mainRouter;