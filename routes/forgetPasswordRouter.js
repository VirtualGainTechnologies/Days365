const router = require('express').Router();
const forgetPasswordController = require('../controllers/forgetPasswordController');
const { body } = require('express-validator');



const userAccountValidator = [
    body('type').custom(val => val === "EMAIL" || val === "MOBILE"),
    body('value').notEmpty()
];

const vendorAccountValidator = [
    body('email').isEmail()
];

const otpValidator = [
    body('id').notEmpty(),
    body('otp').isLength({ min: 6, max: 6 })
];

const resetPasswordValidator = [
    body('id').notEmpty(),
    body('password').isLength({ min: 6, max: 50 })
];



// USER

router.post('/user/sendOTP', userAccountValidator, forgetPasswordController.sendUserOTP);


router.post('/user/verifyOTP', otpValidator, forgetPasswordController.verifyUserOTP);


router.post('/user/resetPassword', resetPasswordValidator, forgetPasswordController.resetUserPassword);



// VENDOR

router.post('/vendor/sendOTP', vendorAccountValidator, forgetPasswordController.sendVendorOTP);


router.post('/vendor/verifyOTP', otpValidator, forgetPasswordController.verifyVendorOTP);


router.post('/vendor/resetPassword', resetPasswordValidator, forgetPasswordController.resetVendorPassword);




module.exports = router;
