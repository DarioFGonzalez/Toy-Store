require('dotenv').config();
const { initializeLockerManager } = require('./src/services/PudoLockerManager');
const server = require('./src/server');
const { conn } = require('./src/db/db');
const { PORT } = process.env;

conn.sync( { force: false } )
.then( () => { return initializeLockerManager() } )
.then( () =>
{
    server.listen( PORT, () => { console.log( `server levantado en puerto ${PORT}` ) } );
})
.catch( ( err ) =>
{
    console.error(`Error index.js: ${err}`);
});