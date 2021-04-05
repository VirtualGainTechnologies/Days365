const router = require('express').Router();
const { body } = require('express-validator');
const signinController = require('../controllers/signinController');



const signinValidator = [
    body('type').custom(val => val === "EMAIL" || val === "MOBILE"),
    body('value').notEmpty(),
    body('password').isLength({ min: 6, max: 50 })
];


const adminSigninValidator = [
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 50 })
];


// USER & VENDOR


router.get('/user/:loginCredential', signinController.preSigninUser);

router.post('/user', signinValidator, signinController.signinUser);



// ADMIN

router.post('/admin', adminSigninValidator, signinController.signinAdmin);



module.exports = router;
