const { adminRegisterModel } = require('./models/adminRegister');
const { UserRegisterModel } = require('./models/userRegister');
const { vendorRegisterModel } = require('./models/vendorRegister');
const { verifyAccessToken, verifyRefreshToken } = require('./services/jwtServices');
const createError = require('http-errors');


/**
 * Get Token From Headers
 */

async function getTokenFromHeaders(req) {
    return new Promise(async (resolve, reject) => {
        const { headers: { authorization } } = req;
        if (authorization && authorization.split(' ')[0] === "Bearer") {
            return resolve(authorization.split(' ')[1]);
        }
        return reject(createError(401, "Invalid Header"));
    });
}


/**
 * Jwt access Token middleware, token in header.
 */

async function verifyAccessJwt(req, res, next) {
    try {
        //Extract Token
        const accessToken = await getTokenFromHeaders(req);
        await verifyAccessToken(accessToken, async (err, decoded) => {
            if (err) {
                return next(createError(401, "Access-Token expired"));
            }
            else {
                // console.log(decoded);
                req['user'] = { id: decoded.key };
                return next();
            }
        });
    }
    catch (err) {
        return next(err);
    }
}


/**
 * Jwt refresh Token middleware, token in body.
 */

async function verifyRefreshJwt(req, res, next) {
    try {
        //Extract Tokens
        const refreshToken = req.body.refreshToken;
        await verifyRefreshToken(refreshToken, async (err, decoded) => {
            if (err) {
                return next(createError(401, "Refresh-Token expired"));
            }
            else {
                // console.log(decoded);
                req['user'] = { id: decoded.key };
                return next();
            }
        });
    }
    catch (err) {
        return next(createError(400, "No token found in the body."));
    }
}


/**
 * Verify User
 */

async function verifyUser() {

}


/**
 * Verify Admin
 */

async function verifyAdmin() {

}


/**
 * verify Vendor
 */

async function verifyVendor() {

}



module.exports = { verifyAccessJwt, verifyRefreshJwt, verifyUser, verifyAdmin, verifyVendor };