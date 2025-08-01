const {Router} = require("express");
const { getProducts, getProductById } = require('../handlers/productHandlers/getProducts');
const postProduct = require("../handlers/productHandlers/postProducts");
const updateProduct = require("../handlers/productHandlers/updateProduct");
const deleteProduct = require("../handlers/productHandlers/deleteProduct");
const checkToken = require('../middleware/checkToken');

const productRouter = Router();

productRouter.get( '/:id', getProductById );

productRouter.use( checkToken );
productRouter.get( '/', getProducts );

productRouter.post( '/', postProduct );
productRouter.put( '/:id', updateProduct );
productRouter.delete( '/:id', deleteProduct );

module.exports = productRouter;