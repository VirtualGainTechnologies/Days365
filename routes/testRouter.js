const express = require('express');
const testRouter = express.Router();

testRouter.route('/')
    .get(async (req, res, next) => {
        console.log("hai");
        res.json({ Status: "Success" });
    });



module.exports = testRouter;