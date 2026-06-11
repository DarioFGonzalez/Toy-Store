const { Op } = require('sequelize');
const { Preference }= require('mercadopago');
const { conn, Products, Carts, Orders } = require('../../db/db');

const createPreference = async ( req, res ) =>
{
    const { cartId, contactInfo } = req.body;
    const mpClient = req.mercadoPagoClient;

    const t = await conn.transaction();

    try
    {
        // Buscar el carrito en la base de datos
        const cart = await Carts.findByPk(cartId, {
            include: {
                model: Products,
                as: 'products',
                attributes: [ 'id', 'name', 'description', 'price', 'stock' ],
                through: { attributes: [ 'quantity' ] }
            },
            transaction: t
        });

        if (!cart) throw new Error('Carrito no encontrado');

        const preferenceData =
        {
            items: [],
            payer: {
                email: contactInfo.mail,
                phone: { number: contactInfo.phoneNumber }
            },
            back_urls:
            {   
                success: 'https://toy-store-tau.vercel.app/home',
                failure: 'https://toy-store-tau.vercel.app/failure',
                pending: 'https://toy-store-tau.vercel.app/pending'
            },
            auto_return: "approved",
            external_reference: cartId,
            notification_url: 'https://toy-store-zw00.onrender.com/checkout/hook'
        };

        // Validar stock y crear items para MercadoPago
        for (const product of cart.products) {
            const newStock = product.stock - product.CartItem.quantity;

            if(newStock < 0) throw new Error (`Producto ${product.name} sin stock suficiente`);

            preferenceData.items.push({
                id: product.id,
                title: product.name,
                description: product.description || '',
                quantity: product.CartItem.quantity,
                unit_price: Number(product.price),
                currency_id: "ARS"
            });
        }

        // Crear preferencia en MercadoPago
        const preference = new Preference( mpClient );
        const response = await preference.create( { body: preferenceData } );

        const preferenceId = response.id;
        const initPoint = response.init_point;

        // Actualizar carrito con preferenceId
        const updateCart = await Carts.update( { preferenceId }, { where: { id: cartId }, transaction: t } );
        if(updateCart[0] === 0) throw new Error( `No se pudo agregar el preferenceId al carrito` );

        // Guardar información de contacto en el carrito para el webhook
        await Carts.update( 
            { 
                customerEmail: contactInfo.mail,
                customerPhone: contactInfo.phoneNumber,
                customerName: contactInfo.name
            }, 
            { where: { id: cartId }, transaction: t } 
        );

        await t.commit();

        return res.status(200).json( initPoint );
    }
    catch(err)
    {
        console.error( err );
        await t.rollback();
        return res.status(500).json( { createPreference: err.message } );
    }
}

module.exports = createPreference;
