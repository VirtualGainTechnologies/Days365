const router = require('express').Router();
const checkoutController = require('../controllers/checkoutCtrl');
const { verifyAccessJwt, verifyAdmin, verifyUser,verifyVendor } = require('../middleware');

router.post('/checkout-payment', verifyAccessJwt,verifyUser,checkoutController.checkout);
router.post("/ccavResponseHandler",checkoutController.doneCheckout)
// router.post('/checkout-payment',checkoutController.checkout);


module.exports = router;