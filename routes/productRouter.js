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
    body('searchTerms').trim().notEmpty(),
    // body('productVariants').isArray({ min: 1 }),
    // body('fileIndex').isArray({ min: 1 })
];


const productReferValidator = [
    body('productId').trim().notEmpty(),
    body('productVariants').isArray({ min: 1 }),
    body('fileIndex').isArray({ min: 1 })
];

const queryProductValidator = [
    query('id').trim().notEmpty()
];

const taxCodeValidator = [
    body('categoryName').trim().notEmpty(),
    body('categoryId').trim().notEmpty(),
    body('taxCode').trim().notEmpty(),
];



// API's


router.post('/', publicFileUpload.array('productImages', 9), productBodyValidator, productController.addProduct);

router.post('/reference', verifyAccessJwt, verifyVendor, publicFileUpload.array('productImages', 9), productReferValidator, productController.addProductByReference);

router.get('/', queryProductValidator, productController.getActiveProductById);

router.get('/sellers', queryProductValidator, productController.getProductSellers);

router.get('/getAllProductList', productController.getAllProductList);

router.put('/changeProductStatus', verifyAccessJwt, productController.changeProductStatus);

router.post('/addProductTaxCode', verifyAccessJwt, taxCodeValidator, productController.addProductTaxCode);

router.post('/getAllProductTaxCodeList', verifyAccessJwt, productController.getAllProductTaxCodeList);

// Search Product by UPC / ISBN / EAN 
router.post('/search', productController.search);

module.exports = router;