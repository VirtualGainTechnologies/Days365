const { userRegisterModel } = require('../models/userRegister');
const { otpModel } = require('../models/otpModel');
const { adminRegisterModel } = require('../models/adminRegister');
const { refreshTokenModel } = require('../models/refreshTokenModel');
const { preSignUpModel } = require('../models/preSignUPModel');


/**
 *  Delete expired otp documents
 */

exports.deleteExpiredOtpRecords = async () => {
    try {
        var date = new Date();
        date.setHours(date.getHours() - 2);
        var filters = { time_stamp: { $lt: date } };
        await otpModel.deleteMany(filters);
    } catch (error) {
        //Everything is fine.
    }
}


/**
 *  Delete expired presignup documents
 */

exports.deleteExpiredPreSignupRecords = async () => {
    try {
        var date = new Date();
        date.setDate(date.getDate() - 1);
        var filters = { date: { $lt: date } };
        await preSignUpModel.deleteMany(filters);
    } catch (error) {
        //Everything is fine.
    }
}