const {Banners} = require('../../db/db');

const updateBanner = async ( req, res ) =>
{
    const { id } = req.params;
    const data = req.body;

    try
    {
        const [ updated, updatedBanner ] = await Banners.update( data, { where: { id }, returning: true  } );
        if(!updated) return res.status(404).json( { updateBanner: 'Banner con esa ID no encontrado en la DB' } );

        return res.status(200).json( updatedBanner[0] );
    }
    catch(err)
    {
        console.error( err );
        return res.status(500).json( { updateBanner: err.message } );
    }
}

module.exports = updateBanner;