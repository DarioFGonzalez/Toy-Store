const { CartItem } = require('../../db/db');

const updateCart = async ( req, res ) =>
{
    const { id } = req.params;
    const { productId, quantity } = req.body;

    try
    {
        const [ updatedRows, updatedData ] = await CartItem.update( { quantity: quantity },
        { where: { cartId: id, productId: productId }, returning: true } );

        if(!updatedRows) throw new Error( `Error al actualizar el carrito` );

        return res.status(200).json( updatedData[0] );
    }
    catch( err )
    {
        console.error( err );
        return res.status(500).json( { updateCart: err.message } );
    }
}

module.exports = updateCart;