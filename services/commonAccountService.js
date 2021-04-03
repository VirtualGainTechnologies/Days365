const argon2 = require('argon2');
const { generateTokens } = require('./jwtServices');
const { refreshTokenModel } = require("../models/refreshTokenModel");
const chalk = require('chalk');
const { token } = require('morgan');
const createHttpError = require('http-errors');
const queryString = require('querystring');
const http = require('http');
require('dotenv').config();




/** 
 * Encrypt Password
 */

async function encryptPassword(password, callback) {
    return new Promise(async (resolve, reject) => {
        try {
            const hash = await argon2.hash(password);
            return callback ? callback(null, hash) : resolve(hash);
        }
        catch (err) {
            return callback ? callback(err, null) : reject(err);
        }
    });
}


/** 
 * Verify Password
 */

async function verifyPassword(hash, password, callback) {
    return new Promise(async (resolve, reject) => {
        try {
            var verified = false;
            if (await argon2.verify(hash, password)) {
                verified = true;
            }
            return callback ? callback(null, verified) : resolve(verified);
        }
        catch (err) {
            return callback ? callback(err, false) : reject(err);
        }
    });
}


/** 
 * Validate Email
 */

async function verifyEmail(email) {
    const regEx = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return await regEx.test(email);
}


/** 
 * Validate Mobile number (indian)
 */

async function verifyMobile(mobile) {
    const regEx = /^(\+?91)?([6-9][0-9]{9})$/;
    return await regEx.test(mobile);
}


/**
 * Verify user login
 */

async function isMobileOrEmail(loginCredential, callback) {
    return new Promise(async (resolve, reject) => {
        try {
            loginCredential = loginCredential.trim();
            var field = {
                isValid: false,
                type: "",
                value: ""
            };
            if (await verifyEmail(loginCredential)) {
                field.isValid = true;
                field.type = "EMAIL";
                field.value = loginCredential;
            }
            else {
                //transform data to a valid mobile number
                let number = loginCredential.replace(/\s/g, '');
                if (await verifyMobile(number)) {
                    field.isValid = true;
                    field.type = "MOBILE";
                    field.value = number.slice(-10);
                }
            }
            return callback ? callback(null, field) : resolve(field);
        }
        catch (err) {
            return callback ? callback(err) : reject(err);
        }
    });
}


/**
 * Verify useragent
 */

async function compareUserAgents(firstAgent, secondAgent) {
    return new Promise(async (resolve, reject) => {
        try {
            var isEqual = true;
            for (let key of Object.keys(firstAgent)) {
                if ((key === 'version') || (key === 'geoIp') || (key === 'source')) {
                    // console.log(chalk.yellow("hai"));
                    continue;
                }
                // console.log(key);
                if (firstAgent[key] !== secondAgent[key]) {
                    isEqual = false;
                    break;
                }
            }
            // console.log("done");
            return resolve(isEqual);
        }
        catch (err) {
            return reject(err);
        }
    });
}


/**
 * Generate Tokens and login user.
 */

async function userLogin(userId, useragent, callback) {
    return new Promise(async (resolve, reject) => {
        await generateTokens(userId, async (err, tokens) => {
            if (err) {
                return callback ? callback(err) : reject(err);
            }
            else {
                await refreshTokenModel.findOne({ user_id: userId }, async (err, record) => {
                    if (err) {
                        return callback ? callback(err) : reject(err);
                    }
                    else {
                        try {
                            var refreshTokenRecord;
                            if (record) {
                                refreshTokenRecord = new refreshTokenModel(record);
                            }
                            else {
                                refreshTokenRecord = new refreshTokenModel({ user_id: userId, refresh_tokens: [] });
                            }
                            var refreshTokens = refreshTokenRecord.refresh_tokens, tokenIndex = -1;
                            for (let i in refreshTokens) {
                                let isEqual = await compareUserAgents(refreshTokens[i].useragent, useragent);
                                if (isEqual) {
                                    tokenIndex = i;
                                    break;
                                }
                            }
                            let latestRefreshToken = {
                                refresh_token: tokens.refreshToken,
                                useragent: useragent
                            };
                            if (tokenIndex == -1) {
                                if (refreshTokens.length == 10) {  //Max 10 devices allowed to login simultaneously.
                                    refreshTokens.pop();
                                }
                                refreshTokens.unshift(latestRefreshToken);
                            }
                            else {
                                refreshTokens[tokenIndex] = latestRefreshToken;
                            }
                            refreshTokenRecord.refresh_tokens = refreshTokens;
                            await refreshTokenRecord.save((err, tokenRecord) => {
                                if (err) {
                                    return callback ? callback(err) : reject(err);
                                }
                                else {
                                    return callback ? callback(null, tokens) : resolve(tokens);
                                }
                            });
                        }
                        catch (err) {
                            return callback ? callback(err) : reject(err);
                        }
                    }
                });
            }
        });
    });
}






/**
 * Send OTP
 */

async function sendOTP(mobile, otp) {
    return new Promise(async (resolve, reject) => {
        const message = `Your OTP for Days365 is: ${otp}`;
        const authKey = process.env.OTP_AUTH_KEY;
        const senderId = process.env.OTP_SENDER_ID;

        var requestParams = queryString.stringify({ AUTH_KEY: authKey, message: message, senderId: senderId, routeId: 1, mobileNos: mobile, smsContentType: "english" });

        var path = "/rest/services/sendSMS/sendGroupSms?" + requestParams;
        var options = {
            "hostname": "msg.msgclub.net",
            "path": path,
            "method": "GET",
            "headers": {
                "Cache_Control": "no-cache"
            }
        }

        var sendOTP = await http.request(options, async (response) => {
            var chunks = [];
            response.on('data', async (chunk) => {
                chunks.push(chunk);
            });
            response.on('end', async () => {
                // console.log("End", chunks);
                var data = JSON.parse(await Buffer.concat(chunks).toString());
                // console.log(data);
                resolve(data);
            });
        });

        sendOTP.on('error', async (err) => {
            console.log(`problem with request: ${err.message}`);
            reject(err);
        });
        await sendOTP.end();
    });
}




module.exports = {
    encryptPassword,
    verifyPassword,
    verifyEmail,
    verifyMobile,
    isMobileOrEmail,
    userLogin,
    sendOTP,
    compareUserAgents
};

