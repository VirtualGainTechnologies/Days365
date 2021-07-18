/*********************************
CORE PACKAGES
**********************************/
const router = require('express').Router();
const { body, query, check } = require('express-validator');

/*********************************
MODULE PACKAGES
**********************************/
const { verifyAccessJwt, verifyAdmin, verifyVendor } = require('../middleware');
const { publicFileUpload } = require('../utils/fileUpload');
const productForSellController = require('../controllers/productForSellController');

/*********************************
 API Routes
**********************************/

router.post('/getProducts', productForSellController.getProducts);

router.get('/getFiltersList',productForSellController.getFiltersList);

router.post('/getProductVariants', productForSellController.getProductVariants);

router.post('/getProductSizeVariants',productForSellController.getProductSizeVariants);

module.exports = router;