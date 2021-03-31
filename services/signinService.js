const { userRegisterModel } = require('../models/userRegister');
const { vendorRegisterModel } = require('../models/venodrRegister');
const { adminRegisterModel } = require('../models/adminRegister');



exports.getUserAccount = async (filters) => {
    return await userRegisterModel.findOne(filters);
}


exports.getAdminAccount = async (filters) => {
    return await adminRegisterModel.findOne(filters);
}

exports.getVendorAccount = async (filters) => {
    return await vendorRegisterModel.findOne(filters);
}