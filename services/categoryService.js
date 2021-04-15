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

exports.getCategory = async (id) => {
    return await categoryModel.findById(id);
}