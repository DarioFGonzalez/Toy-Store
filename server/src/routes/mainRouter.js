const {Router} = require("express");
const productRouter = require('./productsRouter');
const fillUp = require("../handlers/init/fillUp");

const mainRouter = Router();

mainRouter.use( '/product', productRouter );
mainRouter.post( '/fill', fillUp );

module.exports = mainRouter;