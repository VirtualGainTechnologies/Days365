const { userRegisterModel } = require('../models/userRegister');
const { adminRegisterModel } = require('../models/adminRegister');



exports.getUserAccount = async (filters) => {
    return await userRegisterModel.findOne(filters);
}


exports.getAdminAccount = async (filters) => {
    return await adminRegisterModel.findOne(filters);
}



