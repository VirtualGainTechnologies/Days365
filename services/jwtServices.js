const { refreshTokenModel } = require("../models/refreshTokenModel");
const jwt = require('jsonwebtoken');
const chalk = require("chalk");
require('dotenv').config();


/**
 * Sign Access Token
 */

async function generateAccessToken(key, callback) {
    return new Promise(async (resolve, reject) => {
        const jwtSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
        jwt.sign({ key: key }, jwtSecret, { expiresIn: 1800 }, async (err, accessToken) => {
            if (err || !accessToken) {
                return callback ? callback(new Error("Error.")) : reject(new Error("Error"));
            }
            else {
                return callback ? callback(null, accessToken) : resolve(accessToken);
            }
        });
    });
}


/**
 * Sign Refresh Token
 */

async function generateRefreshToken(key, callback) {
    return new Promise(async (resolve, reject) => {
        const jwtSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
        jwt.sign({ key: key }, jwtSecret, { expiresIn: "2 days" }, async (err, refreshToken) => {
            if (err || !refreshToken) {
                return callback ? callback(new Error("Error.")) : reject(new Error("Error"));
            }
            else {
                return callback ? callback(null, refreshToken) : resolve(refreshToken);
            }
        });
    });
}


/**
 * Generate tokens
 */

async function generateTokens(key, callback) {
    return new Promise(async (resolve, reject) => {
        Promise.all([generateRefreshToken(key), generateAccessToken(key)])
            .then(async (keys) => {
                let data = { refreshToken: keys[0], accessToken: keys[1] };
                return callback ? callback(null, data) : resolve(data);
            }).catch((err) => {
                return callback ? callback(err) : reject(err);
            });
    });
}


/**
 * Update Tokens
 */

// async function updateTokens(tokens, callback) {
//     return new Promise(async (resolve, reject) => {
//         try {

//         }
//         catch (err) {
//             return callback ? callback(err) : reject(err);
//         }
//     });
// }


/**
 * Verify Access Token
 */


async function verifyAccessToken(token, options, callback) {
    return new Promise(async (resolve, reject) => {
        const jwtSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
        jwt.verify(token, jwtSecret, options, async (err, decoded) => {
            if (err) {
                return callback ? callback(err) : reject(err);
            }
            else {
                return callback ? callback(null, decoded) : resolve(decoded);
            }
        });
    });
}


/**
 * Verify Refresh Token
 */

async function verifyRefreshToken(token, callback) {
    return new Promise(async (resolve, reject) => {
        const jwtSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
        jwt.verify(token, jwtSecret, async (err, decoded) => {
            if (err) {
                return callback ? callback(err) : reject(err);
            }
            else {
                return callback ? callback(null, decoded) : resolve(decoded);
            }
        });
    });
}






module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateTokens,
    verifyAccessToken,
    verifyRefreshToken
};