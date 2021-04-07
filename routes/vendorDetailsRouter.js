const router = require('express').Router();
const { body, query } = require('express-validator');
const vendorDetailsController = require('../controllers/vendorDetailsController');
const { verifyAccessJwt, verifyVendor } = require('../middleware');


const storeNameQueryValidator = [
    query('storeName').notEmpty()
];

const storeNameValidator = [
    body('storeName').notEmpty()
];

const companyAddressValidator = [
    body('state').notEmpty(),
    body('city').notEmpty(),
    body('pincode').custom(val => /^[1-9][0-9]{5}$/.test(val))
];

const companyNameQueryValidator = [
    query('companyName').notEmpty()
];

const companyNameValidator = [
    body('companyName').notEmpty()
];

const taxDetailsValidator = [
    body('state').notEmpty(),
    body('sellerName').notEmpty(),
    body('gstNumber').notEmpty(),
    body('panNumber').notEmpty()
];

const sellerDetailsValidator = [
    body('storeName').notEmpty(),
    body('state').notEmpty(),
    body('city').notEmpty(),
    body('pincode').custom(val => /^[1-9][0-9]{5}$/.test(val)),
    body('shippingMethod').custom(val => ["Fulfillment by Days365"].includes(val))
];

const shippingFeeValidator = [
    body('shippingFee').custom(val => val >= 0)
];

const bankDetailsValidator = [
    body('accountHolderName').notEmpty(),
    body('accountType').custom(val => ["Savings Account", "Current Account"].includes(val)),
    body('accountNumber').notEmpty()
];

const productTaxCodeValidator = [
    body('productTaxCode').notEmpty()
];



router.get('/', verifyAccessJwt, verifyVendor, vendorDetailsController.getVendorDetails);

router.get('/companyName/status', verifyAccessJwt, verifyVendor, companyNameQueryValidator, vendorDetailsController.isCompanyNameAvailable);

router.post('/', verifyAccessJwt, verifyVendor, companyNameValidator, vendorDetailsController.createVendorRecord);

router.get('/storeName/status', verifyAccessJwt, verifyVendor, storeNameQueryValidator, vendorDetailsController.isStoreNameAvailable);

router.put('/storeName', verifyAccessJwt, verifyVendor, storeNameValidator, vendorDetailsController.updateStoreName);

router.put('/companyAddress', verifyAccessJwt, verifyVendor, companyAddressValidator, vendorDetailsController.updateCompanyAddress);

router.put('/taxDetails', verifyAccessJwt, verifyVendor, taxDetailsValidator, vendorDetailsController.updateTaxDetails);

router.put('/sellerDetails', verifyAccessJwt, verifyVendor, sellerDetailsValidator, vendorDetailsController.updateSellerInfo);

router.put('/shippingFee', verifyAccessJwt, verifyVendor, shippingFeeValidator, vendorDetailsController.updateShippingFee);

router.put('/bankDetails', verifyAccessJwt, verifyVendor, bankDetailsValidator, vendorDetailsController.updateBankDetails);

router.put('/productTaxCode', verifyAccessJwt, verifyVendor, productTaxCodeValidator, vendorDetailsController.updateProductTaxCode);

router.put('/signature'); // TODO file upload required.


module.exports = router;
