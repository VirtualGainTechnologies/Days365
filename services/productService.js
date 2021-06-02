const {productModel} = require('../models/productModel');
const {vendorDetailsModel} = require('../models/vendorDetailsModel');
const {categoryModel} = require('../models/categoryModel');
const {deleteFileFromPublicSpace} = require('../utils/fileUpload');
const mongoose = require('mongoose');


/**
 * Create a product
 */

exports.createProduct = async (reqBody = {}) => {
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
                } else {
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

exports.getVendorRecord = async (filters = {}, projection = null, options = {}) => {
    return await vendorDetailsModel.findOne(filters, projection, options);
}


/**
 * Get category record
 */

exports.getCategoryRecord = async (id, projection = null, options = {}) => {
    return await categoryModel.findById(id, projection, options);
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
            var uniqueId = '';
            do {
                let id = await generateUniqueProductID(15);
                let isUnique = await isUniqueId(id);
                 console.log(id + " " + isUnique);
                if (isUnique) {
                    uniqueId = id;
                }
            } while (uniqueId === ''){
                uniqueId =  uniqueId; 
            }
            return resolve(uniqueId);
          
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
            // var time = (new Date() / 1) * 1+""; 
            // uniqueId =uniqueId+time.substring(1, 6);
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
            let filters = {daysProductCode: id};
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

exports.getProductWithFilters = async (filters = {}, projection = null, options = {}) => {
    return await productModel.findOne(filters, projection, options);
}


/**
 * Get product with id
 */

exports.getProductById = async (id, projection = null, options = {}) => {
    return await productModel.findById(id, projection, options);
}

/**
 * Get versions of sellers selling same product
 */

exports.getProductSellers = async (options = {}) => {
    let pipeline = [];
    pipeline.push({
        $match: {
            _id: options.id,
            status: "Active"
        }
    }, {
        $lookup: {
            from: "product_documents",
            let: {
                id: "$_id",
                refId: '$reference_id'
            },
            pipeline: [{
                    $match: {
                        $expr: {
                            $or: [{
                                    $and: [{
                                            $eq: ["$$id", "$reference_id"]
                                        },
                                        {
                                            $eq: ["Active", "$status"]
                                        }
                                    ]
                                },
                                {
                                    $and: [{
                                            $eq: [{
                                                $ifNull: ['$$refId', null]
                                            }, "$_id"]
                                        },
                                        {
                                            $eq: ["Active", "$status"]
                                        }
                                    ]
                                },
                                {
                                    $and: [{
                                            $eq: [{
                                                $ifNull: ['$$refId', '$$id']
                                            }, "$reference_id"]
                                        },
                                        {
                                            $eq: ["Active", "$status"]
                                        },
                                        {
                                            $ne: ['$$id', '$_id']
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                },
                {
                    $lookup: {
                        from: "vendor_details",
                        localField: "vendor_id",
                        foreignField: "vendor_id",
                        as: "sellerData"
                    }
                },
                {
                    $unwind: {
                        path: "$sellerData",
                        preserveNullAndEmptyArrays: true
                    }
                }
            ],
            as: "similarSellers"
        }
    }, {
        $project: {
            productId: "$_id",
            _id: 0,
            'similarSellers._id': 1,
            'similarSellers.vendor_id': 1,
            'similarSellers.title': 1,
            'similarSellers.brand_name': 1,
            'similarSellers.customer_rating': 1,
            'similarSellers.sellerData._id': 1,
            'similarSellers.sellerData.shipping_method': 1,
            'similarSellers.sellerData.company_name': 1,
            'similarSellers.sellerData.company_address': 1,
            'similarSellers.sellerData.store_name': 1
        }
    });
    return await productModel.aggregate(pipeline);
}

/**
 *  Get active prouduct by id
 */

exports.getActiveProductRecordById = async (id) => {
    let pipeline = [];
    pipeline.push({
        $match: {
            _id: id
        }
    }, {
        $lookup: {
            from: "vendor_details",
            localField: "vendor_id",
            foreignField: "vendor_id",
            as: "sellerData"
        }
    }, {
        $unwind: {
            path: "$sellerData",
            preserveNullAndEmptyArrays: true
        }

    }, {
        $project: {
            '_id': 1,
            'status': 1,
            'vendor_id': 1,
            'title': 1,
            'brandName': 1,
            'daysProductCode': 1,
            'manuFacturer':1,
            'customer_rating': 1,
            'sellerData.shipping_method': 1,
            'sellerData.company_name': 1,
            'sellerData.store_name': 1,
            'sellerData.company_address': 1
        }
    });
    return await productModel.aggregate(pipeline);
}


/**
 * Get All Product List for Approval
 */

 exports.getAllProduct = async (filters = {},projection = null, options = {}) => {
    return await productModel.find(filters, projection, options);
}

/**
 * This Below's API for change product Status.
 */
exports.changeProductStatus = async (filters = {}, updateQuery = {}, options = {}) => {
    return await productModel.findOneAndUpdate(filters, updateQuery, options);
}