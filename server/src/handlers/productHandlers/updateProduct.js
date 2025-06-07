const { Products } = require('../../db/db');

const updateProduct = async ( req, res ) =>
{
    const data = req.body;
    const { id } = req.params;

    try
    {
        const [ updated, updatedProduct ] = await Products.update( data, { where: { id } , returning: true } );
        if(!updated) return res.status(404).json( { updateProduct: 'Producto no encontrado en la DB' } );
        return res.status(200).json( updatedProduct[0] );
    }
    catch(error)
    {
        console.error( error );
        return res.status(500).json( { updateProduct: error.message } );
    }
}

module.exports = updateProduct;