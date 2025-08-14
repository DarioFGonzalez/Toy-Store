const { Products } = require('../../db/db');
const {v2: cloudinary} = require('cloudinary');

const deleteProduct = async ( req, res ) =>
{
    const { id } = req.params;

    try
    {
        const thisItem = await Products.findByPk( id );

        const deletePromises = thisItem.imageUrl.map( image =>
            image.public_id!=='mbg8rgsm0ysgikiwaoko'
            ? cloudinary.uploader.destroy( image.public_id ) : null );

        await Promise.all(deletePromises);

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