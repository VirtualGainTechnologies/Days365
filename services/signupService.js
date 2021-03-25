const { userRegisterModel } = require('../models/userRegister');
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


exports.isUserExists = async (filters) => {
    return await userRegisterModel.findOne(filters);
}


exports.registerUser = async (record) => {
    return await userRegisterModel.create(record);
}



