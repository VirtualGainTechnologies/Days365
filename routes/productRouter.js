const router = require('express').Router();
const { body, query, check } = require('express-validator');
const { verifyAccessJwt, verifyAdmin, verifyVendor } = require('../middleware');
const { publicFileUpload } = require('../utils/fileUpload');
const productController = require('../controllers/productController');


// Validators

const productBodyValidator = [
    body('title').notEmpty(),
    body('categoryId').notEmpty(),
    body('brandName').notEmpty(),
    body('searchTerms').notEmpty()  
];
 // body('docName').trim().custom(val => ['frontImg', 'expiryDateImg', 'importerMRPImg', 'productSealImg','productImg1','productImg2','productImg3','productImg4'].includes(val))

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

router.post('/addNewProduct', verifyAccessJwt, verifyVendor, productBodyValidator, productController.addProduct);

router.post('/reference', verifyAccessJwt, verifyVendor, publicFileUpload.array('productImages', 9), productReferValidator, productController.addProductByReference);

router.get('/', queryProductValidator, productController.getActiveProductById);

router.get('/sellers', queryProductValidator, productController.getProductSellers);

router.get('/getAllProductList',verifyAccessJwt, productController.getAllProductList);

router.put('/changeProductStatus', verifyAccessJwt,productController.changeProductStatus);

router.post('/addProductTaxCode', verifyAccessJwt,taxCodeValidator,productController.addProductTaxCode);

router.post('/getAllProductTaxCodeList',verifyAccessJwt, productController.getAllProductTaxCodeList);

router.post('/addExistingProduct',verifyAccessJwt, verifyVendor,publicFileUpload.single('front_Img'),productController.addExistingProduct);

router.get('/getProductSellerWise',verifyAccessJwt, verifyVendor, productController.getProductSellerWise);

router.put('/addProductVarient', productController.addProductVarient);


module.exports = router;
