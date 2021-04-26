const { defaults } = require('argon2');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const vendorDetailsService = require('../services/vendorDetailsService');
const { ErrorBody } = require('../utils/ErrorBody');
const { deleteFileFromPrivateSpace, createSignedURL } = require('../utils/fileUpload');




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
            const record = await vendorDetailsService.getVendorDetailsRecord(filters, null, { lean: true });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Successfully retrieved status.', error: false, data: { isAvailable: record ? false : true } });
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
            const record = await vendorDetailsService.getVendorDetailsRecord(filters, null, { lean: true });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Successfully retrieved status.', error: false, data: { isAvailable: record ? false : true } });
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
            var filters = { vendor_id: vendorId };
            var updateQuery = { store_name: storeName };
            const record = await vendorDetailsService.updateVendorDetails(filters, updateQuery, { lean: true });
            var response = { message: 'No record found.', error: true, data: {} };
            if (record) {
                response = { message: 'Successfully updated store name.', error: false, data: {} };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
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
            var filters = { vendor_id: vendorId };
            var updateQuery = { company_address: companyAddress };
            const record = await vendorDetailsService.updateVendorDetails(filters, updateQuery, { lean: true, new: true });
            var response = { message: 'No record found.', error: true, data: {} };
            if (record) {
                response = { message: 'Successfully updated company address.', error: false, data: record };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
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
        const record = await vendorDetailsService.getVendorDetailsRecord(filters, null, { lean: true });
        var response = { message: 'No record found.', error: true, data: {} };
        if (record) {
            response = { message: 'Successfully retrieved vendor details.', error: false, data: record };
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
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
            var filters = { vendor_id: vendorId };
            var updateQuery = {
                tax_details: {
                    state: state,
                    seller_name: sellerName,
                    GST_number: gstNumber,
                    PAN_number: panNumber
                },
                'status_list.is_tax_details_collected': true
            };
            const record = await vendorDetailsService.updateVendorDetails(filters, updateQuery, { lean: true });
            var response = { message: 'No record found.', error: true, data: {} };
            if (record) {
                response = { message: 'Successfully updated tax details.', error: false, data: {} };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}


/**
 *  Update GST Exempted status.
 */

exports.updateGstExemptedStatus = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var isGstExempted = req.body.isGstExempted;
            var vendorId = req.user.id;
            var filters = { vendor_id: vendorId };
            var updateQuery = {
                'tax_details.is_GST_exempted': isGstExempted,
                'status_list.is_tax_details_collected': true
            };
            const record = await vendorDetailsService.updateVendorDetails(filters, updateQuery, { lean: true });
            var response = { message: 'No record found.', error: true, data: {} };
            if (record) {
                response = { message: 'Successfully updated tax details.', error: false, data: {} };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
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
        const record = await vendorDetailsService.getVendorDetailsRecord({ _id: vendorId }, null, { lean: true });
        var response = { message: 'No record found.', error: true, data: {} };
        if (record) {
            response = { message: 'Successfully retrieved status.', error: false, data: { statusList: record.status_list } };
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
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
            var filters = { vendor_id: vendorId };
            var updateQuery = {
                company_address: companyAddress,
                store_name: storeName,
                shipping_method: shippingMethod,
                'status_list.is_seller_info_collected': true
            };
            const record = await vendorDetailsService.updateVendorDetails(filters, updateQuery, { lean: true });
            var response = { message: 'No record found.', error: true, data: {} };
            if (record) {
                response = { message: 'Successfully updated seller details.', error: false, data: {} };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
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
            var filters = { vendor_id: vendorId };
            var updateQuery = {
                shipping_fee: shippingFee
            };
            const record = await vendorDetailsService.updateVendorDetails(filters, updateQuery, { lean: true });
            var response = { message: 'No record found.', error: true, data: {} };
            if (record) {
                response = { message: 'Successfully updated shipping fee.', error: false, data: {} };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
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
            var filters = { vendor_id: vendorId };
            var updateQuery = {
                bank_account_details: bankAccountDetails
            };
            const record = await vendorDetailsService.updateVendorDetails(filters, updateQuery, { lean: true });
            var response = { message: 'No record found.', error: true, data: {} };
            if (record) {
                response = { message: 'Successfully updated bank account details.', error: false, data: {} };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
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
            var filters = { vendor_id: vendorId };
            var updateQuery = {
                product_tax_code: productTaxCode
            };
            const record = await vendorDetailsService.updateVendorDetails(filters, updateQuery, { lean: true });
            var response = { message: 'No record found.', error: true, data: {} };
            if (record) {
                response = { message: 'Successfully updated product tax code.', error: false, data: {} };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}


/**
 * Signature Upload
 */

exports.updateSignature = async (req, res, next) => {
    try {
        var image = req.file;
        if (!image) {
            return next(new ErrorBody(400, "Bad Inputs", []));
        }
        else {
            var vendorId = req.user.id;
            var filters = { vendor_id: vendorId };
            var updateQuery = {
                signature_file_name: image.key
            };
            const record = await vendorDetailsService.updateVendorDetails(filters, updateQuery, { lean: true });
            // findOneAndUpdate() will return original record unless passsed option {new : true}
            var response = { message: 'No record found.', error: true, data: {} };
            if (record) {
                response = { message: 'Successfully updated signature.', error: false, data: {} };
                if (record.signature_file_name) {
                    try {
                        let fileName = record.signature_file_name;
                        await deleteFileFromPrivateSpace(fileName);
                    } catch (error) {
                        // nothing to do
                    }
                }
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        if (image && image.key) {
            try {
                await deleteFileFromPrivateSpace(image.key);
            } catch (error) {
                // nothing to do
            }
        }
        next({});
    }
}


/**
 * Get vendor signature
 */

exports.getMySignature = async (req, res, next) => {
    try {
        var vendorId = req.user.id;
        var filters = { vendor_id: vendorId };
        const record = await vendorDetailsService.getVendorDetailsRecord(filters, null, { lean: true });
        var response = { message: 'No image found.', error: true, data: {} };
        if (record && record.signature_file_name) {
            let fileName = record.signature_file_name;
            var imageUrl = await createSignedURL(fileName);
            response = { message: 'Successfully retrieved image URL.', error: false, data: { imageUrl: imageUrl } };
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    } catch (error) {
        next({});
    }
}


/**
 *  Vendor file upload
 */

exports.updateSellerFile = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        var image = req.file;
        if (!errors.isEmpty()) {
            if (image && image.key) {
                try {
                    await deleteFileFromPrivateSpace(image.key);
                } catch (error) {
                    // nothing to do
                }
            }
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            if (!image) {
                return next(new ErrorBody(400, "Bad Inputs", []));
            }
            else {
                var vendorId = req.user.id;
                var docName = req.body.docName;
                var uploadedDocType = '';
                switch (docName) {
                    case 'foodLicense': uploadedDocType = 'food_license_file_name'; break;
                    case 'gstLicense': uploadedDocType = 'GST_license_file_name'; break;
                    case 'shopLicense': uploadedDocType = 'shop_license_file_name'; break;
                    case 'blankCheque': uploadedDocType = 'blank_cheque_file_name'; break;
                    default: uploadedDocType = '';
                }
                var filters = { vendor_id: vendorId };
                var updateQuery = (uploadedDocType !== '') ? { [uploadedDocType]: image.key } : {};
                const record = await vendorDetailsService.updateVendorDetails(filters, updateQuery, { lean: true });
                // findOneAndUpdate() will return original record unless passsed option {new : true}
                var response = { message: 'No record found.', error: true, data: {} };
                if (record) {
                    response = { message: 'Successfully updated document.', error: false, data: {} };
                    if (uploadedDocType !== '' && record[uploadedDocType]) {
                        try {
                            let fileName = record[uploadedDocType];
                            await deleteFileFromPrivateSpace(fileName);
                        } catch (error) {
                            // nothing to do
                        }
                    }
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }
        }
    } catch (error) {
        // console.log(error);
        if (image && image.key) {
            try {
                await deleteFileFromPrivateSpace(image.key);
            } catch (error) {
                // nothing to do
            }
        }
        next({});
    }
}


/**
 * Get file document
 */

exports.getMyFile = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }
        else {
            var vendorId = req.user.id;
            var docName = req.query.docName;
            var reqDocType = '';
            switch (docName) {
                case 'foodLicense': reqDocType = 'food_license_file_name'; break;
                case 'gstLicense': reqDocType = 'GST_license_file_name'; break;
                case 'shopLicense': reqDocType = 'shop_license_file_name'; break;
                case 'blankCheque': reqDocType = 'blank_cheque_file_name'; break;
                default: reqDocType = '';
            }
            var filters = { vendor_id: vendorId };
            const record = await vendorDetailsService.getVendorDetailsRecord(filters, null, { lean: true });
            var response = { message: 'No File found.', error: true, data: {} };
            if ((reqDocType !== '') && record[reqDocType]) {
                let fileName = record[reqDocType];
                var fileUrl = await createSignedURL(fileName);
                response = { message: 'Successfully retrieved File URL.', error: false, data: { fileUrl: fileUrl } };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}


/**
 * request Admin approval
 */

exports.requestAdminApproval = async (req, res, next) => {
    try {
        var vendorId = req.user.id;
        let filters = { vendor_id: vendorId };
        let updateQuery = {
            account_status: 'Pending'
        }
        const result = await vendorDetailsService.updateVendorDetails(filters, updateQuery, { lean: true });
        var response = { message: 'No record found.', error: true, data: {} };
        if (result) {
            response = { message: 'Your request has been successfully submitted.', error: false, data: {} };
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    } catch (error) {
        next({});
    }
}


/**
 *  Approve vendor
 */

exports.approveVendor = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }
        else {
            var vendorId = mongoose.Types.ObjectId(req.body.vendorId);
            let filters = { vendor_id: vendorId };
            let updateQuery = {
                account_status: 'Approved'
            }
            const result = await vendorDetailsService.updateVendorDetails(filters, updateQuery, { lean: true });
            var response = { message: 'No record found.', error: true, data: {} };
            if (result) {
                response = { message: 'Successfully activated vendor account.', error: false, data: {} };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}


/**
 * request for brand approval.
 */

exports.requestBrandApproval = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.files) {
                await vendorDetailsService.privateFilesBulkDelete(req.files);
            }
            next(new ErrorBody(400, "Bad Inputs", errors.array()));
        }
        else {
            var vendorId = req.user.id;
            var brandName = req.body.brandName;
            var brandFileNames = [];
            for (let file of req.files) {
                brandFileNames.push(file.key);
            }
            let filters = { vendor_id: vendorId };
            let updateQuery = {
                'brand_details.brand_file_name': brandFileNames,
                'brand_details.brand_name': brandName,
                'brand_status': 'Pending'
            }
            const result = await vendorDetailsService.updateVendorDetails(filters, updateQuery, { lean: true });
            var response = { message: 'No record found.', error: true, data: {} };
            if (result) {
                response = { message: 'Your request has been successfully submitted.', error: false, data: {} };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        if (req.files) {
            await vendorDetailsService.privateFilesBulkDelete(req.files);
        }
        next({});
    }
}


/**
 *  Approve Brand
 */

exports.approveVendorBrand = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }
        else {
            var vendorId = mongoose.Types.ObjectId(req.body.vendorId);
            let filters = { vendor_id: vendorId };
            let updateQuery = {
                brand_status: 'Approved'
            }
            const result = await vendorDetailsService.updateVendorDetails(filters, updateQuery, { lean: true });
            var response = { message: 'No record found.', error: true, data: {} };
            if (result) {
                response = { message: 'Successfully approved vendor brand.', error: false, data: {} };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}


