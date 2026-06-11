function generateOrderEmailHtml(orderData) {
    let totalPrice = 0;

    const itemsTableRows = orderData.products.map(item => {
        const unitPrice = parseFloat(item.price);
        const quantity = item.CartItem.quantity;
        const subTotal = unitPrice * quantity;
        
        if (isNaN(unitPrice)) {
            console.error(`Error: item.price (${item.price}) no es un número válido para el ítem ${item.name}`);
            return '<tr><td colspan="4">Precio no disponible/inválido</td></tr>';
        }
        
        totalPrice += subTotal;
        
        return `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${quantity}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${unitPrice.toFixed(2)}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${subTotal.toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    const totalVenta = totalPrice.toFixed(2);

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            
            <div style="background-color: #d4af37; color: #1a1a1a; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">💎 NUEVA ORDEN DE VENTA</h1>
                <p style="margin-top: 5px; font-size: 14px;">Para Preparación y Despacho Inmediato</p>
            </div>
            
            <div style="padding: 20px; border-bottom: 2px solid #f0f0f0;">
                <h2 style="color: #d4af37; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 5px;">Detalles de la Transacción</h2>
                <p style="font-size: 16px; margin-bottom: 5px;"><strong>ID del Carrito:</strong> ${orderData.id}</p>
                
                <div style="text-align: right; background-color: #f5f5f5; color: #1a1a1a; padding: 15px; border-radius: 5px; margin-top: 15px; border: 2px solid #d4af37;">
                    <h3 style="margin: 0; font-size: 20px;">TOTAL DE LA VENTA: <span style="font-size: 28px; color: #d4af37;">$${totalVenta}</span></h3>
                </div>
            </div>

            <div style="padding: 20px; border-bottom: 2px solid #f0f0f0;">
                <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px;">👤 Información del Cliente</h2>
                <p style="margin: 5px 0;"><strong>Nombre:</strong> ${orderData.customerName || 'No disponible'}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${orderData.customerEmail || 'No disponible'}</p>
                <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${orderData.customerPhone || 'No disponible'}</p>
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
            
            <div style="padding: 20px; background-color: #f9f9f9; text-align: center;">
                <p style="margin: 0; color: #777; font-size: 12px;">Este pedido ha sido procesado automáticamente a través del sistema de checkout.</p>
            </div>
        </div>
    `;

    return htmlContent;
}

module.exports = generateOrderEmailHtml;
