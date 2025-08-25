const { DataTypes } = require('sequelize');

const categories = [ 'otros',
    'aros',
    'anillos',
    'cadenitas',
    "chokers",
    'collares',
    'gargantillas',
    'pulseras',
    'tobilleras',
];

const materials = [ 'acero quirurgico',
    'alambre con memoria',
    'cristal checo',
    'fundicion',
    'hilo encerado',
    'madera',
    'mostacillas',
    'perlas de vidrio',
    'perlas acrilicas',
    'piedras semipreciosas',
    'tanza de acero',
    'tanza elastica'
];

const medidas = [ '30', '40', '50', '60', '70', '80', '90', '100' ];

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
                type: DataTypes.JSON,
                defaultValue: () =>
                    Array.from( { length: 5 }, () => ( {
                        url: 'https://res.cloudinary.com/violetastore/image/upload/v1755013343/mbg8rgsm0ysgikiwaoko.png',
                        public_id: 'mbg8rgsm0ysgikiwaoko' } ) )
            },
            category:
            {
                type: DataTypes.ENUM( ...categories ),
                defaultValue: 'otros'
            },
            material:
            {
                type: DataTypes.ENUM( ...materials ),
                defaultValue: 'acero quirurgico'
            },
            medidas:
            {
                type: DataTypes.ENUM( ...medidas ),
                allowNull: true
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