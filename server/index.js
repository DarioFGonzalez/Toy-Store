require('dotenv').config();
const server = require('./src/server');
const { conn } = require('./src/db/db');
const { PORT } = process.env;

conn.sync( {force: true} ).then( () =>
{
    server.listen( PORT, () => { console.log( `server levantado en puerto ${PORT}` ) } );
})
.catch( ( err ) =>
{
    console.error(`Error index.js: ${err}`);
});