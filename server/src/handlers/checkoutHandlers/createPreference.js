const { Op } = require('sequelize');
const { Preference }= require('mercadopago');
const {conn, Products, Carts} = require('../../db/db');

const createPreference = async ( req, res ) =>
{
    const { cart, form } = req.body;
    const mpClient = req.mercadoPagoClient;

    const t = await conn.transaction();

    try
    {
        const preferenceData =
        {
            items: [],
            payer: {
                email: form.email,
                address: { street_name: form.address },
                phone: { number: form.number } },
            back_urls:
            {   success: "https://localhost:5173/success",
                failure: "https://localhost:5173/failure",
                pending: "https://localhost:5173/pending"
            },
            auto_return: "approved",
            external_reference: cart.id,
            notification_url: `${req.backendUrl}checkout/hook`
        }

        const allIds = cart.products.map( cartItem => cartItem.id );

        const allProducts = await Products.findAll(
            { where:
                { id: { [Op.in]: allIds } }, transaction: t
            } );
        
        allProducts.map( thisProduct =>
        {
            const productInCart = cart.products.find( item => item.id === thisProduct.id );

            if(!productInCart) throw new Error (`Producto ${thisProduct.name} no encontrado en la base de datos`);

            const newStock = thisProduct.stock - productInCart.CartItem.quantity;

            if(newStock<0) throw new Error (`Producto ${thisProduct.name} sin stock suficiente`);

            preferenceData.items.push( {
                id: thisProduct.id,
                title: thisProduct.name,
                description: thisProduct.description || '',
                quantity: productInCart.CartItem.quantity,
                unit_price: Number(thisProduct.price),
                currency_id: "ARS"
            } );
        })

        const preference = new Preference( mpClient );
        const response = await preference.create( { body: preferenceData } );

        const preferenceId = response.id;
        const initPoint = response.init_point;

        const updateCart = await Carts.update( { preferenceId }, { where: { id: cart.id }, transaction: t } );
        if(updateCart[0]==0) throw new Error( `No se pudo agregar el preferenceId al carrito` );

        await t.commit();

        return res.status(200).json( { URL: `${initPoint}` } );
    }
    catch(err)
    {
        console.error( err );
        await t.rollback();
        return res.status(500).json( { createPreference: err.message } );
    }
}

module.exports = createPreference;