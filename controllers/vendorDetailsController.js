const { validationResult } = require('express-validator');
const vendorDetailsService = require('../services/vendorDetailsService');
const { ErrorBody } = require('../utils/ErrorBody');






/**
 *  check company name is availble or not.
 */

exports.isCompanyNameAvailable = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var companyName = req.query.companyName;
            var filters = { company_name: companyName };
            const record = await vendorDetailsService.getVendorDetailsRecord(filters);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Successfully retrieved status.', error: false, data: { isAvaliable: record ? false : true } });
        }
    } catch (error) {
        next({});
    }
}


/**
 *  Create vendor details record.
 */

exports.createVendorRecord = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var companyName = req.body.companyName;
            var vendorId = req.user.id;
            var reqBody = {
                vendor_id: vendorId,
                company_name: companyName
            }
            const record = await vendorDetailsService.createVendorDetailsRecord(reqBody);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Successfully created vendor details record.', error: false, data: record });
        }
    } catch (error) {
        next({});
    }
}


/**
 *  check store name is availble or not.
 */

exports.isStoreNameAvailable = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var storeName = req.query.storeName;
            var filters = { store_name: storeName };
            const record = await vendorDetailsService.getVendorDetailsRecord(filters);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Successfully retrieved status.', error: false, data: { isAvaliable: record ? false : true } });
        }
    } catch (error) {
        next({});
    }
}


/**
 *  Add/Update store name
 */

exports.updateStoreName = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var storeName = req.body.storeName;
            var vendorId = req.user.id;
            var updateQuery = { store_name: storeName };
            const record = await vendorDetailsService.updateVendorDetails(vendorId, updateQuery);
            var response = { message: 'No record found.', error: true, data: {} };
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            if (record) {
                response = { message: 'Successfully updated store name.', error: false, data: record };
            }
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}



/**
 *  Add/Update company address
 */

exports.updateCompanyAddress = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var companyAddress = req.body.companyAddress;
            var vendorId = req.user.id;
            var updateQuery = { company_address: companyAddress };
            const record = await vendorDetailsService.updateVendorDetails(vendorId, updateQuery);
            var response = { message: 'No record found.', error: true, data: {} };
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            if (record) {
                response = { message: 'Successfully updated company address.', error: false, data: record };
            }
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}


/**
 *  Get details of vendor.
 */

exports.getVendorDetails = async (req, res, next) => {
    try {
        var vendorId = req.user.id;
        var filters = { vendor_id: vendorId };
        const record = await vendorDetailsService.getVendorDetailsRecord(filters);
        var response = { message: 'No record found.', error: true, data: {} };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        if (record) {
            response = { message: 'Successfully retrieved status record.', error: false, data: record };
        }
        res.json(response);
    } catch (error) {
        next({});
    }
}