const router = require('express').Router();
const { body, query } = require('express-validator');
const vendorDetailsController = require('../controllers/vendorDetailsController');
const { verifyAccessJwt, verifyVendor, verifyAdmin } = require('../middleware');
const { privateFileUpload } = require('../utils/fileUpload');

const storeNameQueryValidator = [
    query('storeName').trim().notEmpty()
];

const storeNameValidator = [
    body('storeName').trim().notEmpty()
];

const companyAddressValidator = [
    body('state').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('pincode').custom(val => /^[1-9][0-9]{5}$/.test(val))
];

const companyNameQueryValidator = [
    query('companyName').trim().notEmpty()
];

const companyNameValidator = [
    body('companyName').trim().notEmpty()
];

const taxDetailsValidator = [
    body('state').trim().notEmpty(),
    body('sellerName').trim().notEmpty(),
    body('gstNumber').custom(val => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val)),
    body('panNumber').custom(val => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val))
];

const sellerDetailsValidator = [
    body('storeName').trim().notEmpty(),
    body('state').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('pincode').custom(val => /^[1-9][0-9]{5}$/.test(val)),
    body('shippingMethod').trim().custom(val => ["Fulfillment by Days365"].includes(val))
];

const shippingFeeValidator = [
    body('shippingFee').custom(val => val >= 0)
];

const bankDetailsValidator = [
    body('accountHolderName').trim().notEmpty(),
    body('accountType').trim().custom(val => ["Savings Account", "Current Account"].includes(val)),
    body('accountNumber').trim().custom(val => /^[0-9]{9,18}$/.test(val)),
    body('ifscCode').trim().optional({ checkFalsy: true }).custom(val => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val))
];

const productTaxCodeValidator = [
    body('productTaxCode').trim().isIn(['A_GEN_EXEMPT', 'A_GEN_MINIMUM', 'A_GEN_SUPERREDUCED', 'A_GEN_REDUCED',
        'A_GEN_STANDARD', 'A_GEN_PEAK', 'A_GEN_PEAK_CESS12', 'A_GEN_PEAK_CESS60', 'A_GEN_JEWELLERY'])
];

const gstExemptedValidator = [
    body('isGstExempted').isBoolean()
];

const sellerFileValidator = [
    body('docName').trim().custom(val => ['foodLicense', 'gstLicense', 'shopLicense', 'blankCheque'].includes(val))
];

const sellerFileQueryValidator = [
    query('docName').trim().custom(val => ['foodLicense', 'gstLicense', 'shopLicense', 'blankCheque'].includes(val))
];

const approveVendorValidator = [
    body('vendorId').trim().notEmpty()
];

const vendorBrandRequestBodyValidator = [
    body('brandName').trim().notEmpty()
];

const addProductCategoryCheck = [
    body('ProductCategoryId').isArray({ min: 1 })
]




router.get('/', verifyAccessJwt, verifyVendor, vendorDetailsController.getVendorDetails);

router.get('/companyName/status', verifyAccessJwt, verifyVendor, companyNameQueryValidator, vendorDetailsController.isCompanyNameAvailable);

router.post('/', verifyAccessJwt, verifyVendor, companyNameValidator, vendorDetailsController.createVendorRecord);

router.get('/storeName/status', verifyAccessJwt, verifyVendor, storeNameQueryValidator, vendorDetailsController.isStoreNameAvailable);

router.put('/storeName', verifyAccessJwt, verifyVendor, storeNameValidator, vendorDetailsController.updateStoreName);

router.put('/companyAddress', verifyAccessJwt, verifyVendor, companyAddressValidator, vendorDetailsController.updateCompanyAddress);

router.put('/taxDetails', verifyAccessJwt, verifyVendor, taxDetailsValidator, vendorDetailsController.updateTaxDetails);

router.put('/taxDetails/gstExempted', verifyAccessJwt, verifyVendor, gstExemptedValidator, vendorDetailsController.updateGstExemptedStatus);

router.put('/sellerInfo', verifyAccessJwt, verifyVendor, sellerDetailsValidator, vendorDetailsController.updateSellerInfo);

router.put('/shippingFee', verifyAccessJwt, verifyVendor, shippingFeeValidator, vendorDetailsController.updateShippingFee);

router.put('/bankDetails', verifyAccessJwt, verifyVendor, bankDetailsValidator, vendorDetailsController.updateBankDetails);

router.put('/productTaxCode', verifyAccessJwt, verifyVendor, productTaxCodeValidator, vendorDetailsController.updateProductTaxCode);

router.put('/signature', verifyAccessJwt, verifyVendor, privateFileUpload.single('signature'), vendorDetailsController.updateSignature);

router.get('/signature', verifyAccessJwt, verifyVendor, vendorDetailsController.getMySignature);

router.put('/sellerFile', verifyAccessJwt, verifyVendor, privateFileUpload.single('sellerFile'), sellerFileValidator, vendorDetailsController.updateSellerFile);

router.get('/sellerFile', verifyAccessJwt, verifyVendor, sellerFileQueryValidator, vendorDetailsController.getMyFile);

router.put('/request/approveAccount', verifyAccessJwt, verifyVendor, vendorDetailsController.requestAdminApproval);

router.put('/approve/account', verifyAccessJwt, verifyAdmin, approveVendorValidator, vendorDetailsController.approveVendor);

router.put('/request/approveBrand', verifyAccessJwt, verifyVendor, privateFileUpload.array('brandImages', 5), vendorBrandRequestBodyValidator, vendorDetailsController.requestBrandApproval);

router.put('/approve/brand', verifyAccessJwt, verifyAdmin, approveVendorValidator, vendorDetailsController.approveVendorBrand);

router.put('/addProductCategory', verifyAccessJwt, verifyVendor,addProductCategoryCheck, vendorDetailsController.updateProductCategory);

router.get('/getSellerData',verifyAccessJwt,verifyAdmin,vendorDetailsController.getSellerData);

module.exports = router;
