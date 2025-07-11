const { Op } = require('sequelize');
const { validate: uuidValidate, version: uuidVersion } = require('uuid');
const { Products } = require('../../db/db');

const getProducts = async (req, res) =>
{
    const { name, category, minPrice, maxPrice } = req.query;
    const whereClause = {};

    if(name && name!=='')
    {
        whereClause.name = { [Op.iLike]: `%${name}%` };
    }
    if(category && category!=='')
    {
        whereClause.category = category;
    }

    const priceConditions = {};
    let flag = false;

    if(minPrice)
    {
        flag = true;
        priceConditions[Op.gte] = Number(minPrice);
    }
    if(maxPrice)
    {
        flag = true;
        priceConditions[Op.lte] = Number(maxPrice);
    }

    if(flag)
    {
        whereClause.price = priceConditions;
    }

    try
    {
        const allProducts = await Products.findAll( { where: whereClause } );
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