const router = require('express').Router();
const { body, query } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const { verifyAdmin, verifyAccessJwt, verifyRefreshJwt, verifyVendor, verifySuperAdmin } = require('../middleware');


const categoryValidator = [
    body('categoryName').trim().notEmpty(),
    body('is_restricted').isBoolean()
];

const getCategoryValidator = [
    query('id').trim().optional({ checkFalsy: true })
];

// Use for creating root
// router.post('/root', categoryController.addRootCategory); 

router.post('/', categoryValidator, categoryController.addCategory);

router.get('/', verifyAccessJwt, verifyAdmin, getCategoryValidator, categoryController.getCategory);

router.get('/all', verifyAccessJwt, verifyAdmin, categoryController.getCategories);

router.get('/main', categoryController.getMainCategories);

router.get('/subCategories', getCategoryValidator, categoryController.getSubCategories);







module.exports = router;