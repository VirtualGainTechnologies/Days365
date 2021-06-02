const { userRegisterModel } = require('../models/userRegister');
const { adminRegisterModel } = require('../models/adminRegister');



exports.getUserAccount = async (filters = {}, projection = null, options = {}) => {
    return await userRegisterModel.findOne(filters, projection, options);
}


exports.getAdminAccount = async (filters = {}, projection = null, options = {}) => {
    // filters = JSON.parse(JSON.stringify(filters));
     console.log("filters......................",filters);
    return await adminRegisterModel.findOne(filters, projection, options);
}



