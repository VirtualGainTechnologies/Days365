const { optModel } = require('../models/otpModel');
const { userRegisterModel } = require('../models/userRegister');
const { vendorRegisterModel } = require('../models/venodrRegister');








exports.getUserAccount = async (filters) => {
    return await userRegisterModel.findOne(filters);
}

exports.getVendorAccount = async (filters) => {
    return await vendorRegisterModel.findOne(filters);
}


exports.updateUserPassword = async (userId, updateQuery) => {
    return await userRegisterModel.findByIdAndUpdate(userId, updateQuery);
}

exports.updateVendorPassword = async (vendorId, updateQuery) => {
    return await vendorRegisterModel.findByIdAndUpdate(vendorId, updateQuery);
}


exports.createOtpRecord = async (reqBody) => {
    return await optModel.create(reqBody);
}

exports.getOtpRecord = async (id) => {
    return await optModel.findById(id);
}

exports.deleteOtpRecord = async (id) => {
    return await optModel.findByIdAndDelete(id);
}

