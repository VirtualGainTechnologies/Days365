const router = require('express').Router();
const { body, query, check } = require('express-validator');
const { verifyAccessJwt, verifyAdmin, verifyVendor } = require('../middleware');
const { publicFileUpload } = require('../utils/fileUpload');
const productController = require('../controllers/productController');


// Validators

const productBodyValidator = [
    body('title').notEmpty(),
    body('categoryId').notEmpty(),
    body('keyWords').notEmpty(),
    body('productVariants').isArray({ min: 1 }),
    body('fileIndex').isArray({ min: 1 })
];




// API's


router.post('/', verifyAccessJwt, verifyVendor, publicFileUpload.array('productImages', 100), productBodyValidator, productController.addProduct);






module.exports = router;