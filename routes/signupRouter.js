const router = require('express').Router();
const { body } = require('express-validator');
const signupController = require('../controllers/signupController');
const { verifyUser, verifyAccessJwt, verifyVendor, verifyAdmin, verifySuperAdmin } = require('../middleware');


const preSignupValidator = [
    body('fullname').trim().notEmpty(),
    body('mobile.countryCode').trim().notEmpty(),
    body('mobile.number').trim().custom(val => /^[6-9]{1}[0-9]{9}$/.test(val)),
    body('password').trim().isLength({ min: 6, max: 50 }),
    body('userType').trim().custom(val => val === "user" || val === "vendor")
];

const signupValidator = [
    body('otp').trim().isLength({ min: 6, max: 6 }),
    body('id').trim().notEmpty()
];

const resendOtpValidator = [
    body('id').trim().notEmpty()
];


const adminSignupValidator = [
    body('fullname').trim().notEmpty(),
    body('mobile').trim().custom(val => /^[6-9]{1}[0-9]{9}$/.test(val)),
    body('password').trim().isLength({ min: 6, max: 50 }),
    body('email').trim().isEmail(),
    body('username').trim().notEmpty()
];


const upgradeValidator = [
    body('username').trim().notEmpty(),
    body('password').trim().isLength({ min: 6, max: 50 })
];


//USER && VENDOR

router.post('/user/presignup', preSignupValidator, signupController.preSignupUser);

router.post('/user', signupValidator, signupController.signupUser);

router.post('/user/resendOtp', resendOtpValidator, signupController.resendUserOTP);

router.put('/user/upgrade', upgradeValidator, signupController.upgradeToVendor);

router.put('/user/directUpgrade', verifyAccessJwt, verifyUser, signupController.directUpgradeToVendor);



//ADMIN

router.post('/superAdmin/9fca617fb050e6f86cbe45fef67cbc37', adminSignupValidator, signupController.signupSuperAdmin);

router.post('/subAdmin', verifyAccessJwt, verifySuperAdmin, adminSignupValidator, signupController.signupAdmin);






module.exports = router;
