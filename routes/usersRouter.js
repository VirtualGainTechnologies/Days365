const express = require('express');
const usersRouter = express.Router();
const { verifyPassword, encryptPassword, verifyEmail, verifyMobile, isMobileOrEmail, userLogin, sendOTP } = require('../services/loginService');
const { generateTokens, compareUserAgents } = require('../services/jwtServices');
const { adminRegisterModel } = require('../models/adminRegister');
const { vendorRegisterModel } = require('../models/vendorRegister');
const { UserRegisterModel } = require('../models/userRegister');
const { refreshTokenModel } = require("../models/refreshTokenModel");
const chalk = require('chalk');
const { verifyAccessJwt, verifyRefreshJwt, verifyUser } = require('../middleware');
const createHttpError = require('http-errors');
const { preSignUpModel } = require('../models/preSignUPModel');
const otpGenerator = require('otp-generator');



/** 
 * Pre Signup users
 */

usersRouter.post('/presignup/user', async (req, res, next) => {
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
        await UserRegisterModel.findOne(filter, async (err, account) => {
            if (err) {
                // console.log(err);
                next({});
            }
            else if (account) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: "Account already exists.", error: true, data: {} });
            }
            else {
                await encryptPassword(data.password, async (err, hash) => {
                    if (err) {
                        // console.log(err);
                        next({});
                    }
                    else {
                        var user = {
                            email: email,
                            countryCode: countryCode,
                            number: number,
                            hash: hash,
                            fullname: data.fullname
                        }
                        //  store user data temporarly and  send otp .
                        var otp = await otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                        var userData = JSON.stringify(user);
                        var presignupRecord = new preSignUpModel();
                        presignupRecord.mobile = number;
                        presignupRecord.otp = otp;
                        presignupRecord.data = userData;
                        presignupRecord.user_type = "user";
                        presignupRecord.date = Date.now();
                        await presignupRecord.save(async (err, otpData) => {
                            if (err) {
                                // console.log(err);
                                next({});
                            }
                            else {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ message: 'OTP has been sent to your mobile number.', error: false, data: { id: otpData._id, otp: otp } });
                                // await sendOTP(number, otp)
                                //     .then(async (response) => {
                                //         //verify response
                                //         if (response) {
                                //             res.statusCode = 200;
                                //             res.setHeader('Content-Type', 'application/json');
                                //             res.json({ message: 'OTP has been sent to your mobile number.', error: false, data: { id: otpData._id, otp: otp } });
                                //         }
                                //         else {
                                //             next({});
                                //         }
                                //     })
                                //     .catch((err) => {
                                //         next({});
                                //     });

                            }
                        });
                    }
                });
            }
        });
    } catch (err) {
        // console.log(err);
        next({});
    }
});


// usersRouter.post('/presignup/vendor', async (req, res, next) => {
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


// usersRouter.post('/presignup/admin', async (req, res, next) => {
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
 * Signup user on mobile verification success
 */


usersRouter.post('/signup/user', async (req, res, next) => {
    try {
        var otp = req.body.otp;
        var presignupId = req.body.id;
        await preSignUpModel.findById(presignupId, async (err, userData) => {
            if (err) {
                next({});
            }
            else if ((!userData) || (userData.user_type !== "user")) {
                next(createHttpError(400, "Bad request"));
            }
            else {
                var date = Date.now();
                date -= 10 * 60 * 1000;
                var recordDate = userData.date.getTime();
                if ((date > recordDate) || (otp !== userData.otp)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({ message: 'Mobile verification failed.', error: true, data: {} });
                }
                else {
                    var user = JSON.parse(userData.data);
                    var userRecord = new UserRegisterModel({
                        fullname: user.fullname,
                        mobile_number: {
                            country_code: user.countryCode,
                            number: user.number,
                        },
                        email: user.email,
                        hash: user.hash
                    });
                    await userRecord.save(async (err, newUser) => {
                        if (err) {
                            next({});
                        }
                        else {
                            await preSignUpModel.deleteMany({ mobile: user.number }, async (err, deletedRecord) => {
                                res.statusCode = 201;
                                res.setHeader('Content-Type', 'application/json');
                                return res.json({ message: 'Account successfully registered.', error: false, data: {} });
                            });
                        }
                    });
                }

            }
        });

    } catch (err) {
        next({});
    }
});



usersRouter.post('/signup/vendor', async (req, res, next) => {

});


usersRouter.post('/signup/admin', async (req, res, next) => {

});


/**
 *Signin users
 */

usersRouter.post('/signin/user', async (req, res, next) => {
    try {
        var type = req.body.type;
        var value = req.body.value;
        var password = req.body.password;
        var useragent = req.useragent;
        var filter = {};
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
                if (user.is_blocked) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: "Account Blocked, Please contact our team for recovery.", error: true, data: {} });
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
 * Signout Users.
 */

usersRouter.post('/signout/user', verifyRefreshJwt, verifyUser, async (req, res, next) => {
    try {
        var userId = req.user.id;
        var oldRefreshToken = req.body.refreshToken;
        var useragent = req.useragent;
        await refreshTokenModel.findOne({ userid: userId }, async (err, record) => {
            if (err) {
                return next({});
            }
            else if (!record) {
                return next(createHttpError(401, "Unauthorized"));
            }
            else {
                try {
                    var refreshTokenRecord = new refreshTokenModel(record);
                    var refreshTokens = refreshTokenRecord.refresh_tokens, tokenIndex = -1;
                    for (let i in refreshTokens) {
                        let isEqual = await compareUserAgents(refreshTokens[i].useragent, useragent);
                        if ((isEqual) && (refreshTokens[i].refresh_token === oldRefreshToken)) {
                            tokenIndex = i;
                            break;
                        }
                    }
                    if (tokenIndex === -1) {
                        return next(createHttpError(401, "Unauthorized"));
                    }
                    refreshTokens.splice(tokenIndex, 1);
                    refreshTokenRecord.refresh_tokens = refreshTokens;
                    await refreshTokenRecord.save((err, tokenRecord) => {
                        if (err) {
                            return next({});
                        }
                        else {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ message: 'Signout Successful.', error: false, data: {} });
                        }
                    });
                }
                catch (err) {
                    next({});
                }
            }
        });
    }
    catch (err) {
        next({});
    }
});


usersRouter.post('/signout/vendor', async (req, res, next) => {

});


usersRouter.post('/signout/admin', async (req, res, next) => {

});



/**
 * Check entered email or mobile exists or not.
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



/**
 * Resend otp to mobile number during registration if required.
 */

usersRouter.post('/resendOtp/user', async (req, res, next) => {
    try {
        var presignupId = req.body.id;
        await preSignUpModel.findById(presignupId, async (err, userData) => {
            if (err) {
                return next({});
            }
            else if ((!userData) || (userData.user_type !== "user")) {
                next(createHttpError(400, "Bad request"));
            }
            else {
                var otp = await otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                userData.otp = otp;
                userData.date = Date.now();
                await userData.save(async (err, otpData) => {
                    if (err) {
                        next({});
                    }
                    else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ message: 'OTP has been sent to your mobile number.', error: false, data: { otp: otp } });
                        // await sendOTP(number, otp)
                        //     .then(async (response) => {
                        //         //verify response
                        //         if (response) {
                        //             res.statusCode = 200;
                        //             res.setHeader('Content-Type', 'application/json');
                        //             res.json({ message: 'OTP has been sent to your mobile number.', error: false, data: { otp: otp } });
                        //         }
                        //         else {
                        //             next({});
                        //         }
                        //     })
                        //     .catch((err) => {
                        //         next({});
                        //     });
                    }
                });

            }
        });
    } catch (err) {
        next({});
    }
});


usersRouter.post('/resendOtp/vendor', async (req, res, next) => {

});


usersRouter.post('/resendOtp/admin', async (req, res, next) => {

});





module.exports = usersRouter;