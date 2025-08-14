const {Sequelize} = require('sequelize');
const productModel = require('../models/products.js');
const cartModel = require('../models/Carts.js');
const cartItemModel = require('../models/CartItem.js');
const bannerModel = require('../models/Banners.js');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const isProduction = process.env.NODE_ENV === 'production' || DB_HOST !== 'localhost';
let sequelize;

if (isProduction) {
    sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        native: false,
    });
} else {
    sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
        logging: false,
        native: false,
    });
}

sequelize.authenticate()
.then( ()=>
{
    console.log('Conexión a DB exitosa');
})
.catch( ( err ) =>
{
    console.error(`Error al conectar con DB: ${err}`);
});

//Levantando modelos
productModel(sequelize);
cartModel(sequelize);
cartItemModel(sequelize);
bannerModel(sequelize);

const { Products, Carts, CartItem, Banners } = sequelize.models;

//Tabla intermedio
Products.hasMany( CartItem, { foreignKey: 'productId', as: 'cartItems' } );
CartItem.belongsTo( Products, { foreignKey: 'productId', as: 'product' } );

Carts.hasMany( CartItem, { foreignKey: 'cartId', as: 'cartItems', onDelete: 'CASCADE' } );
CartItem.belongsTo( Carts, { foreignKey: 'cartId', as: 'cart' } );

//Principales
Products.belongsToMany( Carts,
    {
        through: CartItem,
        foreignKey: 'productId',
        otherKey: 'cartId',
        as: 'carts'
    } );

Carts.belongsToMany( Products,
    {
        through: CartItem,
        foreignKey: 'cartId',
        otherKey: 'productId',
        as: 'products'
    } );

module.exports = { ...sequelize.models, conn: sequelize };