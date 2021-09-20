const router = require('express').Router();
const checkoutController = require('../controllers/checkoutCtrl');
const { verifyAccessJwt, verifyAdmin, verifyUser,verifyVendor } = require('../middleware');

router.post('/checkout-payment', verifyAccessJwt,verifyUser,checkoutController.checkout);

module.exports = router;