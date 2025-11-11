const { Orders } = require('../../db/db');

const getAllOrders = async ( req, res ) =>
{
    try
    {
        const allOrders = await Orders.findAll();

        return res.status(200).json( allOrders );
    }
    catch( err )
    {
        console.error( err );
        return res.status(500).json( { getAllOrders: err.message } );
    }
}

const getOrderById = async ( req, res ) =>
{
    const { id } = req.params;

    try
    {
        const thisOrder = await Orders.findByPk( id );

        return res.status(200).json( thisOrder );
    }
    catch( err )
    {
        console.error( err );
        return res.status(500).json( { getOrderById: err.message } );
    }
}

module.exports = { getAllOrders, getOrderById };