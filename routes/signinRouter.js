const router = require('express').Router();
const { body } = require('express-validator');
const signinController = require('../controllers/signinController');



const signinValidator = [
    body('type').trim().custom(val => val === "EMAIL" || val === "MOBILE"),
    body('value').trim().notEmpty(),
    body('password').trim().isLength({ min: 6, max: 50 })
];


const adminSigninValidator = [
    body('email').trim().isEmail(),
    body('password').trim().isLength({ min: 6, max: 50 })
];


// USER & VENDOR


router.get('/user/:loginCredential', signinController.preSigninUser);

router.post('/user', signinController.signinUser);



// ADMIN

router.post('/admin', adminSigninValidator, signinController.signinAdmin);



module.exports = router;
