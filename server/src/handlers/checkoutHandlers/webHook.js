const { Op } = require('sequelize');
const { conn, Products, Carts } = require( '../../db/db');

const webHook = async ( req, res ) =>
{
    console.log( `req.body: ${req.body}\nreq.body.externalReference: ${req.body.externalReference}\n
        status: ${req.body.status}` );
    
    const {externalReference, status} = req.body;

    const t = await conn.transaction();

    if(status=='failed') return res.status(500).json( { webHook: 'Payment failed' } );

    try
    {
        const thisCart = await Carts.findByPk( externalReference, { include:
        {
            model: Products,
            as: 'products',
            attributes: [ 'id', 'name', 'stock' ],
            through: { attributes: [ 'quantity', 'priceAtAddition' ] }
        }, transaction: t } );

        const promises = thisCart.products.map( item =>
        {
            const newStock = item.stock - item.CartItem.quantity;
            if( newStock < 0 )
            {
                throw new Error(`Sin suficiente stock en producto: ${item.name}`);
            }
            return Products.update( { stock: newStock }, { where: { id: item.id }, transaction: t } );
        } );

        await Promise.all( promises );

        await Carts.update( { status: 'paid' }, { where: { id: externalReference }, transaction: t } );

        await t.commit();

        return res.status(200).json( { success: 'Stock actualizado' } );
    }
    catch( err )
    {
        console.error( err );
        await t.rollback();
        return res.status(500).json( { manageStock: err.message } );
    }
}

module.exports = webHook;