const { brandModel } = require('../models/brandModel');
const { vendorDetailsModel } = require('../models/vendorDetailsModel');
const { categoryModel } = require('../models/categoryModel');
const { deleteFileFromPublicSpace } = require('../utils/fileUpload');
const mongoose = require('mongoose');
const { options } = require('../app');



exports.createBrand = async (reqBody = {}) => {
    return await brandModel.create(reqBody);
}

exports.getPendingBrand = async () => {
    return await brandModel.find({status:"Pending"});
}

exports.changeStatus = async (filters = {}, updateQuery={}, options={}) => {
    return await brandModel.findByIdAndUpdate(filters, updateQuery, options);
}

exports.isBrandExists = async (filters = {}, projection = null, options = {}) => {
    return await brandModel.findOne(filters, projection, options)
}

exports.getAllCat = async (filters = {}, projection = null, options = {}) => {
    return await categoryModel.find(filters, projection, options)
}

//uploadFile
exports.uploadFile = async (reqBody = {}) => {
    return await mytestmodel.create(reqBody); 
}