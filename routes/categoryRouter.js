const router = require('express').Router();
const { body, query } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const { verifyAdmin, verifyAccessJwt, verifyRefreshJwt, verifyVendor, verifySuperAdmin } = require('../middleware');


const categoryValidator = [
    body('categoryName').notEmpty()
];

const getCategoryValidator = [
    query('id').notEmpty()
];



router.post('/', verifyAccessJwt, verifyAdmin, categoryValidator, categoryController.addCategory);

router.get('/', verifyAccessJwt, verifyAdmin, getCategoryValidator, categoryController.getCategory);

router.get('/all', verifyAccessJwt, verifyAdmin, categoryController.getCategories);

router.get('/parent', categoryController.getParentCategories);

router.get('/subCategories', getCategoryValidator, categoryController.getSubCategories);







module.exports = router;