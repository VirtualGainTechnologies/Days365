const { vendorDetailsModel } = require('../models/vendorDetailsModel');






exports.getVendorDetailsRecord = async (filters) => {
    return await vendorDetailsModel.findOne(filters);
}


exports.createVendorDetailsRecord = async (reqBody) => {
    return await vendorDetailsModel.create(reqBody);
}