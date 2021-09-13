const { validationResult } = require('express-validator');
const signupService = require('../services/signupService');
const { ErrorBody } = require('../utils/ErrorBody');
const { verifyPassword, encryptPassword, verifyEmail, sendOTP, isMobileOrEmail, userLogin } = require('../services/commonAccountService');
const otpGenerator = require('otp-generator');
const router = require('../routes/signupRouter');
const mongoose = require('mongoose');


// USER & VENDOR

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
            var userType = data.userType;
            var filters = {};
            if (email && !await verifyEmail(email)) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({ message: 'Please provide a valid Email.', error: true, data: { isVendor: null, isMobile: null } });
            }
            if (email) {
                filters = { $or: [{ email: email }, { $and: [{ 'mobile_number.country_code': countryCode }, { 'mobile_number.number': number }] }] };
            }
            else {
                filters = { $and: [{ 'mobile_number.country_code': countryCode }, { 'mobile_number.number': number }] };
            }
            const account = await signupService.isUserExists(filters, null, { lean: true });
            if (account) {
                let isMobile = account.mobile_number.number === number;
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: "Account already exists.", error: true, data: { isVendor: account.is_vendor, isMobile: isMobile } });
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
                    user_type: userType,
                    date: Date.now()
                }
                const otpData = await signupService.createPreSignupRecord(presignupRecord);

                // Send Mobile OTP

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
            var useragent = req.useragent;
            const userData = await signupService.getPreSignupRecord(presignupId);
            if ((!userData) || !(userData.user_type === "user" || userData.user_type === "vendor")) {
                next(new ErrorBody(400, "Bad Request", []));
            }
            else {
                var date = new Date();
                date.setMinutes(date.getMinutes() - 30);
                let time = date.getTime();
                let recordDate = userData.date.getTime();
                if ((time > recordDate) || (otp !== userData.otp)) {
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
                    if (userData.user_type === "vendor") {
                        userRecord['is_vendor'] = true;
                    }
                    const userAccount = await signupService.registerUser(userRecord);
                    try {
                        let filters = { mobile: user.number, user_type: userData.user_type };
                        await signupService.deleteAllUserPreSignupRecords(filters);
                    } catch (error) {
                        //Nothing to do.
                    }
                    const tokens = await userLogin(userAccount._id, useragent);
                    let response = {
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                        fullname: userAccount.fullname,
                        type: userAccount.is_vendor ? "vendor" : "user"
                    }
                    res.statusCode = 201;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'Account successfully registered.', error: false, data: response });
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
            if ((!userData) || !(userData.user_type === "user" || userData.user_type === "vendor")) {
                next(new ErrorBody(400, "Bad Request", []));
            }
            else {
                var otp = await otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                userData.otp = otp;
                userData.date = Date.now();
                await userData.save();

                // Send OTP to mobile.

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: 'OTP has been sent to your mobile number.', error: false, data: { otp: userData.otp } });
            }
        }
    } catch (error) {
        next({});
    }
}



exports.upgradeToVendor = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var username = req.body.username;
            var password = req.body.password;
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
                const account = await signupService.isUserExists(filters);
                if (!account) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: "Invalid Account.", error: true, data: {} });
                }
                else if (account.is_blocked) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: "Account Blocked, Please contact our team for recovery.", error: true, data: {} });
                }
                else if (account.is_vendor) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: "You can't upgrade a seller account.", error: true, data: {} });
                }
                else {
                    const flag = await verifyPassword(account.hash, password);
                    if (!flag) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ message: 'Invalid Password.', error: true, data: {} });
                    }
                    else {
                        let updateQuery = { is_vendor: true };
                        await signupService.upgradeTovendor(account._id, updateQuery);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ message: 'Account upgraded to seller account.', error: false, data: {} });
                    }
                }
            }
        }
    } catch (error) {
        next({});
    }
}



exports.directUpgradeToVendor = async (req, res, next) => {
    try {
        var vendorId = mongoose.Types.ObjectId(req.user.id);
        let updateQuery = { is_vendor: true };
        await signupService.upgradeTovendor(vendorId, updateQuery);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.json({ message: 'Account upgraded to seller account.', error: false, data: {} });

    } catch (error) {
        next({});
    }
}



//ADMIN Start

exports.signupAdmin = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var data = req.body;
            var email = data.email.trim().toLowerCase();
            var username = data.username.trim().toLowerCase();
            var mobile = data.mobile;
            filters = { $or: [{ email: email }, { username: username }, { mobile_number: mobile }] };
            const account = await signupService.isAdminExists(filters, null, { lean: true });
            if (account) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: "Account already exists.", error: true, data: {} });
            }
            else {
                const hash = await encryptPassword(data.password);
                var reqBody = {
                    fullname: data.fullname,
                    email: email,
                    mobile_number: mobile,
                    admin_rank: "Sub Admin",
                    username: username,
                    hash: hash
                }
                const result = await signupService.registerAdmin(reqBody);
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                return res.json({ message: 'Account successfully registered.', error: false, data: {} });
            }
        }
    } catch (error) {
        next({});
    }
}


exports.signupSuperAdmin = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var data = req.body;
            var email = data.email.trim().toLowerCase();
            var username = data.username.trim().toLowerCase();
            var mobile = data.mobile;
            filters = { $or: [{ email: email }, { username: username }, { mobile_number: mobile }] };
            const account = await signupService.isAdminExists(filters);
            if (account) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: "Account already exists.", error: true, data: {} });
            }
            else {
                const hash = await encryptPassword(data.password);
                var reqBody = {
                    fullname: data.fullname,
                    email: email,
                    mobile_number: mobile,
                    admin_rank: "Super Admin",
                    username: username,
                    hash: hash
                }
                const result = await signupService.registerAdmin(reqBody);
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                return res.json({ message: 'Account successfully registered.', error: false, data: {} });
            }
        }
    } catch (error) {
        next({});
    }
}

//ADMIN End

// Belows Coding for Promoters start.
exports.registerPromoter = async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(new ErrorBody(400, "Bad Request", errors.array()));
      } else {
        let reqData = req.body;
        let Name = reqData.Name;
        let userName = reqData.userName;
        let Email = reqData.Email ? reqData.Email.trim().toLowerCase() : null;
        let mobileNumber = reqData.mobileNumber;
        let Address = reqData.Address;
        let Password = reqData.Password;

        let filters = {};
        if (Email && !await verifyEmail(Email)) {
            return res.status(200).json({
                message: 'Please provide a valid Email.',
                error: true,
                data:{}
            });
        }
        if (Email) {
          filters = {
            $or: [{Email: Email}, {mobileNumber:mobileNumber}]
          };
        } else {
          filters = {mobileNumber:mobileNumber};
        }
       
        const account = await signupService.isPromoterExists(filters, null, {
          lean: true
        });
        
        if (account) {
            return res.status(200).json({
                message: 'Account already exists.',
                error: true,
                data:{}
            });
        } else {
          const pass = await encryptPassword(Password);
          var promoterObj = {
            Email: Email,
            Name:Name,
            userName:userName,
            mobileNumber: mobileNumber,
            Address: Address,
            Password: pass
          }
          const result = await signupService.registerPromoter(promoterObj);

            if(result && result.Password){
                delete result.Password;
                return res.status(200).json({
                    message: 'Successfully Promoter Registered',
                    error: false,
                    data:result
                });
            } 
        }
      }
    } catch (error) {
      next({});
    }
  }