const { userRegisterModel } = require('../models/userRegister');
const { adminRegisterModel } = require('../models/adminRegister');
const { preSignUpModel } = require('../models/preSignUPModel');


exports.createPreSignupRecord = async (record) => {
    return await preSignUpModel.create(record);
}

exports.getPreSignupRecord = async (id) => {
    return await preSignUpModel.findById(id);
}

exports.deleteAllUserPreSignupRecords = async (filters) => {
    return await preSignUpModel.deleteMany(filters);
}

exports.isUserExists = async (filters) => {
    return await userRegisterModel.findOne(filters);
}

exports.registerUser = async (record) => {
    return await userRegisterModel.create(record);
}

exports.isAdminExists = async (filters) => {
    return await adminRegisterModel.findOne(filters);
}

exports.registerAdmin = async (record) => {
    return await adminRegisterModel.create(record);
}
