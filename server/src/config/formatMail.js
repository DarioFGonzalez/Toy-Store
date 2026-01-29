const { getLabelPdf } = require('./getOrderDetails');

async function generateOrderEmailHtml(thisOrder, formatedOrder) {
    let totalPrice = 0;
    let stickerResponse = '';

    try
    {
        stickerResponse = await getLabelPdf( formatedOrder.platformOrderId );
    }
    catch( err )
    {
        console.log( 'Error en formatMail: ', err );
        throw new Error( err );
    }

    const itemsTableRows = thisOrder.items.map(item => {
        const unitPrice = parseFloat(item.price);
        const subTotal = unitPrice * item.quantity;
        
        if (isNaN(unitPrice)) {
            console.error(`Error: item.price (${item.price}) no es un número válido para el ítem ${item.name}`);
            return '<tr><td colspan="4">Precio no disponible/inválido</td></tr>';
        }
        
        totalPrice += subTotal;
        
        return `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${unitPrice.toFixed(2)}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${subTotal.toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    const { depthInMm, widthInMm, heightInMm, weightInGrams } = thisOrder.metrics;
    const depthCm = (depthInMm / 10).toFixed(1);
    const widthCm = (widthInMm / 10).toFixed(1);
    const heightCm = (heightInMm / 10).toFixed(1);
    const weightKg = (weightInGrams / 1000).toFixed(2);
    
    const totalVenta = totalPrice.toFixed(2);

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            
            <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">🛍️ NUEVA ORDEN DE VENTA</h1>
                <p style="margin-top: 5px; font-size: 14px;">Para Preparación y Despacho Inmediato</p>
            </div>
            
            <div style="padding: 20px; border-bottom: 2px solid #f0f0f0;">
                <h2 style="color: #007bff; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 5px;">Detalles de la Transacción</h2>
                <p style="font-size: 16px; margin-bottom: 5px;"><strong>ID de Orden (Plataforma):</strong> ${thisOrder.platformOrderNumber}</p>
                <p style="font-size: 16px; margin-bottom: 5px;"><strong>ID Interno del Carrito:</strong> ${thisOrder.internalCartId}</p>
                <p style="font-size: 16px; margin-bottom: 5px;"><strong>Sticker de la orden:</strong> ${stickerResponse}</p>
                
                <div style="text-align: right; background-color: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin-top: 15px;">
                    <h3 style="margin: 0; font-size: 20px;">TOTAL DE LA VENTA: <span style="font-size: 28px;">$${totalVenta}</span></h3>
                </div>
            </div>

            <div style="padding: 20px; border-bottom: 2px solid #f0f0f0;">
                <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px;">👤 Información del Cliente</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 30%; padding: 5px 0;"><strong>Nombre:</strong></td>
                        <td style="width: 70%; padding: 5px 0;">${thisOrder.customer.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0;"><strong>Teléfono:</strong></td>
                        <td style="padding: 5px 0;">${thisOrder.customer.phoneNumber}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0;"><strong>Correo:</strong></td>
                        <td style="padding: 5px 0;">${thisOrder.customer.mail}</td>
                    </tr>
                </table>
            </div>

            <div style="padding: 20px; border-bottom: 2px solid #f0f0f0; background-color: #f7f7f7;">
                <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px;">📦 Dimensiones de la Caja a Usar</h2>
                <p style="font-size: 16px; margin-top: 0;">**IMPORTANTE: Utilice una caja de al menos estas medidas**</p>
                
                <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 5px; margin-top: 10px;">
                    <tr>
                        <td style="padding: 10px; text-align: center; border: 1px solid #ddd; font-weight: bold;">Alto (cm)</td>
                        <td style="padding: 10px; text-align: center; border: 1px solid #ddd; font-weight: bold;">Ancho (cm)</td>
                        <td style="padding: 10px; text-align: center; border: 1px solid #ddd; font-weight: bold;">Largo (cm)</td>
                        <td style="padding: 10px; text-align: center; border: 1px solid #ddd; font-weight: bold;">Peso Estimado (kg)</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; text-align: center; border: 1px solid #ddd; font-weight: bold; color: #d9534f;">${heightCm}</td>
                        <td style="padding: 10px; text-align: center; border: 1px solid #ddd; font-weight: bold; color: #d9534f;">${widthCm}</td>
                        <td style="padding: 10px; text-align: center; border: 1px solid #ddd; font-weight: bold; color: #d9534f;">${depthCm}</td>
                        <td style="padding: 10px; text-align: center; border: 1px solid #ddd; font-weight: bold;">${weightKg}</td>
                    </tr>
                </table>
            </div>
            
            <div style="padding: 20px; border-bottom: 2px solid #f0f0f0;">
                <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px;">🛒 Contenido del Carrito</h2>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <thead>
                        <tr style="background-color: #f0f0f0;">
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Artículo</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Cantidad</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Precio Unit.</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsTableRows}
                    </tbody>
                </table>
            </div>
            
            <div style="padding: 20px;">
                <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px;">📍 Información de Envío</h2>
                <p style="margin-bottom: 5px;"><strong>Destino (Locker ID):</strong> <span style="color: #007bff; font-weight: bold;">#${thisOrder.shippingInfo.lockerId}</span></p>
                <p style="margin-bottom: 15px;">**Dirección de Destino PUDO:** ${thisOrder.shippingInfo.destination.address}</p>

                <p><strong>Link de Seguimiento (Tracking URL):</strong></p>
                <a href="${thisOrder.trackingUrl}" style="word-break: break-all; color: #007bff;">${thisOrder.trackingUrl}</a>
                
                <p style="margin-top: 20px; text-align: center; color: #777; font-size: 12px;">Recuerde imprimir el sticker proporcionado por PUDO.</p>
            </div>
            <div>
                Hablando mal y pronto, sería esto:
                <div> ${thisOrder} </div>
            </div
        </div>
    `;

    return htmlContent;
}

module.exports = generateOrderEmailHtml;