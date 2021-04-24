const { LexModelBuildingService } = require('aws-sdk');
const { categoryModel } = require('../models/categoryModel');



/**
 *  create category document
 */

exports.createCategory = async (reqBody) => {
    return await categoryModel.create(reqBody);
}


/**
 * Get records with filters
 */

exports.getCategories = async (filters, projection, options) => {
    return await categoryModel.find(filters, projection, options);
}


/**
 *  Get a category record
 */

exports.getCategory = async (id, projection) => {
    return await categoryModel.findById(id, projection);
}


/**
 * get caegory with filters
 */
exports.getCategoryWithFilters = async (filters, projection = null, options = null) => {
    return await categoryModel.findOne(filters, projection, options);
}


/**
 * Update a record
 */

exports.updateCategory = async (id, updateQuery, options) => {
    return await categoryModel.findByIdAndUpdate(id, updateQuery, options);
}

/**
 * Delete a record
 */

exports.deleteCategory = async (id) => {
    return await categoryModel.findByIdAndDelete(id);
}


/**
 * Get main categories
 */

