const { Op } = require('sequelize');
const { Payment } = require('mercadopago')
const { conn, Products, Carts } = require( '../../db/db');

const webHook = async ( req, res ) =>
{
    const paymentId = req.query.id;
    
    const paymentClient = new Payment(req.mercadoPagoClient);
    
    const paymentData = await paymentClient.get( { id: paymentId } );

    const t = await conn.transaction();

    if(paymentData.status=='failed') return res.status(500).json( { webHook: 'Payment failed' } );

    try
    {
        const thisCart = await Carts.findByPk( paymentData.external_reference, { include:
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

        await Carts.update( { status: 'purchased' }, { where: { id: paymentData.external_reference }, transaction: t } );

        await t.commit();

        console.log("Terminé, teóricamente, de descontar stock y archivar el carrito");

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