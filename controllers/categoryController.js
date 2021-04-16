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
                category_name: "Root Category",
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
            let categoryName = req.body.categoryName;
            let parentId = req.body.parentId;
            var parentCategory;
            let reqBody = {
                category_name: categoryName
            }
            if (parentId) {
                let id = mongoose.Types.ObjectId(parentId);
                parentCategory = await categoryService.getCategory(id);
                if (!parentCategory) {
                    return next(new ErrorBody(400, "Bad Inputs", []));
                }
            }
            else {
                let filters = {
                    category_name: 'Root Category'
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
        next({});
    }
}



/**
 * Get top level categories categories
 */

exports.getMainCategories = async (req, res, next) => {
    try {
        let filters = {
            category_name: 'Root Category'
        }
        const root = await categoryService.getCategoryWithFilters(filters);
        if (!root) {
            return next({});
        }
        let projection = {
            _id: 1,
            category_name: 1,
            is_leaf: 1
        }
        const result = await root.getImmediateChildren({}, projection);
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
        const result = await categoryService.getCategories(filters);
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
                parent: 1
            }
            const result = await categoryService.getCategory(id, projection);
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
            let id = mongoose.Types.ObjectId(req.query.id);
            const parentCategory = await categoryService.getCategory(id);
            if (!parentCategory) {
                return next(new ErrorBody(400, "Bad Inputs", []));
            }
            else {
                let projection = {
                    _id: 1,
                    category_name: 1,
                    is_leaf: 1,
                }
                const result = await parentCategory.getImmediateChildren({}, projection);
                var response = { message: 'Successfully retrieved sub categories.', error: false, data: { categories: result } };
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }
        }
    } catch (error) {
        console.log(error);
        next({});
    }
}