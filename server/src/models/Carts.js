const { DataTypes } = require('sequelize');

const status = [ 'active', 'purchased', 'abandoned' ];

module.exports = ( sequelize ) =>
{
    sequelize.define( "Carts",
        {
            id:
            {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            status:
            {
                type: DataTypes.ENUM( ...status ),
                defaultValue: 'active',
                allowNull: false
            },
            preferenceId:
            {
                type: DataTypes.STRING,
                allowNull: true
            },
            customerEmail:
            {
                type: DataTypes.STRING,
                allowNull: true
            },
            customerPhone:
            {
                type: DataTypes.STRING,
                allowNull: true
            },
            customerName:
            {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, { timestamps: true }
    );
};