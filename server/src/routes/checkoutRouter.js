const {Router} = require('express');
const createPreference = require('../handlers/checkoutHandlers/createPreference');
const webHook = require('../handlers/checkoutHandlers/webHook');
const mpMiddleware = require('../middleware/mpMiddleware');
const checkoutRouter = Router();

checkoutRouter.post('/', createPreference );
checkoutRouter.post('/hook', mpMiddleware, webHook );

module.exports = checkoutRouter;