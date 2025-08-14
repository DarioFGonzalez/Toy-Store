const {Banners} = require('../../db/db');

const postBanner = async ( req, res ) =>
{
    const data = req.body;

    try
    {
        const newBanner = await Banners.create( data );
        return res.status(200).json( newBanner );
    }
    catch(err)
    {
        console.error( err );
        return res.status(500).json( { postBanner: err.message } );
    }
}

module.exports = postBanner;