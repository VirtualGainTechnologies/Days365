const router = require('express').Router();
const signoutController = require('../controllers/signoutController');
const { body } = require('express-validator');
const { verifyAccessJwt, verifyRefreshJwt, verifyUser } = require('../middleware');


const userSignoutValidator = [
    body('refreshToken').notEmpty()
];



router.post('/user', verifyRefreshJwt, verifyUser, userSignoutValidator, signoutController.signoutUser);


module.exports = router;
