const {Banners} = require('../../db/db');

const getBanners = async ( req, res ) =>
{
    const { active } = req.query;

    try
    {
        if(active)
        {
            const activeBanners = await Banners.findAll( { where: { active: true } } );

            return res.status(200).json( activeBanners );
        }

        const allBanners = await Banners.findAll();

        return res.status(200).json( allBanners );
    }
    catch(err)
    {
        console.error( err );
        return res.status(500).json( { getBanners: err.message } );
    }
}

const getBannerById = async ( req, res ) =>
{
    const { id } = req.params;
    if( !uuidValidate(id) || uuidVersion(id)!==4 )
    {
        return res.status(400).json( { error: "Formato del ID inválido (No UUIDv4)" } );
    }

    try
    {
        const bannerById = await Banners.findByPk( id );

        return res.status(200).json( bannerById );
    }
    catch(err)
    {
        console.error( err );
        return res.status(500).json( { getBannerById: err.message } );
    }
}

module.exports = { getBanners, getBannerById };