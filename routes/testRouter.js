const express = require('express');
const testRouter = express.Router();
const { verifyAccessToken, generateAccessToken, generateTokens } = require('../services/jwtServices');
const { verifyAccessJwt, verifyRefreshJwt } = require('../middleware');
const { userLogin } = require('../services/commonAccountService');
const { publicFileUpload, createBucket, } = require('../utils/fileUpload');
const router = require('./productRouter');


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


testRouter.route('/')
    .get(async (req, res, next) => {
        try {
            // console.time('token');
            let useragent = req.useragent;
            let userId = req.query.userId;
            // console.timeEnd('token');
            res.json({ token: token });
        } catch (error) {
            console.log(error);
            next({});
        }
    })




module.exports = testRouter;