const {Router} = require('express');
const fillUp = require('../handlers/init/fillUp');
const logAdmin = require('../handlers/adminHandlers/logAdmin');
const adminRouter = Router();

adminRouter.post('/init', fillUp );
adminRouter.post('/login', logAdmin );

module.exports = adminRouter;