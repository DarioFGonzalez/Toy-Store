const { Op } = require('sequelize');
const { validate: uuidValidate, version: uuidVersion } = require('uuid');
const { Products } = require('../../db/db');

const getProducts = async (req, res) =>
{
    const { name, category, minPrice, maxPrice } = req.query;
    let { page } = req.query;

    if( !page || page<=0 ) page = 1;

    let whereClause = {};

    if(name && name!=='')
    {
        whereClause.name = { [Op.iLike]: `%${name}%` };
    }
    if(category && category!=='')
    {
        whereClause.category = category;
    }

    let priceConditions = {};
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
        // wop: tengo que fijarme como pedir a la db directamente resultados de x a y, no PEDIR TODO y separarlo acá.
        const itemsToShow = paginado( page, allProducts );
        return res.status(200).json( itemsToShow );
    }
    catch(error)
    {
        console.error( error );
        return res.status(500).json( { error_getAllProducts: error.message } );
    }
};

const paginado = ( page, data ) =>
{
    const itemsPerPage = 10;
    const to = ( itemsPerPage * page ) -1;
    const from = ( to - itemsPerPage ) + 1;
    const segment = data.slice( from, to );
    return segment;
}

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