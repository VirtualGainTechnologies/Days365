const router = require('express').Router();
const { body } = require('express-validator');
const signinController = require('../controllers/signinController');



const userSigninValidator = [
    body('type').custom(val => val === "EMAIL" || val === "MOBILE"),
    body('value').notEmpty(),
    body('password').notEmpty()
];


router.get('/user/:loginCredential', signinController.preSigninUser);


router.post('/user', userSigninValidator, signinController.signinUser);




module.exports = router;
