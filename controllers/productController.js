/*********************************
CORE PACKAGES
**********************************/
const mongoose = require('mongoose');

/*********************************
MODULE PACKAGES
**********************************/
const productService = require('../services/productService');
const { validationResult } = require('express-validator');
const { ErrorBody } = require('../utils/ErrorBody');

/*********************************
GLOBAL FUNCTIONS
**********************************/

/*********************************
MODULE FUNCTION
**********************************/
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
            // const flag = await productService.validateVariantData(productVariants);
            // if (!flag || (fileIndex.length !== productVariants.length)) {
            //     if (req.files) {
            //         await productService.filesBulkDelete(req.files);
            //     }
            //     return next(new ErrorBody(400, 'Bad Inputs', []));
            // }

            const vendorRecord = await productService.getVendorRecord({ vendor_id: vendorId }, null, { lean: true });
            const categoryRecord = await productService.getCategoryRecord(categoryId);
    
            if ((!vendorRecord) || (!categoryRecord) || (vendorRecord.account_status !== 'Approved') || ((tempBrandName !== "generic") && (vendorRecord.brand_status !== 'Approved' || brandName !== vendorRecord.brand_details.brand_name))) {
                if (req.files) {
                    await productService.filesBulkDelete(req.files);
                }
                return next(new ErrorBody(400, 'Bad Inputs', []));
            }
            
            var categoryAncestors = await categoryRecord.getAncestors({}, { category_name: 1 }, { lean: true });
            var categoryPath = await productService.createCategoryPath(categoryAncestors);
            categoryPath += "/" + categoryRecord.category_name;
            // const formattedProductVariants = await productService.formatProductVariants(productVariants, req.files, fileIndex);
            const dayProductCode = await productService.formatProductVariants(null, req.files, fileIndex);
           
            var reqBody = {
                daysProductCode:dayProductCode,
                vendor_id: vendorId,
                title: title,
                category_path: categoryPath,
                category_id: categoryRecord._id,
                searchTerms: keyWords,
                brandName: tempBrandName === 'generic' ? "Generic" : brandName,

                productId: data.productId,
                productIdType: data.productIdType,
                countryOfOrigin: data.countryOfOrigin,
                manuFacturer:data.manuFacturer,
                color: data.color,
                minRecommendedAge:data.minRecommendedAge,
                isProductExpirable: data.isProductExpirable,
                condition: data.condition,
                conditionNote: data.conditionNote,
                salePrice:data.salePrice,
                yourPrice:data.yourPrice,
                maximumRetailPrice:data.maximumRetailPrice,
                handlingPeriod:data.handlingPeriod,
                productDescription:data.productDescription,
                bulletPoint: data.bulletPoint,
                searchTerms: data.searchTerms,
                targetAudience: data.targetAudience,
                shippingCharges:data.shippingCharges,
                shippingChargesAmt: data.shippingChargesAmt,
                // variants: formattedProductVariants,
                status: 'Pending',
               //'customer_rating.total_rating': 0
            }

            const result = await productService.createProduct(reqBody);
            console.log("Successfully Added Product");
            res.status(201).json({
                message: 'Successfully Added Product',
                error: false,
                data: result 
            });
        }
    } catch (error) {
        console.log(error);
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
            const vendorRecord = await productService.getVendorRecord({ vendor_id: vendorId }, null, { lean: true });
            const productRecord = await productService.getProductWithFilters({ _id: productId, status: 'Active' }, null, { lean: true });
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
                response = { message: "Successfully retrieved sellers.", error: false, data: result };
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
 * Getting All Pending Products list for Admin Approval
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 01/06/2021
 * @usedIn : Admin
 * @apiType : PUT
 * @lastModified : 01/06/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : status
 * @version : 1
 */

 exports.getAllProductList = async (req, res, next) => {
    try {
        
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }else {
        
            let options = {"status":"Pending"};
            const result = await productService.getAllProduct(options);
            if (result && result.length) {
                var response = { message: "Successfully getting Product List", error: false, data:result};
            }else{
                var response = { message: "No Record Found.", error: true, data: [] };
            }
            res.status(201).json(response);
        }
        
    } catch (error) {
        next({});
    }
}

/**
 * Update Product Status by Admin.
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 01/06/2021
 * @usedIn : Admin
 * @apiType : PUT
 * @lastModified : 01/06/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : _id,status
 * @version : 1
 */

exports.changeProductStatus = async (req, res, next) => {
    try {
        
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }else {
            const id = mongoose.Types.ObjectId(req.body.id);
            let filters = {_id: id};
            let updateQuery = {
                status: req.body.status
            }
            let response ={};
            const result = await productService.changeProductStatus(filters, updateQuery, { lean: true });
            if (result) {
                response = { message: 'Product Status has been Changed', error: false, data: {} };
            }else{
                response = { message: 'No Record Found.', error: true, data: {} };
            }
            res.status(200).json(response);
        }
        
    } catch (error) {
        next({});
    }
}