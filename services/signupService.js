const { userRegisterModel } = require('../models/userRegister');
const { adminRegisterModel } = require('../models/adminRegister');
const { preSignUpModel } = require('../models/preSignUPModel');
const { promoterModel } = require('../models/promoterModel');


exports.createPreSignupRecord = async (record = {}) => {
    return await preSignUpModel.create(record);
}

exports.getPreSignupRecord = async (id) => {
    return await preSignUpModel.findById(id);
}

exports.deleteAllUserPreSignupRecords = async (filters = {}) => {
    return await preSignUpModel.deleteMany(filters).lean();
}

exports.isUserExists = async (filters = {}, projection = null, options = {}) => {
    return await userRegisterModel.findOne(filters, projection, options);
}

exports.registerUser = async (record = {}) => {
    return await userRegisterModel.create(record);
}

exports.upgradeTovendor = async (id, updateQuery = {}) => {
    return await userRegisterModel.findByIdAndUpdate(id, updateQuery).lean();
}

exports.isAdminExists = async (filters = {}, projection = null, options = {}) => {
    return await adminRegisterModel.findOne(filters, projection, options);
}

exports.registerAdmin = async (record = {}) => {
    return await adminRegisterModel.create(record);
}

exports.isPromoterExists = async (filters = {}, projection = null, options = {}) => {
    return await promoterModel.findOne(filters, projection, options);
}
exports.registerPromoter = async (record = {}) => {
    return await promoterModel.create(record);
}

