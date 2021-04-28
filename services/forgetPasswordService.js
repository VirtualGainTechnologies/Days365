const { otpModel } = require('../models/otpModel');
const { userRegisterModel } = require('../models/userRegister');








exports.getUserAccount = async (filters = {}) => {
    return await userRegisterModel.findOne(filters);
}

exports.updateUserPassword = async (userId, updateQuery = {}) => {
    return await userRegisterModel.findByIdAndUpdate(userId, updateQuery);
}

exports.createOtpRecord = async (reqBody = {}) => {
    return await otpModel.create(reqBody);
}

exports.getOtpRecord = async (id) => {
    return await otpModel.findById(id);
}

exports.updateOtpRecord = async (id, updateQuery = {}) => {
    return await otpModel.findByIdAndUpdate(id, updateQuery);
}

exports.deleteOtpRecord = async (id) => {
    return await otpModel.findByIdAndDelete(id);
}

