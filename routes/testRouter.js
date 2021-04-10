const express = require('express');
const testRouter = express.Router();
const { verifyAccessToken } = require('../services/jwtServices');
const { verifyAccessJwt, verifyRefreshJwt } = require('../middleware');
const { compareUserAgents } = require('../services/commonAccountService');
const { publicFileUpload, createBucket, } = require('../utils/fileUpload');


testRouter.route('/image')
    .get(async (req, res, next) => {
        try {
            let a = await createBucket();
            // console.log(a);
            res.json({ status: "success" });
        } catch (error) {
            console.log(error);
            next({});
        }
    })
    // .post(publicFileUpload.single('signature'), (req, res, next) => {
    //     console.log(req.file);
    //     res.json({ status: "success" });
    // });


module.exports = testRouter;