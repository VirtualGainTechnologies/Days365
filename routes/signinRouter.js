const router = require('express').Router();
const { body } = require('express-validator');
const signinController = require('../controllers/signinController');



const userSigninValidator = [
    body('type').custom(val => val === "EMAIL" || val === "MOBILE"),
    body('value').notEmpty(),
    body('password').isLength({ min: 6, max: 50 })
];

const vendorSigninValidator = [
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 50 })
];

const adminSigninValidator = [
    body('username').notEmpty(),
    body('password').isLength({ min: 6, max: 50 })
];


router.get('/user/:loginCredential', signinController.preSigninUser);


router.post('/user', userSigninValidator, signinController.signinUser);


router.post('/vendor', vendorSigninValidator, signinController.signinVendor);


router.post('/admin', adminSigninValidator, signinController.signinAdmin);



module.exports = router;
