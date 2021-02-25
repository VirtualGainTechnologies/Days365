const express = require('express');
const usersRouter = express.Router();
const { verifyPassword, encryptPassword, verifyEmail, verifyMobile, isMobileOrEmail, userLogin } = require('../services/loginService');
const { generateTokens, compareUserAgents } = require('../services/jwtServices');
const { adminRegisterModel } = require('../models/adminRegister');
const { vendorRegisterModel } = require('../models/vendorRegister');
const { UserRegisterModel } = require('../models/userRegister');
const { refreshTokenModel } = require("../models/refreshTokenModel");
const chalk = require('chalk');




/** 
 * Sign up users
 */

usersRouter.post('/signup/user', async (req, res, next) => {
    try {
        var data = req.body;
        var email = data.email ? data.email.trim().toLowerCase() : null;
        var countryCode = data.mobile.countryCode || "+91";
        var number = data.mobile.number.trim().slice(-10);
        var filter = {};
        if (!await verifyMobile(number)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({ message: 'Please provide a valid Mobile Number.', error: true, data: {} });
        }

        if (email && !await verifyEmail(email)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({ message: 'Please provide a valid Email.', error: true, data: {} });
        }

        if (email) {
            filter = { $or: [{ email: email }, { $and: [{ 'mobile_number.country_code': countryCode }, { 'mobile_number.number': number }] }] };
        }
        else {
            filter = { $and: [{ 'mobile_number.country_code': countryCode }, { 'mobile_number.number': number }] };
        }

        await UserRegisterModel.find(filter, async (err, users) => {
            if (err) {
                next({});
            }
            else if (users.length) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: 'User already exists.', error: true, data: {} });
            }
            else {
                await encryptPassword(data.password, async (err, hash) => {
                    if (err) {
                        next({});
                    }
                    else {
                        var user = new UserRegisterModel();
                        user.email = email;
                        user.mobile_number.country_code = countryCode;
                        user.mobile_number.number = number;
                        user.hash = hash;
                        user.fullname = data.fullname;
                        await user.save(async (err, user) => {
                            if (err) {
                                next({});
                            }
                            else {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ message: 'Registration successful.', error: false, data: {} });
                            }
                        });
                    }
                });
            }
        });
    } catch (err) {
        next({});
    }
});


// usersRouter.post('/signup/vendor', async (req, res, next) => {
//     try {
//         var data = req.body;
//         var username = data.username.trim().toLowerCase();
//         var email = data.email.trim().toLowerCase();
//         if (!await verifyEmail(email)) {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             return res.json({ message: 'Please provide a valid email.', error: true, data: {} });
//         }
//         await vendorRegisterModel.find({ $or: [{ username: username }, { email: email }] }, async (err, vendors) => {
//             if (err) {
//                 next(err);
//             }
//             else if (vendors.length) {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json({ message: 'Vendor Already Exists.', error: true, data: {} });
//             }
//             else {
//                 await encryptPassword(data.password, async (err, hash) => {
//                     if (err) {
//                         next(err);
//                     }
//                     else {
//                         var vendor = new vendorRegisterModel();
//                         vendor.username = username;
//                         vendor.email = email;
//                         vendor.hash = hash;
//                         vendor.fullname = data.fullname;

//                         await vendor.save(async (err, vendor) => {
//                             if (err) {
//                                 next(err);
//                             }
//                             else {
//                                 res.statusCode = 200;
//                                 res.setHeader('Content-Type', 'application/json');
//                                 res.json({ message: 'Registration Successful.', error: false, data: {} });
//                             }
//                         });
//                     }
//                 });
//             }
//         });
//     } catch (err) {
//         next(err);
//     }
// });


// usersRouter.post('/signup/admin', async (req, res, next) => {
//     try {
//         var data = req.body;
//         var username = data.username.trim().toLowerCase();
//         await adminRegisterModel.findOne({ username: username }, async (err, admin) => {
//             if (err) {
//                 next(err);
//             }
//             else if (admin) {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json({ message: 'Admin Already Exists.', error: true, data: {} });
//             }
//             else {
//                 await encryptPassword(data.password, async (err, hash) => {
//                     if (err) {
//                         next(err);
//                     }
//                     else {
//                         var newAdmin = new adminRegisterModel();
//                         newAdmin.username = username;
//                         newAdmin.hash = hash;
//                         newAdmin.fullname = data.fullname;

//                         await newAdmin.save(async (err, user) => {
//                             if (err) {
//                                 next(err);
//                             }
//                             else {
//                                 res.statusCode = 200;
//                                 res.setHeader('Content-Type', 'application/json');
//                                 res.json({ message: 'Registration Successful.', error: false, data: {} });
//                             }
//                         });
//                     }
//                 });
//             }
//         });
//     } catch (err) {
//         next(err);
//     }
// });




/**
 *Login users
 */

usersRouter.post('/signin/user', async (req, res, next) => {
    try {
        var type = req.body.type;
        var value = req.body.value;
        var password = req.body.password;
        var useragent = req.useragent;
        if (type === "EMAIL") {
            filter = { email: value };
        }
        else {
            filter = { $and: [{ 'mobile_number.country_code': "+91" }, { 'mobile_number.number': value }] };
        }
        await UserRegisterModel.findOne(filter, async (err, user) => {
            if (err) {
                next({});
            }
            else if (!user) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: 'Invalid Account.', error: true, data: {} });
            }
            else {
                await verifyPassword(user.hash, password, async (err, flag) => {
                    if (err) {
                        next({});
                    }
                    else if (flag) {
                        await userLogin(user._id, useragent, async (err, tokens) => {
                            if (err) {
                                next({});
                            }
                            else {
                                let response = {
                                    accessToken: tokens.accessToken,
                                    refreshToken: tokens.refreshToken,
                                    fullname: user.fullname
                                }
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ message: 'Login successful.', error: false, data: response });
                            }
                        });
                    }
                    else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ message: 'Login failed.', error: true, data: {} });
                    }
                });
            }
        });
    }
    catch (err) {
        next({});
    }


});


// usersRouter.post('/signin/vendor', async (req, res, next) => {
//     try {
//         var username = req.body.username.trim().toLowerCase();
//         var password = req.body.password;
//         var filter = {};
//         if (await verifyEmail(username)) {
//             filter = { email: username };
//         }
//         else {
//             filter = { username: username };
//         }
//         //console.log(filter);
//         await vendorRegisterModel.findOne(filter, async (err, vendor) => {
//             if (err) {
//                 next(err);
//             }
//             else if (!vendor) {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json({ message: 'Invalid username or email.', error: true, data: {} });
//             }
//             else {
//                 await verifyPassword(vendor.hash, password, async (err, flag) => {
//                     if (err) {
//                         next(err);
//                     }
//                     else if (flag) {
//                         let response = {
//                             token: "Will add later",
//                             refreshToken: "Will add later",
//                             username: vendor.username,
//                             fullname: vendor.fullname
//                         }
//                         res.statusCode = 200;
//                         res.setHeader('Content-Type', 'application/json');
//                         res.json({ message: 'Login Successful.', error: false, data: response });
//                     }
//                     else {
//                         res.statusCode = 200;
//                         res.setHeader('Content-Type', 'application/json');
//                         res.json({ message: 'Login failed.', error: true, data: {} });
//                     }
//                 });
//             }
//         });
//     }
//     catch (err) {
//         next(err);
//     }

// });


// usersRouter.post('/signin/admin', async (req, res, next) => {
//     try {
//         var username = req.body.username.trim().toLowerCase();
//         var password = req.body.password;
//         var filter = { username: username };
//         //console.log(filter);
//         await adminRegisterModel.findOne(filter, async (err, admin) => {
//             if (err) {
//                 next(err);
//             }
//             else if (!admin) {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json({ message: 'Invalid username.', error: true, data: {} });
//             }
//             else {
//                 await verifyPassword(admin.hash, password, async (err, flag) => {
//                     if (err) {
//                         next(err);
//                     }
//                     else if (flag) {
//                         let response = {
//                             token: "Will add later",
//                             refreshToken: "Will add later",
//                             username: admin.username,
//                             fullname: admin.fullname
//                         }
//                         res.statusCode = 200;
//                         res.setHeader('Content-Type', 'application/json');
//                         res.json({ message: 'Login Successful.', error: false, data: response });
//                     }
//                     else {
//                         next(err);
//                         res.statusCode = 200;
//                         res.setHeader('Content-Type', 'application/json');
//                         res.json({ message: 'Login failed.', error: true, data: {} });
//                     }
//                 });
//             }
//         });
//     }
//     catch (err) {
//         next(err);
//     }

// });


/**
 * Check entered email or password exists or not.
 */

usersRouter.get('/verifyCredential/user/:loginCredential', async (req, res, next) => {
    await isMobileOrEmail(req.params.loginCredential, async (err, field) => {
        if (err) {
            next({});
        }
        else if (field.isValid) {
            var filter = {};
            if (field.type === "EMAIL") {
                filter = { email: field.value };
            }
            else {
                filter = { $and: [{ 'mobile_number.country_code': "+91" }, { 'mobile_number.number': field.value }] };
            }
            await UserRegisterModel.findOne(filter, async (err, user) => {
                if (err) {
                    next({});
                }
                else if (!user) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: `Invalid Account`, error: true, data: {} });
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'Account exists.', error: false, data: field });
                }
            });
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Invalid Account.', error: true, data: {} });
        }
    });
});



module.exports = usersRouter;