const {Router} = require('express');
const fillUp = require('../handlers/init/fillUp');
const logAdmin = require('../handlers/adminHandlers/logAdmin');
const checkToken = require('../middleware/checkToken');
const adminRouter = Router();

adminRouter.post('/login', logAdmin );

adminRouter.use( checkToken );

adminRouter.post('/init', fillUp );

module.exports = adminRouter;