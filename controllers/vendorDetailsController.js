const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
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
                company_name: companyName,
                'status_list.is_mobile_verified': true
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
            let state = req.body.state;
            let pincode = req.body.pincode;
            let city = req.body.city;
            let addressLine1 = req.body.addressLine1;
            let addressLine2 = req.body.addressLine2;
            var companyAddress = {
                state: state,
                pincode: pincode,
                city: city
            };
            if (addressLine1) {
                companyAddress["address_line1"] = addressLine1;
            }
            if (addressLine2) {
                companyAddress["address_line2"] = addressLine2;
            }
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
            response = { message: 'Successfully retrieved vendor details.', error: false, data: record };
        }
        res.json(response);
    } catch (error) {
        next({});
    }
}


/**
 * Add or Update tax details
 */

exports.updateTaxDetails = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var gstNumber = req.body.gstNumber;
            var state = req.body.state;
            var panNumber = req.body.panNumber;
            var sellerName = req.body.sellerName;
            var vendorId = req.user.id;
            var updateQuery = {
                tax_details: {
                    state: state,
                    seller_name: sellerName,
                    GST_number: gstNumber,
                    PAN_number: panNumber
                },
                'status_list.is_tax_details_collected': true
            };
            const record = await vendorDetailsService.updateVendorDetails(vendorId, updateQuery);
            var response = { message: 'No record found.', error: true, data: {} };
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            if (record) {
                response = { message: 'Successfully updated tax details.', error: false, data: {} };
            }
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}


/**
 *  Get status of detail collection pahses.
 */

exports.getStatus = async (req, res, next) => {
    try {
        var vendorId = mongoose.Types.ObjectId(req.user.id);
        const record = await vendorDetailsService.getVendorDetailsRecord({ _id: vendorId });
        var response = { message: 'No record found.', error: true, data: {} };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        if (record) {
            response = { message: 'Successfully retrieved status.', error: false, data: { statusList: record.status_list } };
        }
        res.json(response);
    } catch (error) {
        next({});
    }
}


/**
 * Update seller details
 */

exports.updateSellerInfo = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            let storeName = req.body.storeName;
            let shippingMethod = req.body.shippingMethod;
            let state = req.body.state;
            let pincode = req.body.pincode;
            let city = req.body.city;
            let addressLine1 = req.body.addressLine1;
            let addressLine2 = req.body.addressLine2;
            var companyAddress = {
                state: state,
                pincode: pincode,
                city: city
            };
            if (addressLine1) {
                companyAddress["address_line1"] = addressLine1;
            }
            if (addressLine2) {
                companyAddress["address_line2"] = addressLine2;
            }
            var vendorId = req.user.id;
            var updateQuery = {
                company_address: companyAddress,
                store_name: storeName,
                shipping_method: shippingMethod,
                'status_list.is_seller_info_collected': true
            };
            const record = await vendorDetailsService.updateVendorDetails(vendorId, updateQuery);
            var response = { message: 'No record found.', error: true, data: {} };
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            if (record) {
                response = { message: 'Successfully updated seller details.', error: false, data: {} };
            }
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}


/**
 * Update Shipping Fee
 */

exports.updateShippingFee = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var shippingFee = req.body.shippingFee;
            var vendorId = req.user.id;
            var updateQuery = {
                shipping_fee: shippingFee
            };
            const record = await vendorDetailsService.updateVendorDetails(vendorId, updateQuery);
            var response = { message: 'No record found.', error: true, data: {} };
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            if (record) {
                response = { message: 'Successfully updated shipping fee.', error: false, data: {} };
            }
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}


/**
 *  Update Bank details
 */

exports.updateBankDetails = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var vendorId = req.user.id;
            let accountHolderName = req.body.accountHolderName;
            let accountType = req.body.accountType;
            let accountNumber = req.body.accountNumber;
            let ifscCode = req.body.ifscCode;
            var bankAccountDetails = {
                account_holder_name: accountHolderName,
                account_type: accountType,
                account_number: accountNumber
            }
            if (ifscCode) {
                bankAccountDetails["IFSC_code"] = ifscCode;
            }
            var updateQuery = {
                bank_account_details: bankAccountDetails
            };
            const record = await vendorDetailsService.updateVendorDetails(vendorId, updateQuery);
            var response = { message: 'No record found.', error: true, data: {} };
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            if (record) {
                response = { message: 'Successfully updated bank account details.', error: false, data: {} };
            }
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}


/**
 * Update product tax code
 */

exports.updateProductTaxCode = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var vendorId = req.user.id;
            var productTaxCode = req.body.productTaxCode;
            var updateQuery = {
                product_tax_code: productTaxCode
            };
            const record = await vendorDetailsService.updateVendorDetails(vendorId, updateQuery);
            var response = { message: 'No record found.', error: true, data: {} };
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            if (record) {
                response = { message: 'Successfully updated product tax code.', error: false, data: {} };
            }
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}