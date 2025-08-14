const { Products } = require('../../db/db');

const postProduct = async ( req, res ) =>
{
    const data = req.body;
    
    try
    {
        const newProduct = await Products.create( data );
        return res.status(200).json( newProduct );    
    }
    catch(error)
    {
        console.error( error );
        return res.status(500).json( { postProduct: error.message } );
    }
}

module.exports = postProduct;