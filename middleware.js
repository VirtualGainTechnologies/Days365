const { userRegisterModel } = require('./models/userRegister');
const { verifyAccessToken, verifyRefreshToken } = require('./services/jwtServices');
const { ErrorBody } = require('./utils/ErrorBody');

/**
 * Get Token From Headers
 */

async function getTokenFromHeaders(req) {
    return new Promise(async (resolve, reject) => {
        try {
            const { headers: { authorization } } = req;
            if (authorization && authorization.split(' ')[0] === "Bearer") {
                return resolve(authorization.split(' ')[1]);
            }
            else {
                return reject(new ErrorBody(401, "Invalid Header", []));
            }
        }
        catch (err) {
            return reject(new ErrorBody(401, "Invalid Header", []));
        }
    });
}


/**
 * Jwt access Token middleware, token in header.
 */

async function verifyAccessJwt(req, res, next) {
    try {
        //Extract Token
        const accessToken = await getTokenFromHeaders(req);
        await verifyAccessToken(accessToken, { ignoreExpiration: false }, async (err, decoded) => {
            if (err) {
                return next(new ErrorBody(401, "Access-Token expired", []));
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
 * Jwt refresh Token middleware, old refresh token in body and access token in header.
 */

async function verifyRefreshJwt(req, res, next) {
    try {
        //Extract Tokens
        const accessToken = await getTokenFromHeaders(req);
        const refreshToken = req.body.refreshToken;
        await verifyRefreshToken(refreshToken, async (err, refreshTokenDecoded) => {
            if (err) {
                return next(new ErrorBody(401, "Refresh-Token expired", []));
            }
            else {
                //Verify and decode Access Token and compare payloads.
                await verifyAccessToken(accessToken, { ignoreExpiration: true }, async (err, accessTokenDecoded) => {
                    if (err || (accessTokenDecoded.key !== refreshTokenDecoded.key)) {
                        return next(new ErrorBody(401, "Unauthorized", []));
                    }
                    else {
                        req['user'] = { id: refreshTokenDecoded.key };
                        return next();
                    }
                });
            }
        });
    }
    catch (err) {
        return next(err);
    }
}


/**
 * Verify User
 */

async function verifyUser(req, res, next) {
    try {
        var userId = req.user.id;
        await userRegisterModel.findById(userId, async (err, user) => {
            if (err) {
                return next({});
            }
            else if (!user || user.is_blocked) {
                return next(new ErrorBody(401, "Unauthorized", []));
            }
            else {
                return next();
            }
        });
    }
    catch (err) {
        return next({});
    }
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