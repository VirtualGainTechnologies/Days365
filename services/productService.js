const { productModel } = require('../models/productModel');
const { vendorDetailsModel } = require('../models/vendorDetailsModel');
const { categoryModel } = require('../models/categoryModel');
const { deleteFileFromPublicSpace } = require('../utils/fileUpload');
const mongoose = require('mongoose');


/**
 * Create a product
 */

exports.createProduct = async (reqBody) => {
    return await productModel.create(reqBody);
}


/**
 *  Validate request body
 */

exports.validateVariantData = async (data = []) => {
    return new Promise(async (resolve, reject) => {
        try {
            var i = 0;
            var length = data.length;
            while (i < length) {
                let option = data[i];
                if (
                    (option.skuId.length) &&
                    (option.price >= 0) &&
                    (option.offerPrice >= 0) &&
                    (option.shippingFee >= 0) &&
                    (option.taxCode.length) &&
                    (option.description.length)
                ) {
                    i++;
                }
                else {
                    return resolve(false);
                }
            }
            return resolve(true);
        } catch (error) {
            return reject(error);
        }
    });
}


/**
 * Bulk delete uploaded files
 */

exports.filesBulkDelete = async (files = []) => {
    const length = files.length;
    var i = 0;
    while (i < length) {
        try {
            let fileName = files[i].key;
            await deleteFileFromPublicSpace(fileName);
        } catch (error) {
            //Nothing to do
        }
        i++;
    }
}


/**
 * Get Vendor Record
 */

exports.getVendorRecord = async (filters) => {
    return await vendorDetailsModel.findOne(filters);
}


/**
 * Get category record
 */

exports.getCategoryRecord = async (id) => {
    return await categoryModel.findById(id);
}


/**
 *  Get category path 
 */

exports.createCategoryPath = async (ancestors = []) => {
    return new Promise(async (resolve, reject) => {
        try {
            var catPath = '';
            for (let category of ancestors) {
                catPath += "/" + category.category_name
            }
            return resolve(catPath);
        } catch (error) {
            return reject(error);
        }
    });
}


/**
 * Format product variants
 */

exports.formatProductVariants = async (variants = [], files = [], fileIndex = []) => {
    return new Promise(async (resolve, reject) => {
        try {
            var formattedVariants = [];
            for (let [i, option] of variants.entries()) {
                var choice = {};
                if (option.color) {
                    choice['color'] = option.color;
                }
                if (option.size) {
                    choice['size'] = option.size;
                }
                if (option.UPC) {
                    choice['UPC'] = option.UPC;
                }
                if (option.EAN) {
                    choice['EAN'] = option.EAN;
                }
                if (option.ISBN) {
                    choice['ISBN'] = option.ISBN;
                }
                if (option.skuId) {
                    choice['SKU_id'] = option.skuId;
                }
                if (option.ingredients) {
                    choice['ingredients'] = option.ingredients;
                }
                if (option.howToUse) {
                    choice['how_to_use'] = option.howToUse;
                }
                if (option.description) {
                    choice['description'] = option.description;
                }
                if (option.price) {
                    choice['price'] = option.price;
                }
                if (option.offerPrice) {
                    choice['offer_price'] = option.offerPrice;
                }
                if (option.offerDescription) {
                    choice['offer_description'] = option.offerDescription;
                }
                if (option.stock > 0) {
                    choice['stock'] = option.stock;
                }
                if (option.shippingFee > 0) {
                    choice['shipping_fee'] = option.shippingFee;
                }
                if (option.taxCode) {
                    choice['tax_code'] = option.taxCode;
                }
                let startIndex = parseInt(fileIndex[i].start);
                let endIndex = parseInt(fileIndex[i].end);
                choice['product_details_image_URL'] = files[startIndex].location;
                let imageUrls = [];
                for (let j = startIndex + 1; j <= endIndex; j++) {
                    imageUrls.push(files[j].location);
                }
                choice['image_URLs'] = imageUrls;
                var uniqueId = '';
                do {
                    let id = await generateUniqueProductID(15);
                    let isUnique = await isUniqueId(id);
                    // console.log(id + " " + isUnique);
                    if (isUnique) {
                        uniqueId = id;
                    }
                } while (uniqueId === '');
                choice['days_product_code'] = uniqueId;
                formattedVariants.push(choice);
            }
            return resolve(formattedVariants);
        } catch (error) {
            return reject(error);
        }
    });
}


/**
 *  unique Id generator
 */

async function generateUniqueProductID(count) {
    return new Promise(async (resolve, reject) => {
        try {
            var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            var uniqueId = '';
            for (let i = 0; i < count; i++) {
                uniqueId += await base[parseInt(Math.random() * (base.length))];
            }
            return resolve(uniqueId);
        } catch (error) {
            return reject(error);
        }
    });
}


/**
 * check id is  Unique 
 */

async function isUniqueId(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let filters = {
                'variants': { $elemMatch: { days_product_code: id } }
            };
            let result = await productModel.findOne(filters);
            return resolve(result ? false : true);
        } catch (error) {
            return reject(error);
        }
    });
}


/**
 * Get product with filters
 */

exports.getProductWithFilters = async (filters = null, projection = null, options = null) => {
    return await productModel.findOne(filters, projection, options);
}


/**
 * Get product with id
 */

exports.getProductById = async (id) => {
    return await productModel.findById(id);
}


/**
 * Get versions of sellers selling same product
 */

exports.getProductSellers = async (options = {}) => {
    let pipeline = [];
    pipeline.push(
        {
            $match: {
                _id: options.id,
            },
        },
        {
            $lookup: {
                from: "product_documents",
                let: { id: "$_id", refId: '$reference_id' },
                pipeline: [{
                    $match: {
                        $expr: {
                            $or: [
                                {
                                    $eq: ["$$id", "$reference_id"]
                                },
                                {
                                    $eq: [{ $ifNull: ['$$refId', '$$id'] }, "$reference_id"]
                                }
                            ]
                        }
                    },
                }],
                as: "similarSellers"
            }
        },
        {
            $project: {
                _id: 0,
                similarSellers: 1
            }
        }
    );
    return await productModel.aggregate(pipeline);
}