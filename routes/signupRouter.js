const router = require('express').Router();
const { body } = require('express-validator');
const signupController = require('../controllers/signupController');
const { verifyUser, verifyAccessJwt } = require('../middleware');

const preSignupValidator = [
    body('fullname').notEmpty(),
    body('mobile.countryCode').notEmpty(),
    body('mobile.number').custom(val => (val) => /^[6-9]{1}[0-9]{9}$/.test(val)),
    body('password').isLength({ min: 6, max: 50 }),
    body('userType').custom(val => val === "user" || val === "vendor")
];

const signupValidator = [
    body('otp').isLength({ min: 6, max: 6 }),
    body('id').notEmpty()
];

const resendOtpValidator = [
    body('id').notEmpty()
];


const adminSignupValidator = [
    body('fullname').notEmpty(),
    body('mobile').custom(val => (val) => /^[6-9]{1}[0-9]{9}$/.test(val)),
    body('password').isLength({ min: 6, max: 50 }),
    body('email').isEmail(),
    body('username').notEmpty()
];


const upgradeValidator = [
    body('type').custom(val => val === "EMAIL" || val === "MOBILE"),
    body('value').notEmpty(),
    body('password').isLength({ min: 6, max: 50 })
];


//USER && VENDOR

router.post('/user/presignup', preSignupValidator, signupController.preSignupUser);

router.post('/user', signupValidator, signupController.signupUser);

router.post('/user/resendOtp', resendOtpValidator, signupController.resendUserOTP);

router.put('/user/upgrade', upgradeValidator, signupController.upgradeToVendor);

//ADMIN

router.post('/admin', adminSignupValidator, signupController.signupAdmin);








module.exports = router;