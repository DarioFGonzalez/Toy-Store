const { Op } = require('sequelize');
const {conn, Products} = require('../../db/db');

const MP_URL = 'http://localhost:5173/pasarela';

const createPreference = async ( req, res ) =>
{
    const cart = req.body;

    const t = await conn.transaction();

    try
    {
        const allIds = cart.map( cartItem => cartItem.item.id );

        const allProducts = await Products.findAll(
            { where:
                { id: { [Op.in]: allIds } }, transaction: t
            } );
        
    allProducts.map( (thisProduct) =>
    {
        const productInCart = cart.find( x => x.item.id === thisProduct.id );

        if(!productInCart) throw new Error (`Producto ${thisProduct.name} no encontrado en la base de datos`);

        const newStock = thisProduct.stock - productInCart.quantity;

        if(newStock<0) throw new Error (`Producto ${thisProduct.name} sin stock suficiente`);
    })

    return res.status(200).json( { URL: `${MP_URL}` } );
    }
    catch(err)
    {
        console.error( err );
        await t.rollback();
        return res.status(500).json( { createPreference: err.message } );
    }
}

module.exports = createPreference;