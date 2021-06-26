const router = require('express').Router();
const { body, query, check } = require('express-validator');
const { verifyAccessJwt, verifyAdmin, verifyVendor } = require('../middleware');
const { publicFileUpload } = require('../utils/fileUpload');
const productController = require('../controllers/productController');


// Validators

const productBodyValidator = [
    body('vitalInfo.title').notEmpty(),
    //body('vitalInfo.categoryId').notEmpty(),
    body('vitalInfo.brandName').notEmpty(),
    //body('vitalInfo.searchTerms').notEmpty()  
];
 // body('docName').trim().custom(val => ['frontImg', 'expiryDateImg', 'importerMRPImg', 'productSealImg','productImg1','productImg2','productImg3','productImg4'].includes(val))

const productReferValidator = [
    body('productId').trim().notEmpty(),
    body('productVariants').isArray({ min: 1 }),
    body('fileIndex').isArray({ min: 1 })
];

const productExistingValidator = [
    body('productId').trim().notEmpty(),
    body('title').trim().notEmpty(),
    body('yourPrice').trim().notEmpty()
];

const productVarientsValidator = [
    body('id').trim().notEmpty(),
    body('productVariant').isArray({ min: 1 }),
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

router.post('/getAllProductList',verifyAccessJwt, verifyAdmin , productController.getAllProductList);

router.post('/getAllProductOnSeller',verifyAccessJwt, verifyVendor , productController.getAllProductList);

router.put('/changeProductStatus', verifyAccessJwt,productController.changeProductStatus);

router.post('/addProductTaxCode', verifyAccessJwt,taxCodeValidator,productController.addProductTaxCode);

router.get('/getAllProductTaxCodeList',verifyAccessJwt, verifyVendor, productController.getAllProductTaxCodeList);

router.post('/addExistingProduct',verifyAccessJwt, verifyVendor,publicFileUpload.single('front_Img'),productExistingValidator,productController.addExistingProduct);

router.get('/getProductSellerWise',verifyAccessJwt, verifyVendor, productController.getProductSellerWise);

router.put('/addProductVarient',verifyAccessJwt,productVarientsValidator,publicFileUpload.array('expiryDate_Img'), productController.addProductVarient);

// router.get('/getFiltersList',productController.getFiltersList);
router.post('/searchProduct',verifyAccessJwt,verifyVendor, productController.searchProduct);

router.post('/getProducts',verifyAccessJwt, productController.getProducts);

router.get('/getProductVariant',verifyAccessJwt,verifyAdmin, productController.getProductVariant);

module.exports = router;
