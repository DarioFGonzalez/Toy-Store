const {DataTypes} = require('sequelize');

module.exports = ( sequelize ) =>
{
    sequelize.define( "Orders", 
        {
            platformOrderId:
            {
                type: DataTypes.BIGINT,
                primaryKey: true
            },
            platformOrderNumber:
            {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            internalCartId:
            {
                type: DataTypes.UUID,
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