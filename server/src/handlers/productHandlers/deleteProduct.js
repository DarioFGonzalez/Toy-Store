const { Products } = require('../../db/db');

const deleteProduct = async ( req, res ) =>
{
    const { id } = req.params;

    try
    {
        const destroyed = await Products.destroy( { where: { id } } );

        if(!destroyed) return res.status(404).json( { deleteProduct: 'Producto no eliminado/encontrado en la DB' } );

        return res.status(200).json( { message: 'Producto eliminado de la DB' } );
    }
    catch(error)
    {
        console.error( error );
        return res.status(500).json( { deleteProduct: error.message } );
    }
}

module.exports = deleteProduct;