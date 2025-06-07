const { Op } = require('sequelize');
const { validate: uuidValidate, version: uuidVersion } = require('uuid');
const { Products } = require('../../db/db');

const getProducts = async (req, res) =>
{
    const { name } = req.query;

    try
    {
        if(name)
        {
            const productByName = await Products.findAll( { where: { name: { [Op.iLike]: `%${name}%` } } } );
            return res.status(200).json( productByName );
        }    
        const allProducts = await Products.findAll();
        return res.status(200).json( allProducts );
    }
    catch(error)
    {
        console.error( error );
        return res.status(500).json( { error_getAllProducts: error.message } );
    }
};

const getProductById = async ( req, res ) =>
{
    const { id } = req.params;
    if( !uuidValidate(id) || uuidVersion(id)!==4 )
    {
        return res.status(400).json( { error: "Formato del ID inválido (No UUIDv4)" } );
    }
    
    try
    {
        const productById = await Products.findByPk( id );
    
        return res.status(200).json( productById );    
    }
    catch(error)
    {
        console.error( error );
        return res.status(500).json( { error_productByID: error.message } );
    }
}

module.exports = {getProducts, getProductById};