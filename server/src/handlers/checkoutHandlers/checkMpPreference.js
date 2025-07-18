const { Payment } = require('mercadopago');

const checkMpPreference = async ( req, res ) =>
{
    const { id } = req.params;

    const payment = new Payment( req.mercadoPagoClient );

    try
    {
        const paymentData = await payment.get( { id } );
        if(!paymentData) throw new Error(`Payment not found`);

        return res.status(200).json( paymentData );
    }
    catch(err)
    {
        console.error( err );
        return res.status(500).json( { checkMpPreference: err.message } );
    }
}

module.exports = checkMpPreference;