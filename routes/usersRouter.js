const express = require('express');
const usersRouter = express.Router();
const { verifyPassword, encryptPassword } = require('../services/loginService');
const { adminRegisterModel } = require('../models/adminRegister');
const { vendorRegisterModel } = require('../models/vendorRegister');
const { UserRegisterModel } = require('../models/userRegister');
const chalk = require('chalk');




/** 
 * validate Email
 */

async function verifyEmail(email) {
    const regEx = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return await regEx.test(email);
}


/** 
 * Sign up users
 */

usersRouter.post('/signup/user', async (req, res, next) => {
    try {
        var data = req.body;
        var username = data.username.trim().toLowerCase();
        var email = data.email.trim().toLowerCase();
        if (!await verifyEmail(email)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({ message: 'Please provide a valid email.', error: true, data: {} });
        }
        await UserRegisterModel.find({ $or: [{ username: username }, { email: email }] }, async (err, users) => {
            if (err) {
                next(err);
            }
            else if (users.length) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: 'User Already Exists.', error: true, data: {} });
            }
            else {
                await encryptPassword(data.password, async (err, hash) => {
                    if (err) {
                        next(err);
                    }
                    else {
                        var user = new UserRegisterModel();
                        user.username = username;
                        user.email = email;
                        user.hash = hash;
                        user.firstname = data.firstname;
                        user.lastname = data.lastname;

                        await user.save(async (err, user) => {
                            if (err) {
                                next(err);
                            }
                            else {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ message: 'User Successfully registered.', error: false, data: {} });
                            }
                        });
                    }
                });
            }
        });

    } catch (err) {
        next(err);
    }
});


usersRouter.post('/signup/vendor', async (req, res, next) => {

});


usersRouter.post('/signup/admin', async (req, res, next) => {

});




/**
 *Login up users
 */

usersRouter.post('/signin/user', async (req, res, next) => {
    try {
        var username = req.body.username.trim().toLowerCase();
        var password = req.body.password;
        var filter = {};
        if (await verifyEmail(username)) {
            filter = { email: username };
        }
        else {
            filter = { username: username };
        }
        console.log(filter);
        await UserRegisterModel.findOne(filter, async (err, user) => {
            if (err) {
                next(err);
            }
            else if (!user) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: 'Invalid username or email.', error: true, data: {} });
            }
            else {
                await verifyPassword(user.hash, password, async (err, flag) => {
                    if (err) {
                        next(err);
                    }
                    else if (flag) {
                        let response = {
                            token: "Will add later",
                            username: user.username,
                            firstname: user.firstname,
                            lastname: user.lastname
                        }
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ message: 'Login Successful.', error: false, data: response });
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
        next(err);
    }


});


usersRouter.post('/signin/vendor', async (req, res, next) => {

});


usersRouter.post('/signin/admin', async (req, res, next) => {

});








module.exports = usersRouter;