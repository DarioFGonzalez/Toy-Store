const { Carts, Products } = require('../../db/db');

const postCart = async ( req, res ) =>
{
    const { productId, quantity } = req.body;

    try
    {
        const thisProduct = await Products.findByPk( productId );
        if(!thisProduct) throw new Error( `Product with that ID not found in DB`);

        const newCart = await Carts.create();
        if(!newCart) throw new Error( `Error al crear carrito` );

        await newCart.addProduct( thisProduct, { through: { quantity: quantity, priceAtAddition: thisProduct.price } } );

        const finishedCart = await Carts.findByPk( newCart.id, { include:
            {
                model: Products,
                as: "products",
                attributs: [ 'id', 'name', 'price', 'stock'],
                through: { attributes: ['quantity', 'priceAtAddition'] }
            } } );
        return res.status(200).json( finishedCart );
    }
    catch( err )
    {
        console.error( err );
        return res.status(500).json( { postCart: err.message } );
    }
}

module.exports = postCart;