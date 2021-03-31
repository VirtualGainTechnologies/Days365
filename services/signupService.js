const { userRegisterModel } = require('../models/userRegister');
const { vendorRegisterModel } = require('../models/venodrRegister');
const { adminRegisterModel } = require('../models/adminRegister');
const { preSignUpModel } = require('../models/preSignUPModel');


exports.createPreSignupRecord = async (record) => {
    return await preSignUpModel.create(record);
}


exports.getPreSignupRecord = async (id) => {
    return await preSignUpModel.findById(id);
}


exports.deleteAllUserPreSignupRecords = async (mobileNumber) => {
    return await preSignUpModel.deleteMany({ mobile: mobileNumber });
}


exports.deleteAllVendorPreSignupRecords = async (email) => {
    return await preSignUpModel.deleteMany({ email: email });
}


exports.isUserExists = async (filters) => {
    return await userRegisterModel.findOne(filters);
}

exports.registerUser = async (record) => {
    return await userRegisterModel.create(record);
}



exports.isVendorExists = async (filters) => {
    return await vendorRegisterModel.findOne(filters);
}

exports.registerVendor = async (record) => {
    return await vendorRegisterModel.create(record);
}


exports.isAdminExists = async (filters) => {
    return await adminRegisterModel.findOne(filters);
}

exports.registerAdmin = async (record) => {
    return await adminRegisterModel.create(record);
}
