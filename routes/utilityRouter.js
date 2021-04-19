const router = require('express').Router();
const { body, query, check } = require('express-validator');
const { verifyAdmin, verifyAccessJwt, verifyRefreshJwt, verifyVendor, verifySuperAdmin } = require('../middleware');
const utilityController = require('../controllers/utilityController');


// Validators

const productTaxCodeValidator = [
    body('utilityName').notEmpty(),
    body('utilityData').isArray()
];

const utilityQueryValidator = [
    query('utilityName').notEmpty()
];





// API's

router.post('/productTaxCode', verifyAccessJwt, verifyAdmin, productTaxCodeValidator, utilityController.addProductTaxcodes);

router.get('/', utilityQueryValidator, utilityController.getUtilityDocument);


module.exports = router;