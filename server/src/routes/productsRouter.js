const {Router} = require("express");
const { getProducts, getProductById } = require('../handlers/productHandlers/getProducts');
const postProduct = require("../handlers/productHandlers/postProducts");
const updateProduct = require("../handlers/productHandlers/updateProduct");
const deleteProduct = require("../handlers/productHandlers/deleteProduct");

const productRouter = Router();

productRouter.get( '/:id', getProductById );
productRouter.get( '/', getProducts );
productRouter.post( '/', postProduct );
productRouter.put( '/:id', updateProduct );
productRouter.delete( '/:id', deleteProduct );

module.exports = productRouter;