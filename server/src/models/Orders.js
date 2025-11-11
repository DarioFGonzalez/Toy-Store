const {DataTypes} = require('sequelize');

module.exports = ( sequelize ) =>
{
    sequelize.define( "Orders", 
        {
            platformOrderId:
            {
                type: DataTypes.UUID,
                primaryKey: true
            },
            platformOrderNumber:
            {
                type: DataTypes.UUID,
                allowNull: false
            },
            sticker:
            {
                type: DataTypes.JSONB,
                allowNull: true
            },
            trackingUrl:
            {
                type: DataTypes.STRING,
                allowNull: true
            },
            customer:
            {
                type: DataTypes.JSONB,
                allowNull: false
            },
            shippingInfo:
            {
                type: DataTypes.JSONB,
                allowNull: false
            },
            createReserve:
            {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            metrics:
            {
                type: DataTypes.JSONB,
                allowNull: false
            },
            items:
            {
                type: DataTypes.JSONB,
                allowNull: false
            }
        }
    )
}