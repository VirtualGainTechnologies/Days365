const router = require('express').Router();
const { body } = require('express-validator');
const promoterController = require('../controllers/promoterController');
const { verifyUser, verifyAccessJwt, verifyVendor, verifyAdmin, verifySuperAdmin,verifyPromoter } = require('../middleware');

const promoCodeValidator = [
    body('promoterName').trim().notEmpty(),
    body('sellerName').trim().notEmpty(),
    body('brandName').trim().notEmpty(),
];

router.get('/getPromoterListOnAdmin',verifyAccessJwt,verifyAdmin, promoterController.getPromoterList);

router.get('/getPromoterList',verifyAccessJwt,verifyPromoter, promoterController.getPromoterList);

router.put('/saveBankDetails',verifyAccessJwt,verifyPromoter, promoterController.saveBankDetails);

router.post('/generatePromocode',verifyAccessJwt, promoCodeValidator, promoterController.generatePromocode);

router.get('/getPromoCodeList',verifyAccessJwt, promoterController.getPromoCodeList);

router.get('/getSellerList',verifyAccessJwt,verifyAdmin, promoterController.getSellerList);

module.exports = router;