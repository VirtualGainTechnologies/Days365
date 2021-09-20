const {productModel} = require('../models/productModel');

/**
 *  get the product data
 */
 exports.getProduct = async (filters = {}, projection = null, options = {}) => {
    return await productModel.findOne(filters, projection, options);
}