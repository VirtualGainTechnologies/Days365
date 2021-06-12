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
            // if (req.files) {
            //     await productService.filesBulkDelete(req.files);
            // }
            return next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        } else {
            var data = req.body;
            var vendorId = mongoose.Types.ObjectId(req.user.id);
            var title = data.title;
            var categoryId = mongoose.Types.ObjectId(data.categoryId);
            var keyWords = data.keyWords;
            var productVariants = data.productVariants;
            var fileIndex = data.fileIndex;
            var brandName = data.brandName;
            var tempBrandName = brandName.toLowerCase();

            const flag = await productService.getProductWithFilters({title: data.title}, null, { lean: true });
            // if (!flag || (fileIndex.length !== productVariants.length)) {
            if (flag) {
                // if (req.files) {
                //     await productService.filesBulkDelete(req.files);
                // }
                return res.status(201).json({
                    message: 'Duplicate Data Founded',
                    error: false,
                    data: flag 
                });
            }

            const vendorRecord = await productService.getVendorRecord({ vendor_id: vendorId }, null, { lean: true });
            const categoryRecord = await productService.getCategoryRecord(categoryId);
            if ((!vendorRecord) || (!categoryRecord) || (vendorRecord.account_status !== 'Approved') || (vendorRecord.brand_status !== 'Approved')) {
                // if (req.files) {
                //     await productService.filesBulkDelete(req.files);
                // }
                return next(new ErrorBody(400, 'Bad Inputs', []));
            }
            
            var categoryAncestors = await categoryRecord.getAncestors({}, { category_name: 1 }, { lean: true });
            var categoryPath = await productService.createCategoryPath(categoryAncestors);
            categoryPath += "/" + categoryRecord.category_name;
          
           // const dayProductCode = await productService.generateDaysProductCode(null, req.files, fileIndex);
           
            var reqBody = {
                // daysProductCode:dayProductCode,
                vendor_id: vendorId,
                venderName:vendorRecord.company_name,
                title: title,
                category_path: categoryPath,
                category_id: categoryRecord._id,
                categoryName:categoryRecord.category_name,
                searchTerms: keyWords,
                brandName: tempBrandName === 'generic' ? "Generic" : brandName,

                // productId: data.productId,
                // productIdType: data.productIdType,
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
        // if (req.files) {
        //     await productService.filesBulkDelete(req.files);
        // }
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
        
            let options = {"status":req.query.status};
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
            const result = await productService.updateProduct(filters, updateQuery, { lean: true });
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

/**
 * Add Product Tax Code.
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 02/06/2021
 * @usedIn : Admin 
 * @apiType : POST
 * @lastModified : 02/06/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : categoryId,categoryName,taxCode
 * @version : 1
 */


 exports.addProductTaxCode = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        } else {
            let response ;
            var reqData = req.body;
            let options = {"taxCode":req.body.taxCode};
            const checkExistingTaxCode = await productService.checkExistingTaxCode(options);

            if(checkExistingTaxCode){
                response = { message: 'Duplicate Tax Code Found', error: false, data: {} };
            }else{
            const result = await productService.createProductTaxCode(reqData);
            if (result) {
                response = { message: 'Product Tax Code Saved Sucessfully', error: false, data: {} };
            }else{
                response = { message: 'Not Save Data.', error: true, data: {} };
            }
            }
            res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        next({});
    }
}

/**
 * getting All Product Tax Code.
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 03/06/2021
 * @usedIn : Seller Dashboard
 * @apiType : POST
 * @lastModified : 03/06/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : categoryId,categoryName,taxCode
 * @version : 1
 */


 exports.getAllProductTaxCodeList = async (req, res, next) => {
    try {
        
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }else {
        
            let options = {"categoryName":req.body.categoryName};
            const result = await productService.getAllProductTaxCode(options,null, { lean: true });
            if (result && result.length) {
                var response = { message: "Successfully getting Product Tax Code List", error: false, data:result};
            }else{
                var response = { message: "No Record Found.", error: true, data: [] };
            }
            res.status(200).json(response);
        }
        
    } catch (error) {
        next({});
    }
}

/**
 * Add Existing Product.
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 05/06/2021
 * @usedIn : Seller Dashboard 
 * @apiType : POST
 * @lastModified : 05/06/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : title,brandName,yourPrice,productDescription,feature,front_Img,productId
 * @version : 1
 */


 exports.addExistingProduct = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        } else {
            let response ;
            let imageLocation = req.file ? req.file.location : null;
            let reqData = req.body;
            let vendorId = mongoose.Types.ObjectId(req.user.id);
            let productId = mongoose.Types.ObjectId(reqData.productId);
           
            const vendorRecord = await productService.getVendorRecord({ vendor_id: vendorId }, null, { lean: true });
            const productRecord = await productService.getProductWithFilters({ _id: productId, status: 'Active' }, null, { lean: true });
            if ((!vendorRecord) || (!productRecord) || (vendorRecord.account_status !== 'Approved') || (vendorId === productRecord.vendor_id) || ((productRecord.brandName !== 'Generic') && (vendorRecord.brand_status !== 'Approved' || productRecord.brandName !== vendorRecord.brand_details.brand_name))) {
                // if (req.files) {
                //     await productService.filesBulkDelete(req.files);
                // }
                return next(new ErrorBody(400, 'Bad Inputs', []));
            }

            // const dayProductCode = await productService.generateDaysProductCode(null, req.files, null);
           
            var reqBody = {
                // daysProductCode:dayProductCode,
                vendor_id: vendorId,
                title: reqData.title,
                category_path:productRecord.category_path,
                category_id: productRecord.category_id,
                searchTerms: productRecord.searchTerms,
                brandName: reqData.brandName,

               // productId: productRecord.productId,
                //productIdType: productRecord.productIdType,
                countryOfOrigin: productRecord.countryOfOrigin,
                manuFacturer:productRecord.manuFacturer,
                color: productRecord.color,
                minRecommendedAge:productRecord.minRecommendedAge,
                isProductExpirable: productRecord.isProductExpirable,
                condition: productRecord.condition,
                conditionNote: productRecord.conditionNote,
                salePrice:productRecord.salePrice,
                yourPrice:reqData.yourPrice,
                maximumRetailPrice:productRecord.maximumRetailPrice,
                handlingPeriod:productRecord.handlingPeriod,
                productDescription:reqData.productDescription,
                bulletPoint: productRecord.bulletPoint,
                searchTerms: productRecord.searchTerms,
                targetAudience: productRecord.targetAudience,
                shippingCharges:productRecord.shippingCharges,
                shippingChargesAmt: productRecord.shippingChargesAmt,
                // variants: formattedProductVariants,
                status: 'Pending',
               //'customer_rating.total_rating': 0
               reference_id : productRecord._id
            }
           // console.log("imageLocation",imageLocation);
            if (imageLocation) {
                reqBody['front_Img'] = imageLocation;
            }
            const result = await productService.createProduct(reqBody);
            console.log("Successfully Added Product");
           return res.status(201).json({
                message: 'Successfully Added Product',
                error: false,
                data: result 
            });
        }
    } catch (error) {
        console.log(error);
        next({});
    }
}

/**
 * Getting all product by seller wise.
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 05/06/2021
 * @usedIn : Seller Dashboard 
 * @apiType : GET
 * @lastModified : 05/06/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : 
 * @version : 1
 */

 exports.getProductSellerWise = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }
        else {
            let vendorId = mongoose.Types.ObjectId(req.user.id);
            let filter = {
                vendor_id: vendorId,  
            }
            const result = await productService.getAllProduct(filter,null,{lean:true});
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
 * Add Product Varient of Every Product.
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 08/06/2021
 * @usedIn : Seller Dashboard 
 * @apiType : GET
 * @lastModified : 08/06/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : 
 * @version : 1
 */

 exports.addProductVarient = async (req, res, next) => {
    try {
        
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }else {
            const id = mongoose.Types.ObjectId(req.body.id);
            let filters = {_id: id};
            const formattedProductVariants = await productService.formatProductVariants(req.body.productVariant, null, null);
            let updateQuery = {
                productVariant: formattedProductVariants
            }
            console.log("updateQuery....",filters,updateQuery);
            let response ={};
            const result = await productService.updateProduct(filters, updateQuery, { lean: true });
            if (result) {
                response = { message: 'Product Varient  has been Added', error: false, data: {} };
            }else{
                response = { message: 'No Record Found.', error: true, data: {} };
            }
            res.status(200).json(response);
        }
        
    } catch (error) {
        next({});
    }
}

/**
 * Filter Product Brand,Seller wise.
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 12/06/2021
 * @usedIn : User Dashboard 
 * @apiType : GET
 * @lastModified : 12/06/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : 
 * @version : 1
 */

exports.getFiltersList = async (req, res, next) =>{
    console.log("@@@@@@@@@@@@@@@@@@@@@");
}