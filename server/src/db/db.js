const {Sequelize} = require('sequelize');
const productModel = require('../models/products');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/violetadb`, { logging: false, native: false } );

sequelize.authenticate()
.then( ()=>
{
    console.log('Conexión a DB exitosa');
})
.catch( ( err ) =>
{
    console.error(`Error al conectar con DB: ${err}`);
});

productModel(sequelize);

const { Products } = sequelize.models;

module.exports = { ...sequelize.models, conn: sequelize };