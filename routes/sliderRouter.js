const express = require('express');
const Router = express.Router();
const { verifyAccessToken, generateAccessToken, generateTokens } = require('../services/jwtServices');
const { verifyAccessJwt, verifyRefreshJwt } = require('../middleware');
const { userLogin } = require('../services/commonAccountService');
const { publicFileUpload, createBucket, } = require('../utils/fileUpload');
const { sliderModel } = require('../models/sliderModel');
const { response } = require('express');

Router.post('/', async function(req, res, next) {
    try {
        const sliderimage = new sliderModel({
            image: req.body.image
        })

        console.log(sliderimage);

        await sliderimage.save().then((result) => {
            console.log(user);
            var response = { 'message': 'Slider Image Submitted', 'error': 'false', 'data': result };
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.send(response);
        }).catch((err) => {
            var response = { 'message': 'Problem in inserting data', 'error': 'true', 'data': err };
            res.status(400);
            res.setHeader('Content-Type', 'application/json');
            res.send(response);
        })
    } catch (err) {
        next({});
    }
});

Router.get('/', async function(req, res, next) {
    try {
        await sliderModel.find().then((result) => {
            var response = { 'message': 'Images Found', 'error': 'false', 'data': result };
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.send(response);
        }).catch((err) => {
            var response = { 'message': 'No Images Found', 'error': 'true', 'data': err };
            res.status(400);
            res.setHeader('Content-Type', 'application/json');
            res.send(response);
        })
    } catch (err) {
        next({});
    }
});

module.exports = Router;