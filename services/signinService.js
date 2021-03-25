const { userRegisterModel } = require('../models/userRegister');


exports.getUserAccount = async (filters) => {
    return await userRegisterModel.findOne(filters);
}



