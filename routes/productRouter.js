const router = require('express').Router();
const { body, query, check } = require('express-validator');
const { verifyAccessJwt, verifyAdmin, verifyVendor } = require('../middleware');
const { publicFileUpload } = require('../utils/fileUpload');
const productController = require('../controllers/productController');


// Validators

const productBodyValidator = [
    body('title').trim().notEmpty(),
    body('categoryId').trim().notEmpty(),
    body('brandName').trim().notEmpty(),
    body('keyWords').trim().notEmpty(),
    body('productVariants').isArray({ min: 1 }),
    body('fileIndex').isArray({ min: 1 })
];


const productReferValidator = [
    body('productId').trim().notEmpty(),
    body('productVariants').isArray({ min: 1 }),
    body('fileIndex').isArray({ min: 1 })
];




// API's


router.post('/', verifyAccessJwt, verifyVendor, publicFileUpload.array('productImages', 100), productBodyValidator, productController.addProduct);

router.post('/reference', verifyAccessJwt, verifyVendor, publicFileUpload.array('productImages', 9), productReferValidator, productController.addProductByReference);







module.exports = router;