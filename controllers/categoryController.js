const { validationResult } = require('express-validator');
const { ErrorBody } = require('../utils/ErrorBody');
const categoryService = require('../services/categoryService');
const mongoose = require('mongoose');






/**
 *  Add root category
 */


exports.addRootCategory = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            let reqBody = {
                category_name: "Departments",
                is_leaf: false
            }
            await categoryService.createCategory(reqBody);
            var response = { message: 'Root successfully created.', error: false, data: {} };
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}


/**
 *  Add a new category
 */

exports.addCategory = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            let imageLocation = req.file ? req.file.location : null;
            let categoryName = req.body.categoryName;
            let parentId = req.body.parentId;
            let isRestricted = req.body.isRestricted;
            let isLeaf = req.body.isLeaf;
            var parentCategory;
            let reqBody = {
                category_name: categoryName,
                is_restricted: isRestricted,
                is_leaf: isLeaf
            }
            if (imageLocation) {
                reqBody['image_URL'] = imageLocation;
            }
            if (await categoryService.getCategoryWithFilters({ category_name: categoryName }, null, { collation: { locale: 'en', strength: 2 } })) {
                let response = { message: 'Category already exists.', error: true, data: {} };
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json(response);
            }
            if (parentId) {
                let id = mongoose.Types.ObjectId(parentId);
                parentCategory = await categoryService.getCategory(id);
                if (!parentCategory || parentCategory.is_leaf) {
                    return next(new ErrorBody(400, "Bad Inputs", []));
                }
            }
            else {
                let filters = {
                    category_name: 'Departments'
                }
                parentCategory = await categoryService.getCategoryWithFilters(filters)
                if (!parentCategory) {
                    return next({});
                }
            }
            reqBody['parent'] = parentCategory;
            const result = await categoryService.createCategory(reqBody);
            if (parentId) {
                try {
                    let id = mongoose.Types.ObjectId(parentId);
                    let updateQuery = {
                        is_leaf: false
                    }
                    await categoryService.updateCategory(id, updateQuery);
                } catch (error) {
                    await categoryService.deleteCategory(result._id);
                    return next({});
                }
            }
            var response = { message: 'Category successfully created.', error: false, data: {} };
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        console.log(error);
        next({});
    }
}



/**
 * Get top level categories categories
 */

exports.getMainCategories = async (req, res, next) => {
    try {
        let filters = {
            category_name: 'Departments'
        }
        const root = await categoryService.getCategoryWithFilters(filters);
        if (!root) {
            return next({});
        }
        let projection = {
            _id: 1,
            category_name: 1,
            is_leaf: 1,
            is_restricted: 1,
            image_URL: 1,
            createdAt: 1
        }
        let options = {
            lean: true
        }
        const result = await root.getImmediateChildren({}, projection, options);
        var response = { message: 'Successfully retrieved root categories.', error: false, data: { categories: result } };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    } catch (error) {
        next({});
    }
}


/**
 * Get all categories
 */

exports.getCategories = async (req, res, next) => {
    try {
        let filters = {};
        let options = {
            lean: true
        }
        const result = await categoryService.getCategories(filters, null, options);
        var response = { message: 'Successfully retrieved categories.', error: false, data: { categories: result } };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    } catch (error) {
        next({});
    }
}


/**
 *  Get a category record
 */

exports.getCategory = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            let id = mongoose.Types.ObjectId(req.query.id);
            let projection = {
                _id: 1,
                category_name: 1,
                is_leaf: 1,
                parent: 1,
                is_restricted: 1,
                image_URL: 1,
                createdAt: 1
            }
            let options = {
                lean: true
            }
            const result = await categoryService.getCategory(id, projection, options);
            var response = { message: 'No record found.', error: true, data: {} };
            if (result) {
                response = { message: 'Successfully retrieved category.', error: false, data: { category: result } };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}


/**
 * Get sub categories
 */

exports.getSubCategories = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var parentCategory;
            var id = req.query.id;
            if (id) {
                let parentId = mongoose.Types.ObjectId(req.query.id);
                parentCategory = await categoryService.getCategory(parentId);
                if (!parentCategory) {
                    return next(new ErrorBody(400, "Bad Inputs", []));
                }
            }
            else {
                let filters = {
                    category_name: 'Departments'
                }
                parentCategory = await categoryService.getCategoryWithFilters(filters);
                if (!parentCategory) {
                    return next({});
                }
            }
            let projection = {
                _id: 1,
                category_name: 1,
                is_leaf: 1,
                is_restricted: 1,
                image_URL: 1,
                createdAt: 1
            }
            let options = {
                lean: true
            }
            const result = await parentCategory.getImmediateChildren({}, projection, options);
            let payload = {
                parent: {
                    id: parentCategory._id,
                    name: parentCategory.category_name
                },
                categories: result
            }
            var response = { message: 'Successfully retrieved sub categories.', error: false, data: payload };
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);

        }
    } catch (error) {
        next({});
    }
}