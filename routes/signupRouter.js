const router = require('express').Router();
const { body } = require('express-validator');
const signupController = require('../controllers/signupController');

const userPreSignupValidator = [
    body('fullname').notEmpty(),
    body('mobile.countryCode').notEmpty(),
    body('mobile.number').custom(val => (val) => /^[6-9]{1}[0-9]{9}$/.test(val)),
    body('password').isLength({ min: 6 })
];

const userSignupValidator = [
    body('otp').isLength({ min: 6, max: 6 }),
    body('id').notEmpty()
];

const userResendOtpValidator = [
    body('id').notEmpty()
];




router.post('/presignup/user', userPreSignupValidator, signupController.preSignupUser);

router.post('/user', userSignupValidator, signupController.signupUser);

router.post('/resendOtp/user', userResendOtpValidator, signupController.resendUserOTP);




module.exports = router;
