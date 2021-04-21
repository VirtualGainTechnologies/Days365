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
            var brandName = data.brandName ? data.brandName.trim().toLowerCase() : null;
            const flag = await productService.validateVariantData(productVariants);
            if (!flag || (fileIndex.length !== productVariants.length)) {
                if (req.files) {
                    await productService.filesBulkDelete(req.files);
                }
                return next(new ErrorBody(400, 'Bad Inputs', []));
            }
            const vendorRecord = await productService.getVendorRecord({ vendor_id: vendorId });
            const categoryRecord = await productService.getCategoryRecord(categoryId);
            if (!vendorRecord || !categoryRecord || (brandName && (!vendorRecord.is_brand_approved || brandName !== vendorRecord.brand_name))) {
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
                key_words: keyWords,
                variants: formattedProductVariants,
                is_blocked: categoryRecord.is_restricted ? true : false
            }
            if (brandName) {
                reqBody['brand_name'] = brandName;
            }
            const result = await productService.createProduct(reqBody);
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Successfully added product', error: false, data: result });
        }
    } catch (error) {
        console.log(error);
        if (req.files) {
            await productService.filesBulkDelete(req.files);
        }
        next({});
    }
}
