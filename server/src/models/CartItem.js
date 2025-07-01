const { DataTypes } = require('sequelize');

module.exports = ( sequelize ) =>
{
    sequelize.define( "CartItem",
        {
            id:
            {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            cartId:
            {
                type: DataTypes.UUID,
                allowNull: false
            },
            productId:
            {
                type: DataTypes.UUID,
                allowNull: false
            },
            quantity:
            {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            priceAtAddition:
            {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false
            }
        }, { timestamps: true }
    );
};