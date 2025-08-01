const crypto = require('crypto');

const mpMiddleware = ( req, res, next ) =>
{
    const id = req.body?.data?.id;
    if(!id) return res.status(200).send("OK");

    const secret = process.env.MP_CLIENT_SECRET;
    if(!secret) return res.status(500).json( { error: 'Error de configuración de servidor' } );
    
    const signatureHeader = req.headers['x-signature'];
    if(!signatureHeader) return res.status(401).json( { error: 'Falta firma de autorización.' } );

    let signature = {};
    signatureHeader.split(',').forEach( item =>
    {
        const [ key, value ] = item.split('=');
        signature[key] = value;
    } );

    const timestamp = signature.ts;
    const recievedSignature = signature.v1;

    if(!timestamp || !recievedSignature) return res.status(401).json( { error: 'Formato de firma inválido.' } );

    const template = `id:${req.body.data.id};request-id:${req.headers['x-request-id']};ts:${timestamp};`;

    const hmac = crypto.createHmac( 'sha256', secret );
    hmac.update( template );
    const generatedSignature = hmac.digest( 'hex' );

    if( generatedSignature === recievedSignature )
    {
        console.log(`Acceso concedido. Identidad MP-Webhook confirmada.`);
        next();
    }
    else
    {
        console.error( "Firma de webhook de MercadoPago inválida." );
        return res.status(401).json( { error: 'Firma de webhook inválida. Acceso denegado.' } );
    }
}

module.exports = mpMiddleware;