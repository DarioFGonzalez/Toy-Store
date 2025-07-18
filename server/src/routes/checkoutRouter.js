const {Router} = require('express');
const createPreference = require('../handlers/checkoutHandlers/createPreference');
const webHook = require('../handlers/checkoutHandlers/webHook');
const checkMpPreference = require('../handlers/checkoutHandlers/checkMpPreference');
const checkoutRouter = Router();

checkoutRouter.get( '/:id', checkMpPreference );
checkoutRouter.post('/', createPreference );
checkoutRouter.post('/hook', webHook );

module.exports = checkoutRouter;