const {Router} = require('express');
const checkToken = require('../middleware/checkToken');
const { getBanners, getBannerById } = require('../handlers/bannerHandlers/getBanners');
const postBanner = require('../handlers/bannerHandlers/postBanner');
const updateBanner = require('../handlers/bannerHandlers/updateBanner');
const deleteBanner = require('../handlers/bannerHandlers/deleteBanner');

const bannerRouter = Router();

bannerRouter.get( '/:id', getBannerById );
bannerRouter.get( '/', getBanners );

bannerRouter.use( checkToken );

bannerRouter.post( '/', postBanner );
bannerRouter.patch( '/:id', updateBanner );
bannerRouter.delete( '/:id', deleteBanner );

module.exports = bannerRouter;