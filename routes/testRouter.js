const express = require('express');
const testRouter = express.Router();
const { verifyAccessToken } = require('../services/jwtServices');
const { verifyAccessJwt, verifyRefreshJwt } = require('../middleware');
const { compareUserAgents } = require('../services/commonAccountService');







testRouter.route('/')
    .get(verifyAccessJwt, async (req, res, next) => {
        // console.log(req.useragent);
        // console.log(await compareUserAgents(req.useragent, req.useragent));
        console.log(Date.now());
        res.json({ status: "success" });
    })
    .post(verifyRefreshJwt, async (req, res, next) => {
        console.log(Date.now());
        res.json({ status: "success" });
    });



module.exports = testRouter;