const router = require('express').Router();
const { body, query } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const { verifyAdmin, verifyAccessJwt, verifyRefreshJwt, verifyVendor, verifySuperAdmin } = require('../middleware');
const { publicFileUpload } = require('../utils/fileUpload');

const categoryValidator = [
    body('categoryName').trim().notEmpty(),
    body('isRestricted').isBoolean(),
    body('isLeaf').isBoolean()
];

const getCategoryValidator = [
    query('id').trim().optional({ checkFalsy: true })
];

// Use for creating root
router.post('/root', categoryController.addRootCategory); 

router.post('/', verifyAccessJwt, verifySuperAdmin, publicFileUpload.single('categoryImage'), categoryValidator, categoryController.addCategory);

router.get('/', verifyAccessJwt, verifyAdmin, getCategoryValidator, categoryController.getCategory);

router.get('/all', verifyAccessJwt, verifyAdmin, categoryController.getCategories);

router.get('/main', categoryController.getMainCategories);

router.get('/subCategories', getCategoryValidator, categoryController.getSubCategories);

router.post('/getCategoriesByName',verifyAccessJwt, categoryController.getCategoriesByName);

router.get('/getCategoriesBrowse',verifyAccessJwt,verifyVendor, categoryController.getCategoriesBrowse);

router.get('/getCategoriesBrowseUser', categoryController.getCategoriesBrowse);

module.exports = router;