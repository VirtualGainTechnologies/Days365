const express = require('express');
const tokenRouter = express.Router();
const { refreshTokenModel } = require('../models/refreshTokenModel');
const { verifyRefreshJwt } = require('../middleware');
const { generateTokens } = require('../services/jwtServices');
const { compareUserAgents } = require('../services/commonAccountService');
const { ErrorBody } = require('../utils/ErrorBody');


/**
 * refresh token
 */

tokenRouter
    .post('/refresh', verifyRefreshJwt, async (req, res, next) => {
        var userId = req.user.id;
        var useragent = req.useragent;
        var oldRefreshToken = req.body.refreshToken;
        await refreshTokenModel.findOne({ userid: userId }, async (err, record) => {
            if (err) {
                next({});
            }
            else if (!record) {
                next(new ErrorBody(401, "Unauthorized", []));
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
                        return next(new ErrorBody(401, "Unauthorized", []));
                    }
                    await generateTokens(userId, async (err, tokens) => {
                        if (err) {
                            return next({});
                        }
                        else {
                            let latestRefreshToken = {
                                refresh_token: tokens.refreshToken,
                                useragent: useragent
                            };
                            refreshTokens[tokenIndex] = latestRefreshToken;
                            refreshTokenRecord.refresh_tokens = refreshTokens;
                            await refreshTokenRecord.save((err, tokenRecord) => {
                                if (err) {
                                    return next({});
                                }
                                else {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({ message: 'Token refreshed.', error: false, data: tokens });
                                }
                            });
                        }
                    });
                }
                catch (err) {
                    // console.log(err);
                    next({});
                }

            }
        });
    });



module.exports = tokenRouter;