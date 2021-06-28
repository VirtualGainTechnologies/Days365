const router = require('express').Router();
const { body, query, check } = require('express-validator');
const { verifyAccessJwt, verifyAdmin, verifyVendor } = require('../middleware');
const { publicFileUpload } = require('../utils/fileUpload');
const brandController = require('../controllers/brandController');


const productBodyValidator = [
    body('brandName').trim().notEmpty(),
    body('registrationNo').trim().notEmpty(),
    body('brandWebsite').trim().notEmpty(),
    body('categoryId').trim().notEmpty()
];
  

router.post('/register', productBodyValidator, publicFileUpload.single('image'), brandController.addBrand);

//router for admin to get all pending verificattion brands
router.post('/getBrands', brandController.getBrands)

//router to change status Pending to Approved
router.get('/status', brandController.changeStatus)

//sample file upload router
router.post('/fileUpload', publicFileUpload.single('image'), brandController.uploadFile)

module.exports = router;
//comment here


