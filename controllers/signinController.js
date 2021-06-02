const { validationResult } = require('express-validator');
const signinService = require('../services/signinService');
const { verifyPassword, isMobileOrEmail, userLogin } = require('../services/commonAccountService');
const { ErrorBody } = require('../utils/ErrorBody');


// USER & VENDOR

exports.preSigninUser = async (req, res, next) => {
    try {
        const field = await isMobileOrEmail(req.params.loginCredential);
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
            const account = await signinService.getUserAccount(filters, null, { lean: true });
            var response = { message: `Invalid Account`, error: true, data: {} };
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            if (account) {
                field['isVendor'] = account.is_vendor;
                response = { message: 'Account exists.', error: false, data: field };
            }
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}



exports.signinUser = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Request", errors.array()));
        }
        else {
            var type = req.body.type;
            var value = req.body.value;
            var password = req.body.password;
            var useragent = req.useragent;
            var filters = {};
            if (type === "EMAIL") {
                filters = { email: value };
            }
            else {
                filters = { $and: [{ 'mobile_number.country_code': "+91" }, { 'mobile_number.number': value }] };
            }
            const user = await signinService.getUserAccount(filters, null, { lean: true });
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
                const flag = await verifyPassword(user.hash, password);
                if (!flag) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'Login failed.', error: true, data: {} });
                }
                else {
                    const tokens = await userLogin(user._id, useragent);
                    let response = {
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                        fullname: user.fullname,
                        type: user.is_vendor ? "vendor" : "user"
                    }
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'Login successful.', error: false, data: response });
                }
            }
        }
    } catch (error) {
        // console.log(error);
        next({});
    }
}




//ADMIN

exports.signinAdmin = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Request", errors.array()));
        }
        else {
            var password = req.body.password;
            var useragent = req.useragent;
            var email = req.body.email.trim().toLowerCase();
            var filters = { email: email };
            const admin = await signinService.getAdminAccount(filters, null, { lean: true });
            if (!admin) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: 'Invalid Account.', error: true, data: {} });
            }
            else {
                const flag = await verifyPassword(admin.hash, password);
                if (!flag) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'Login failed.', error: true, data: {} });
                }
                else {
                    const tokens = await userLogin(admin._id, useragent);
                    let response = {
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                        fullname: admin.fullname,
                        type: "admin"
                    }
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'Login successful.', error: false, data: response });
                }
            }
        }
    } catch (error) {
        console.log("error......................",error);
        next({});
    }
}