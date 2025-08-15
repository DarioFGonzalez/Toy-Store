const { DataTypes } = require('sequelize');

const categories = [ 'descuentos', 'tematico', 'anuncios', 'otros' ];

module.exports = ( sequelize ) =>
{
    sequelize.define( "Banners",
    {
        id:
        {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        active:
        {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        imageUrl:
        {
            type: DataTypes.JSON,
            allowNull: false
        },
        category:
        {
            type: DataTypes.ENUM( ...categories ),
            defaultValue: 'otros'
        }
    }, { timestamps: false } )
}