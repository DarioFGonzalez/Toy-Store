const { Op } = require('sequelize');
const { conn, Products } = require( '../../db/db');

const webHook = async ( req, res ) =>
{
    const items = req.body;

    const t = await conn.transaction();

    try
    {
        const itemsIds = items.map( x => x.item.id );

        const allTheseProducts = await Products.findAll(
            { where:
                { id: { [Op.in]: itemsIds } }, transaction: t
            } );

        const promises = items.map( item =>
        {
            const thisProduct = allTheseProducts.find( x => x.id === item.item.id );
            if(!thisProduct)
            {
                throw new Error(`Producto ${item.item.name} no encontrado en la DB`);
            }
            if(thisProduct.stock-item.quantity<0)
            {
                throw new Error(`Sin suficiente stock en producto ${item.item.name}`);
            }
            return Products.update(
                { stock: thisProduct.stock - item.quantity },
                { where: { id: thisProduct.id }, transaction: t } );
        } );

        await Promise.all( promises );

        await t.commit();

        return res.status(200).json( { success: 'Stock actualizado' } );
    }
    catch(err)
    {
        console.error( err );
        await t.rollback();
        return res.status(500).json( { manageStock: err.message } );
    }
}

module.exports = webHook;