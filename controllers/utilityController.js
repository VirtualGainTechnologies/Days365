const utilityService = require('../services/utilityService');
const { validationResult } = require('express-validator');
const { ErrorBody } = require('../utils/ErrorBody');
const mongoose = require('mongoose');



/**
 *  Add product tax codes
 */

exports.addProductTaxcodes = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }
        else {
            var utilityName = req.body.utilityName;
            var utilityData = req.body.utilityData;
            var reqBody = {
                utility_name: utilityName,
                utility_data: utilityData
            }
            const result = await utilityService.createUtilityRecord(reqBody);
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Utility Successfully created.', error: false, data: result });
        }
    } catch (error) {
        next({});
    }
}


/**
 *  Get utility doc
 */

exports.getUtilityDocument = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }
        else {
            var utilityName = req.query.utilityName;
            var filters = {
                utility_name: utilityName
            }
            const result = await utilityService.getUtilityRecord(filters);
            var response = { message: 'No record found.', error: true, data: {} };
            if (result) {
                response = { message: 'Utility document Successfully retrieved.', error: false, data: result };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}
