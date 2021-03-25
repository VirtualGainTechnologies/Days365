const { validationResult } = require('express-validator');
const signupService = require('../services/signupService');
const { ErrorBody } = require('../utils/ErrorBody');
const { encryptPassword, verifyEmail, sendOTP } = require('../services/commonAccountService');
const otpGenerator = require('otp-generator');




exports.preSignupUser = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Request", errors.array()));
        }
        else {
            var data = req.body;
            var email = data.email ? data.email.trim().toLowerCase() : null;
            var countryCode = data.mobile.countryCode;
            var number = data.mobile.number;
            var fullname = data.fullname;
            var password = data.password;
            var filters = {};
            if (email && !await verifyEmail(email)) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({ message: 'Please provide a valid Email.', error: true, data: {} });
            }
            if (email) {
                filters = { $or: [{ email: email }, { $and: [{ 'mobile_number.country_code': countryCode }, { 'mobile_number.number': number }] }] };
            }
            else {
                filters = { $and: [{ 'mobile_number.country_code': countryCode }, { 'mobile_number.number': number }] };
            }
            const account = await signupService.isUserExists(filters);
            if (account) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: "Account already exists.", error: true, data: {} });
            }
            else {
                const hash = await encryptPassword(password);
                var user = {
                    email: email,
                    countryCode: countryCode,
                    number: number,
                    hash: hash,
                    fullname: fullname
                }
                var otp = await otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                var userData = JSON.stringify(user);
                var presignupRecord = {
                    mobile: number,
                    otp: otp,
                    data: userData,
                    user_type: "user",
                    date: Date.now()
                }
                const otpData = await signupService.createPreSignupRecord(presignupRecord);
                // const result = await sendOTP(number, otp);
                // var response ={ message: 'Unable to send OTP at this moment, Please try after sometimes.', error: true, data: {} };
                // res.statusCode = 200;
                // res.setHeader('Content-Type', 'application/json');
                // //verify result
                // if (result) {
                //     response = { message: 'OTP has been sent to your mobile number.', error: false, data: { id: otpData._id, otp: otp } };
                // }
                // res.json(response);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: 'OTP has been sent to your mobile number.', error: false, data: { id: otpData._id, otp: otp } });
            }
        }
    } catch (error) {
        next({});
    }
}



exports.signupUser = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var otp = req.body.otp;
            var presignupId = req.body.id;
            const userData = await signupService.getPreSignupRecord(presignupId);
            if ((!userData) || (userData.user_type !== "user")) {
                next(new ErrorBody(400, "Bad Request", errors.array()));
            }
            else {
                var date = Date.now();
                date -= 10 * 60 * 1000;
                var recordDate = userData.date.getTime();
                if ((date > recordDate) || (otp !== userData.otp)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'Mobile verification failed.', error: true, data: {} });
                }
                else {
                    var user = JSON.parse(userData.data);
                    var userRecord = {
                        fullname: user.fullname,
                        mobile_number: {
                            country_code: user.countryCode,
                            number: user.number,
                        },
                        hash: user.hash
                    }
                    if (user.email) {
                        userRecord['email'] = user.email;
                    }

                    const result = await signupService.registerUser(userRecord);
                    try {
                        await signupService.deleteAllUserPreSignupRecords(user.number);
                    } catch (error) {
                        //Nothing to do.
                    }
                    res.statusCode = 201;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({ message: 'Account successfully registered.', error: false, data: {} });
                }
            }
        }
    } catch (error) {
        // console.log(error);
        next({});
    }
}



exports.resendUserOTP = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var presignupId = req.body.id;
            const userData = await signupService.getPreSignupRecord(presignupId);
            if ((!userData) || (userData.user_type !== "user")) {
                next(new ErrorBody(400, "Bad Request", errors.array()));
            }
            else {
                var otp = await otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                userData.otp = otp;
                userData.date = Date.now();
                await userData.save();
                // const result = await sendOTP(userData.mobile, userData.otp);
                // var response = { message: 'Unable to send OTP at this moment, Please try after sometimes.', error: true, data: {} };
                // res.statusCode = 200;
                // res.setHeader('Content-Type', 'application/json');
                // // verify result
                // if (result) {
                //     response = { message: 'OTP has been sent to your mobile number.', error: false, data: { otp: userData.otp } };
                // }
                // res.json(response);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: 'OTP has been sent to your mobile number.', error: false, data: { otp: userData.otp } });
            }
        }
    } catch (error) {
        next({});
    }
}