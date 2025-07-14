const {Router} = require('express');
const createPreference = require('../handlers/checkoutHandlers/createPreference');
const webHook = require('../handlers/checkoutHandlers/webHook');
const checkoutRouter = Router();

checkoutRouter.post('/', createPreference );
checkoutRouter.post('/hook', webHook );

module.exports = checkoutRouter;