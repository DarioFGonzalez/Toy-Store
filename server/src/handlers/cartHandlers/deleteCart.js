const { Carts } = require('../../db/db');

const deleteCart = async ( req, res ) =>
{
    const { id } = req.params;

    try
    {
        const deleted = await Carts.destroy( { where: { id } } );
        if(!deleted) throw new Error( `Carrito no borrado de la DB` );
        return res.status(200).json( { success: 'Carrito borrado satisfactoriamente' } );
    }
    catch(err)
    {
        console.error( err );
        return res.status(500).json( { deleteCart: err.message } );
    }
}

module.exports = deleteCart;