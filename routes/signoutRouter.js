const router = require('express').Router();
const signoutController = require('../controllers/signoutController');
const { body } = require('express-validator');
const { verifyAccessJwt, verifyRefreshJwt, verifyUser, verifyAdmin, verifyVendor } = require('../middleware');


const signoutValidator = [
    body('refreshToken').trim().notEmpty()
];


//Signout from a single device.

router.post('/user', verifyRefreshJwt, verifyUser, signoutValidator, signoutController.signoutUser);

router.post('/admin', verifyRefreshJwt, verifyAdmin, signoutValidator, signoutController.signoutUser);





//Signout from all devices.

router.post('/user/all', verifyRefreshJwt, verifyUser, signoutValidator, signoutController.signoutFromAllDevices);



router.post('/admin/all', verifyRefreshJwt, verifyAdmin, signoutValidator, signoutController.signoutFromAllDevices);





module.exports = router;
