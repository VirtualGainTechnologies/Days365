const { validationResult } = require('express-validator');
const signoutService = require('../services/signoutService');
const { ErrorBody } = require('../utils/ErrorBody');
const { compareUserAgents } = require('../services/commonAccountService');




exports.signoutUser = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Request", errors.array()));
        }
        else {
            var userId = req.user.id;
            var oldRefreshToken = req.body.refreshToken;
            var useragent = req.useragent;
            const record = await signoutService.getRefreshTokenRecord(userId);
            if (!record) {
                next(new ErrorBody(401, "Unauthorized", []));
            }
            else {
                var refreshTokens = record.refresh_tokens, tokenIndex = -1;
                for (let i in refreshTokens) {
                    let isEqual = await compareUserAgents(refreshTokens[i].useragent, useragent);
                    if ((isEqual) && (refreshTokens[i].refresh_token === oldRefreshToken)) {
                        tokenIndex = i;
                        break;
                    }
                }
                if (tokenIndex === -1) {
                    next(new ErrorBody(401, "Unauthorized", []));
                }
                else {
                    refreshTokens.splice(tokenIndex, 1);
                    record.refresh_tokens = refreshTokens;
                    await record.save();
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'Signout Successful.', error: false, data: {} });
                }
            }
        }
    } catch (error) {
        next({});
    }
}


exports.signoutFromAllDevices = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Request", errors.array()));
        }
        else {
            var userId = req.user.id;
            var updateQuery = { refresh_tokens: [] };
            const record = await signoutService.updateRefreshTokenRecord(userId, updateQuery);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Signout Successful.', error: false, data: {} });
        }
    } catch (error) {
        next({});
    }
}
