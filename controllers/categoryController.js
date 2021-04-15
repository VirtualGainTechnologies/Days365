const { validationResult } = require('express-validator');
const { ErrorBody } = require('../utils/ErrorBody');
const categoryService = require('../services/categoryService');
const mongoose = require('mongoose');



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
            let reqBody = {
                category_name: categoryName
            }
            if (parentId) {
                reqBody['is_parent'] = false;
                reqBody['parent_id'] = mongoose.Types.ObjectId(parentId);
            }
            await categoryService.createCategory(reqBody);
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
 * Get parent categories
 */

exports.getParentCategories = async (req, res, next) => {
    try {
        let filters = {
            is_parent: true
        };
        let options = {
            sort: {
                _id: 1
            }
        }
        const result = await categoryService.getCategories(filters, null, options);
        var response = { message: 'Successfully retrieved parent categories.', error: false, data: { categories: result } };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    } catch (error) {
        next({});
    }
}


/**
 * Get categories
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
            const result = await categoryService.getCategory(id);
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
            let filters = {
                is_parent: false,
                parent_id: id
            }
            let options = {
                sort: {
                    _id: 1
                }
            }
            const result = await categoryService.getCategories(filters, null, options);
            var response = { message: 'Successfully retrieved categories.', error: false, data: { categories: result } };
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        console.log(error);
        next({});
    }
}