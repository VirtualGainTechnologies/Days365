const {productModel} = require('../models/productModel');
const {brandModel} = require('../models/brandModel');
const {productTaxModel} = require('../models/productTaxModel');
const {vendorDetailsModel} = require('../models/vendorDetailsModel');
const {categoryModel} = require('../models/categoryModel');
const {deleteFileFromPublicSpace} = require('../utils/fileUpload');
const mongoose = require('mongoose');

/**
 * Get All Product List for Approval
 */

 exports.getAllProduct = async (filters = {},projection = null, options = {}) => {
    return await productModel.find(filters, projection, options).sort({_id:-1});
}

//Retrieing brand filter.

exports.brandModel =async(filters = {}, projection = null, options = {}) =>{
    let pipeline = [];
    pipeline.push({
        $match: {
            _id: id
        }
    })
}