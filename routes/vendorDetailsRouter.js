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



router.get('/', verifyAccessJwt, verifyVendor, vendorDetailsController.getVendorDetails);

router.get('/companyName/status', verifyAccessJwt, verifyVendor, companyNameQueryValidator, vendorDetailsController.isCompanyNameAvailable);

router.post('/', verifyAccessJwt, verifyVendor, companyNameValidator, vendorDetailsController.createVendorRecord);

router.get('/storeName/status', verifyAccessJwt, verifyVendor, storeNameQueryValidator, vendorDetailsController.isStoreNameAvailable);

router.put('/storeName', verifyAccessJwt, verifyVendor, storeNameValidator, vendorDetailsController.updateStoreName);

router.put('/companyAddress', verifyAccessJwt, verifyVendor, companyAddressValidator, vendorDetailsController.updateCompanyAddress);






module.exports = router;
