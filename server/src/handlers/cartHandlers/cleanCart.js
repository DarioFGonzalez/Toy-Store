const { CartItem, Carts, Products } = require('../../db/db');

const cleanCart = async ( req, res ) =>
{
    const { id } = req.params;

    try
    {
        const thisCart = await Carts.findByPk( id );
        if(!thisCart) throw new Error(`Cart not found in DB`);

        await CartItem.destroy( { where: { cartId: id } } );
        
        const updatedCart = await thisCart.reload( { include:
        {
            model: Products,
            as: 'products',
            attributes: [ 'id', 'name', 'description', 'price', 'imageUrl', 'stock' ],
            through: { attributes: [ 'quantity', 'priceAtAddition' ] }
        } } );
        
        return res.status(200).json( updatedCart );
    }
    catch( err )
    {
        console.error( err );
        return res.status(500).json( { cleanCart: err.message } );
    }
}

module.exports = cleanCart;