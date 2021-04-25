const productService = require('../services/productService');
const { validationResult } = require('express-validator');
const { ErrorBody } = require('../utils/ErrorBody');
const mongoose = require('mongoose');




/**
 *  Add a product
 */

exports.addProduct = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.files) {
                await productService.filesBulkDelete(req.files);
            }
            return next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }
        else {
            var data = req.body;
            var vendorId = mongoose.Types.ObjectId(req.user.id);
            var title = data.title;
            var categoryId = mongoose.Types.ObjectId(data.categoryId);
            var keyWords = data.keyWords;
            var productVariants = data.productVariants;
            var fileIndex = data.fileIndex;
            var brandName = data.brandName;
            var tempBrandName = brandName.toLowerCase();
            const flag = await productService.validateVariantData(productVariants);
            if (!flag || (fileIndex.length !== productVariants.length)) {
                if (req.files) {
                    await productService.filesBulkDelete(req.files);
                }
                return next(new ErrorBody(400, 'Bad Inputs', []));
            }
            const vendorRecord = await productService.getVendorRecord({ vendor_id: vendorId });
            const categoryRecord = await productService.getCategoryRecord(categoryId);
            if ((!vendorRecord) || (!categoryRecord) || (vendorRecord.account_status !== 'Approved') || ((tempBrandName !== "generic") && (vendorRecord.brand_status !== 'Approved' || brandName !== vendorRecord.brand_details.brand_name))) {
                if (req.files) {
                    await productService.filesBulkDelete(req.files);
                }
                return next(new ErrorBody(400, 'Bad Inputs', []));
            }
            var categoryAncestors = await categoryRecord.getAncestors();
            var categoryPath = await productService.createCategoryPath(categoryAncestors);
            categoryPath += "/" + categoryRecord.category_name;
            const formattedProductVariants = await productService.formatProductVariants(productVariants, req.files, fileIndex);
            var reqBody = {
                vendor_id: vendorId,
                title: title,
                category_path: categoryPath,
                category_id: categoryRecord._id,
                key_words: keyWords,
                brand_name: tempBrandName === 'generic' ? "Generic" : brandName,
                variants: formattedProductVariants,
                status: 'Pending',
                'customer_rating.total_rating': 0
            }
            const result = await productService.createProduct(reqBody);
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Successfully added product', error: false, data: result });
        }
    } catch (error) {
        // console.log(error);
        if (req.files) {
            await productService.filesBulkDelete(req.files);
        }
        next({});
    }
}


/**
 * Add product by referring. // TO DO : need to consider product bill file upload
 */

exports.addProductByReference = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.files) {
                await productService.filesBulkDelete(req.files);
            }
            return next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }
        else {
            var data = req.body;
            var vendorId = mongoose.Types.ObjectId(req.user.id);
            var productId = mongoose.Types.ObjectId(data.productId);
            var productVariants = data.productVariants;
            var fileIndex = data.fileIndex;
            const flag = await productService.validateVariantData(productVariants);
            if (!flag || (fileIndex.length !== productVariants.length)) {
                if (req.files) {
                    await productService.filesBulkDelete(req.files);
                }
                return next(new ErrorBody(400, 'Bad Inputs', []));
            }
            const vendorRecord = await productService.getVendorRecord({ vendor_id: vendorId });
            const productRecord = await productService.getProductWithFilters({ _id: productId, status: 'Active' });
            if ((!vendorRecord) || (!productRecord) || (vendorRecord.account_status !== 'Approved') || (vendorId === productRecord.vendor_id) || ((productRecord.brand_name !== 'Generic') && (vendorRecord.brand_status !== 'Approved' || productRecord.brand_name !== vendorRecord.brand_details.brand_name))) {
                if (req.files) {
                    await productService.filesBulkDelete(req.files);
                }
                return next(new ErrorBody(400, 'Bad Inputs', []));
            }
            const formattedProductVariants = await productService.formatProductVariants(productVariants, req.files, fileIndex);
            var reqBody = {
                vendor_id: vendorId,
                title: productRecord.title,
                category_path: productRecord.category_path,
                category_id: productRecord.category_id,
                key_words: productRecord.key_words,
                brand_name: productRecord.brand_name,
                variants: formattedProductVariants,
                status: 'Pending',
                reference_id: productRecord.reference_id ? productRecord.reference_id : productRecord._id,
                'customer_rating.total_rating': 0
            }
            const result = await productService.createProduct(reqBody);
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Successfully added product', error: false, data: result });
        }
    } catch (error) {
        if (req.files) {
            await productService.filesBulkDelete(req.files);
        }
        next({});
    }
}


/**
 * Get active prouduct by id
 */

exports.getActiveProductById = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }
        else {
            var id = mongoose.Types.ObjectId(req.query.id);
            const result = await productService.getActiveProductRecordById(id);
            var response = { message: "No record found.", error: true, data: {} };
            if (result) {
                response = { message: "Successfully retrieved product.", error: false, data: result };
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
 * Get versions of sellers selling same product
 */

exports.getProductSellers = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }
        else {
            var id = mongoose.Types.ObjectId(req.query.id);
            let options = {
                id: id
            };
            const result = await productService.getProductSellers(options);
            var response = { message: "No record found.", error: true, data: {} };
            if (result) {
                response = { message: "Successfully retrieved products.", error: false, data: result };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        next({});
    }
}