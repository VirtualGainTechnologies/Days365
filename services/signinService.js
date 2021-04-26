const { userRegisterModel } = require('../models/userRegister');
const { adminRegisterModel } = require('../models/adminRegister');



exports.getUserAccount = async (filters = {}, projection = null, options = {}) => {
    return await userRegisterModel.findOne(filters, projection, options);
}


exports.getAdminAccount = async (filters = {}, projection = null, options = {}) => {
    return await adminRegisterModel.findOne(filters, projection, options);
}



