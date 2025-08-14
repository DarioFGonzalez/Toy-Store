const {Banners} = require('../../db/db');
const {v2: cloudinary} = require('cloudinary');

const deleteBanner = async ( req, res ) =>
{
    const { id } = req.params;

    try
    {
        const thisBanner = await Banners.findByPk( id );
        if(!thisBanner) return res.status(404).json( { deleteBanner: 'Banner con ese ID no encotnrado en la DB' } );

        try
        {
            await cloudinary.uploader.destroy( thisBanner.imageUrl.public_id );
        }
        catch(err)
        {
            console.error( "Error borrando la imagen de Cloudinary: ", err );
            return res.status(500).json( { deleteBanner_cloudinary: err.message } );
        }

        const deleted = await Banners.destroy( { where: { id } } );
        if(!deleted) return res.status(404).json( { deleteBanner: 'Banner no eliminado de la DB' } );

        return res.status(200).json( { message: 'Banner eliminado de la base de datos' } );
    }
    catch(err)
    {
        console.error( err );
        return res.status(500).json( { deleteBanner: err.message } );
    }
}

module.exports = deleteBanner;