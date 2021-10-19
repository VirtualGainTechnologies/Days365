const router = require('express').Router();
const checkoutController = require('../controllers/checkoutCtrl');
const { verifyAccessJwt, verifyAdmin, verifyUser,verifyVendor } = require('../middleware');

router.post('/checkout-payment', verifyAccessJwt,verifyUser,checkoutController.checkout);
 router.post("/ccavResponseHandler",checkoutController.doneCheckout)
router.get("/get-orders", verifyAccessJwt,verifyUser,checkoutController.getOrders)
router.post("/get-order-detail", verifyAccessJwt,verifyUser,checkoutController.orderDetails)
router.post("/check-delivery-point", checkoutController.checkDelivery );
router.post('/get-delivery-status',checkoutController.getTackingStatus);
// router.post('/checkout-payment',checkoutController.checkout);


module.exports = router;