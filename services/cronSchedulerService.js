const { userRegisterModel } = require('../models/userRegister');
const { optModel } = require('../models/otpModel');
const { adminRegisterModel } = require('../models/adminRegister');
const { refreshTokenModel } = require('../models/refreshTokenModel');
const { preSignUpModel } = require('../models/preSignUPModel');



exports.deleteExpiredOtpRecords = async () => {
    try {
        var date = Date.now();
        date -= 2 * 60 * 60 * 1000;
        var filters = { time_stamp: { $lt: date } };
        await optModel.deleteMany(filters);
    } catch (error) {
        //Everything is fine.
    }
}