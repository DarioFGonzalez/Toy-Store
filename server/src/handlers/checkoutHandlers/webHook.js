const { Op } = require('sequelize');
const { Payment } = require('mercadopago')
const { conn, Products, Carts, Orders } = require( '../../db/db');
const generateOrderEmailHtml = require('../../config/formatMail');

const webHook = async ( req, res ) =>
{
    console.log('Inicio de comunicación con el webhook');
    const paymentId = req.query.id;
    console.log("El paymentId es: ", paymentId);
    
    const paymentClient = new Payment(req.mercadoPagoClient);
    
    const paymentData = await paymentClient.get( { id: paymentId } );
    console.log("La data del pago es: ", JSON.stringify(paymentData));
    
    const t = await conn.transaction();

    if(paymentData.status=='failed') return res.status(500).json( { webHook: 'Payment failed' } );

    try
    {
        const thisCart = await Carts.findByPk( paymentData.external_reference, { include:
        {
            model: Products,
            as: 'products',
            attributes: [ 'id', 'name', 'price', 'stock' ],
            through: { attributes: [ 'quantity', 'priceAtAddition' ] }
        }, transaction: t } );
        console.log('traje el carrito.')

        const promises = thisCart.products.map( item =>
        {
            const newStock = item.stock - item.CartItem.quantity;
            if( newStock < 0 )
            {
                throw new Error(`Sin suficiente stock en producto: ${item.name}`);
            }
            return Products.update( { stock: newStock }, { where: { id: item.id }, transaction: t } );
        } );
        console.log('checkié stocks.');

        await Promise.all( promises );

        await Carts.update( { status: 'purchased' }, { where: { id: paymentData.external_reference }, transaction: t } );

        // Preparar datos para el email
        const orderData = {
            id: thisCart.id,
            customerName: thisCart.customerName,
            customerEmail: thisCart.customerEmail,
            customerPhone: thisCart.customerPhone,
            products: thisCart.products,
            total: thisCart.products.reduce((acc, item) => acc + (Number(item.price) * item.CartItem.quantity), 0)
        };

        // Enviar email al dueño del local con los detalles del pedido
        const emailHtml = generateOrderEmailHtml(orderData);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Enviar al mismo email del negocio
            subject: `Nueva Orden de Venta - ${paymentData.external_reference}`,
            html: emailHtml
        };

        // Usar el transporter que ya está configurado en server.js
        await req.mailerTransporter.sendMail(mailOptions);

        await t.commit();

        return res.status(200).json( { success: 'Stock actualizado y email enviado' } );
    }
    catch( err )
    {
        console.error( err );
        await t.rollback();
        return res.status(500).json( { manageStock: err.message } );
    }
}

module.exports = webHook;