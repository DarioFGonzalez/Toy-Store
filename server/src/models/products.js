const { DataTypes } = require('sequelize');

const categories = [ 'otros', 'juego de mesa', 'muñeco', 'peluche' ];

module.exports = ( sequelize ) =>
{
    sequelize.define( "Products",
        {
            id:
            {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            name:
            {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            highlighted:
            {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            description:
            {
                type: DataTypes.TEXT,
                allowNull: true
            },
            price:
            {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false
            },
            image:
            {
                type: DataTypes.STRING,
                defaultValue: 'https://vectorseek.com/wp-content/uploads/2023/08/Minimalist-Reptar-Logo-Vector.svg-.png'
            },
            category:
            {
                type: DataTypes.ENUM( ...categories ),
                defaultValue: 'otros'
            },
            visible:
            {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: true
            },
            stock:
            {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            timestamps: true,
            createdAt: 'creado_en',
            updatedAt: 'actualizado_en'
            } )
};