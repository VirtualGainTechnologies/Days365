const router = require('express').Router();
const { body } = require('express-validator');
const vendorDetailsController = require('../controllers/vendorDetailsController');
const { verifyAccessJwt, verifyVendor } = require('../middleware');





router.get('/status', verifyAccessJwt, verifyVendor)



module.exports = router;
