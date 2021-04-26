const { optModel } = require('../models/otpModel');
const { userRegisterModel } = require('../models/userRegister');








exports.getUserAccount = async (filters = {}) => {
    return await userRegisterModel.findOne(filters);
}

exports.updateUserPassword = async (userId, updateQuery = {}) => {
    return await userRegisterModel.findByIdAndUpdate(userId, updateQuery);
}

exports.createOtpRecord = async (reqBody = {}) => {
    return await optModel.create(reqBody);
}

exports.getOtpRecord = async (id) => {
    return await optModel.findById(id);
}

exports.updateOtpRecord = async (id, updateQuery = {}) => {
    return await optModel.findByIdAndUpdate(id, updateQuery);
}

exports.deleteOtpRecord = async (id) => {
    return await optModel.findByIdAndDelete(id);
}

