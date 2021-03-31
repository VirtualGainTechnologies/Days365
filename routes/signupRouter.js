const router = require('express').Router();
const { body } = require('express-validator');
const signupController = require('../controllers/signupController');

const userPreSignupValidator = [
    body('fullname').notEmpty(),
    body('mobile.countryCode').notEmpty(),
    body('mobile.number').custom(val => (val) => /^[6-9]{1}[0-9]{9}$/.test(val)),
    body('password').isLength({ min: 6, max: 50 })
];

const signupValidator = [
    body('otp').isLength({ min: 6, max: 6 }),
    body('id').notEmpty()
];

const resendOtpValidator = [
    body('id').notEmpty()
];


const vendorPreSignupValidator = [
    body('fullname').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 50 })
];



const adminSignupValidator = [
    body('fullname').notEmpty(),
    body('mobile').custom(val => (val) => /^[6-9]{1}[0-9]{9}$/.test(val)),
    body('password').isLength({ min: 6, max: 50 }),
    body('email').isEmail(),
    body('username').notEmpty()
];


//USER

router.post('/user/presignup', userPreSignupValidator, signupController.preSignupUser);

router.post('/user', signupValidator, signupController.signupUser);

router.post('/user/resendOtp', resendOtpValidator, signupController.resendUserOTP);


//VENDOR

router.post('/vendor/presignup', vendorPreSignupValidator, signupController.preSignupVendor);

router.post('/vendor', signupValidator, signupController.signupVendor);

router.post('/vendor/resendOtp', resendOtpValidator, signupController.resendVendorOTP);



//ADMIN

router.post('/admin', adminSignupValidator, signupController.signupAdmin);








module.exports = router;
