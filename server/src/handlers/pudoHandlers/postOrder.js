const axios = require('axios');
const pudoTokenManager = require('../../services/PudoTokenManager');
const { getLabelPdf, getTrackingNumber } = require('../../config/getOrderDetails');
const { SHIPMENT_URL } = require('../../config/pudoApiConfig');
const generateOrderEmailHtml = require('../../config/formatMail');
const { Orders } = require('../../db/db');

const postOrder = async ( { id } ) =>
{
    let mailer = req.mailerTransporter;
    let trackingUrlResponse = null;
    let stickerResponse = null;
    let orderCreatedSuccessfully = false; 

    try
    {
        const thisOrder = await Orders.findOne( { where: { internalCartId: id } } );
        const formatedOrder = { ...thisOrder.dataValues }; 

        if (typeof formatedOrder.platformOrderId === 'string')
        {
            formatedOrder.platformOrderId = Number(formatedOrder.platformOrderId);
        }
        if (typeof formatedOrder.platformOrderNumber === 'string')
        {
            formatedOrder.platformOrderNumber = Number(formatedOrder.platformOrderNumber);
        }
        if (formatedOrder.shippingInfo && formatedOrder.shippingInfo.lockerId)
        {
            formatedOrder.shippingInfo.lockerId = Number(formatedOrder.shippingInfo.lockerId);
        }
        if (formatedOrder.metrics)
        {
            formatedOrder.metrics.depthInMm = Number(formatedOrder.metrics.depthInMm);
            formatedOrder.metrics.widthInMm = Number(formatedOrder.metrics.widthInMm);
            formatedOrder.metrics.heightInMm = Number(formatedOrder.metrics.heightInMm);
            formatedOrder.metrics.weightInGrams = Number(formatedOrder.metrics.weightInGrams);
        }
        if (Array.isArray(formatedOrder.items))
        {
            formatedOrder.items = formatedOrder.items.map(item => (
            {
                ...item,
                price: Number(item.price), 
                quantity: Number(item.quantity),
                depthInMm: Number(item.depthInMm),
                widthInMm: Number(item.widthInMm),
                heightInMm: Number(item.heightInMm),
                weightInGrams: Number(item.weightInGrams),
            }));
        }

        delete formatedOrder.shippingInfo.price;
        delete formatedOrder.createdAt;
        delete formatedOrder.updatedAt;
        delete formatedOrder.internalCartId;
        delete formatedOrder.trackingUrl;
        
        const headerObject = await pudoTokenManager.getValidHeader();
        const headers = headerObject.headers;

        const axiosConfigPost = {
            headers,
        };

        try
        {
            const shipment = await axios.post(SHIPMENT_URL, formatedOrder, axiosConfigPost);
            
            if (shipment.status === 200 || shipment.status === 201)
            {
                orderCreatedSuccessfully = true;
            } 
            else
            {
                throw new Error(`Fallo en POST Order. Status: ${shipment.status}`);
            }
        } 
        catch (err) 
        {
            const isUnicodeError = err.message && err.message.includes('Unicode');
            const isAxiosError = err.isAxiosError && err.code === 'ECONNRESET';
            
            if (isUnicodeError || isAxiosError)
            {
                console.warn("⚠️ Advertencia: Error de parsing Unicode o conexión inestable, asumiendo orden creada.");
                orderCreatedSuccessfully = true;
            } 
            else if (err.response)
            {
                throw err;
            } 
            else
            {
                throw err;
            }
        }

        if (orderCreatedSuccessfully)
        {
            trackingUrlResponse = await getTrackingNumber( formatedOrder.platformOrderId );

            await thisOrder.update( { trackingUrl: trackingUrlResponse } );
            
            const formatedMail = generateOrderEmailHtml(thisOrder);
            const STORE_NAME = "Violeta's store";

            const mailOptions =
            {
                from: `"${STORE_NAME}" <no-reply@violetas.com>`,
                to: 'dario.zerobyte@gmail.com',
                subject: `Nueva Venta PUDO: Orden #${formatedOrder.platformOrderId}`,
                html: formatedMail
            };

            try
            {
                await mailer.sendMail(mailOptions);
                console.log('Notificación enviada');
            }
            catch( err )
            {
                console.error('Fallo el envío del correo de notificación:', err);
            }

            return true;
        }

        return false;
    }
    catch( err )
    {
        let errorMessage = err.message;
        let pudoResponseData = "N/A";

        if (err.response)
        {
            errorMessage = `Error ${err.response.status}: ${err.response.statusText}`;
            
            if (Buffer.isBuffer(err.response.data))
            {
                 pudoResponseData = err.response.data.toString('utf8');
            }
            else if (err.response.data)
            {
                pudoResponseData = err.response.data;
            }
        } 
        else if (err.message.includes('Fallo al obtener'))
        {
             errorMessage = err.message;
        }

        console.error(`[postOrder] FALLO al intentar crear la orden.`);
        console.error(`Mensaje de Axios/PUDO: ${errorMessage}`);
        console.error("Respuesta detallada de PUDO:", pudoResponseData);

        return false;
    }
}

module.exports = postOrder;