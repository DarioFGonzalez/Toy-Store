const { Carts, Products } = require('../../db/db');

const getCarts = async ( req, res ) =>
{
    try
    {
        const allCarts = await Carts.findAll();
        return res.status(200).json( allCarts );
    }
    catch( err )
    {
        console.error( err );
        return res.status(500).json( { getCarts: err.message } )
    }
}

const getCartById = async ( req, res ) =>
{
    const { id } = req.params;
    try
    {
        if(!id) throw new Error ( `No ID recieved` );
        const thisCart = await Carts.findByPk( id,
        {
            include:
            [
                {
                    model: Products,
                    as: 'products',
                    attributes: [ 'id', 'name', 'description', 'price', 'imageUrl', 'stock' ],
                    through: { attributes: [ 'quantity', 'priceAtAddition' ] }
                }
            ]
        } );
        if(!thisCart) throw new Error (`Cart with that ID not found in DB`);
        return res.status(200).json( thisCart );
    }
    catch( err )
    {
        console.error( err );
        return res.status(500).json( { getCartById: err.message } );
    }
}

module.exports = { getCarts, getCartById };