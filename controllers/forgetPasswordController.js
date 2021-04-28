const { validationResult } = require('express-validator');
const forgetPasswordService = require('../services/forgetPasswordService');
const { ErrorBody } = require('../utils/ErrorBody');
const otpGenerator = require('otp-generator');
const mongoose = require('mongoose');
const { encryptPassword, sendOTP, isMobileOrEmail } = require('../services/commonAccountService');


// USER & VENDOR

exports.sendUserOTP = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var username = req.body.username;
            const field = await isMobileOrEmail(username);
            if (!field.isValid) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: 'Invalid Account.', error: true, data: {} });
            }
            else {
                var filters = {};
                if (field.type === "EMAIL") {
                    filters = { email: field.value };
                }
                else {
                    filters = { $and: [{ 'mobile_number.country_code': "+91" }, { 'mobile_number.number': field.value }] };
                }
                const user = await forgetPasswordService.getUserAccount(filters);
                if (!user) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'Invalid Account.', error: true, data: {} });
                }
                else if (user.is_blocked) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: "Account Blocked, Please contact our team for recovery.", error: true, data: {} });
                }
                else {
                    var otp = await otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                    var reqBody = {
                        otp: otp,
                        purpose: "Reset Password",
                        user_id: user._id,
                        time_stamp: Date.now()
                    };
                    const optRecord = await forgetPasswordService.createOtpRecord(reqBody);

                    // Send OTP to email or mobile TODO


                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: `OTP has been sent to your ${field.type}.`, error: false, data: { otp: optRecord.otp, id: optRecord._id } });
                }
            }
        }
    } catch (error) {
        next({});
    }
}


exports.verifyUserOTP = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var otpRecordId = mongoose.Types.ObjectId(req.body.id);
            var otp = req.body.otp;
            var date = new Date();
            date.setMinutes(date.getMinutes() - 30);
            let time = date.getTime();
            const record = await forgetPasswordService.getOtpRecord(otpRecordId);
            if (!record) {
                next(new ErrorBody(400, "Bad Inputs", []));
            }
            else if ((record.time_stamp.getTime() < time) || record.otp !== otp || record.purpose !== "Reset Password") {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: 'OTP verification failed.', error: true, data: {} });
            }
            else {
                record.is_verified = true;
                await record.save();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: 'Successfully verified OTP.', error: false, data: { id: otpRecordId } });
            }
        }
    } catch (error) {
        next({});
    }
}


exports.resetUserPassword = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var newPassword = req.body.password;
            var otpRecordId = mongoose.Types.ObjectId(req.body.id);
            var date = new Date();
            date.setHours(date.getHours() - 1);
            let time = date.getTime();
            const record = await forgetPasswordService.getOtpRecord(otpRecordId);
            if (!record) {
                next(new ErrorBody(400, "Bad Inputs", []));
            }
            else if ((record.time_stamp.getTime() < time) || record.purpose !== "Reset Password" || !record.is_verified) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: 'Failed to reset your password. Please try after sometimes.', error: true, data: {} });
            }
            else {
                const hash = await encryptPassword(newPassword);
                var updateQuery = { hash: hash };
                const result = await forgetPasswordService.updateUserPassword(record.user_id, updateQuery);
                var response = { message: 'Failed to reset your password. Please try after sometimes.', error: true, data: {} };
                if (result) {
                    response = { message: 'Password updated successfully.', error: false, data: {} };
                }
                try {
                    await forgetPasswordService.deleteOtpRecord(record._id);
                } catch (error) {
                    // Everything is fine.
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }
        }
    } catch (error) {
        next({});
    }
}


