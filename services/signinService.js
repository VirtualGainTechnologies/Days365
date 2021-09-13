const { userRegisterModel } = require('../models/userRegister');
const { adminRegisterModel } = require('../models/adminRegister');
const { promoterModel } = require('../models/promoterModel');



exports.getUserAccount = async (filters = {}, projection = null, options = {}) => {
    return await userRegisterModel.findOne(filters, projection, options);
}


exports.getAdminAccount = async (filters = {}, projection = null, options = {}) => {
    return await adminRegisterModel.findOne(filters, projection, options);
}

exports.getPromoterAccount = async (filters = {}, projection = null, options = {}) => {
    return await promoterModel.findOne(filters, projection, options);
}



