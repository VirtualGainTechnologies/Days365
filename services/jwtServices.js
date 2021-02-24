const { refreshTokenModel } = require("../models/refreshTokenModel");
const jwt = require('jsonwebtoken');
require('dotenv').config();


/**
 * sign Access Token
 */

async function generateAccessToken(key, callback) {
    return new Promise(async (resolve, reject) => {
        const jwtSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
        await jwt.sign({ key: key }, jwtSecret, { expiresIn: 600 }, async (err, accessToken) => {
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
 * sign Refresh Token
 */

async function generateRefreshToken(key, callback) {
    return new Promise(async (resolve, reject) => {
        const jwtSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
        await jwt.sign({ key: key }, jwtSecret, { expiresIn: "2 days" }, async (err, refreshToken) => {
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
 * generate tokens
 */

async function generateTokens(key, callback) {
    return new Promise(async (resolve, reject) => {
        await Promise.all([generateRefreshToken(key), generateAccessToken(key)])
            .then(async (keys) => {
                let data = { refreshToken: keys[0], accessToken: keys[1] };
                return callback ? callback(null, data) : resolve(data);
            }).catch((err) => {
                return callback ? callback(err) : reject(err);
            });
    });
}


/**
 * update tokens
 */

async function updateTokens(tokens, callback) {
    return new Promise(async (resolve, reject) => {
        try {
            const key = await verifyRefreshToken(tokens.refreshToken);

        }
        catch (err) {
            return callback ? callback(err) : reject(err);
        }
    });
}


/**
 * Verify Access Token
 */


async function verifyAccessToken(token) {

}


/**
 * Verify Refresh Token
 */

async function verifyRefreshToken(token) {

}


module.exports = { generateAccessToken, generateRefreshToken, updateTokens, generateTokens };