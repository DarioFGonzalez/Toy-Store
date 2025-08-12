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
            imageUrl:
            {
                type: DataTypes.ARRAY(DataTypes.STRING),
                defaultValue: () =>
                    Array.from( { length: 5 }, () => 'https://res.cloudinary.com/violetastore/image/upload/v1755013343/mbg8rgsm0ysgikiwaoko.png' )
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