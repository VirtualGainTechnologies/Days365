const { vendorDetailsModel } = require('../models/vendorDetailsModel');





exports.createVendorDetailsRecord = async (reqBody) => {
    return await vendorDetailsModel.create(reqBody);
}

exports.getVendorDetailsRecord = async (filters) => {
    return await vendorDetailsModel.findOne(filters);
}

exports.updateVendorDetails = async (filters, updateQuery) => {
    return await vendorDetailsModel.findOneAndUpdate(filters, updateQuery, { new: true });
}