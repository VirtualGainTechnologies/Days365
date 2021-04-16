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

// Use for creating root
// router.post('/root', categoryController.addRootCategory); 

router.post('/', verifyAccessJwt, verifyAdmin, categoryValidator, categoryController.addCategory);

router.get('/', verifyAccessJwt, verifyAdmin, getCategoryValidator, categoryController.getCategory);

router.get('/all', verifyAccessJwt, verifyAdmin, categoryController.getCategories);

router.get('/main', categoryController.getMainCategories);

router.get('/subCategories', getCategoryValidator, categoryController.getSubCategories);







module.exports = router;