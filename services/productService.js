const { productModel } = require('../models/productModel');
const { productTaxModel } = require('../models/productTaxModel');
const { vendorDetailsModel } = require('../models/vendorDetailsModel');
const { userRegisterModel } = require('../models/userRegister');
const { categoryModel } = require('../models/categoryModel');
const { deleteFileFromPublicSpace } = require('../utils/fileUpload');
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


exports.bulkFilesDelete = async (files = []) => {
    const length = files.length;
    var i = 0;
    while (i < length) {
        try {
            let fileName = files[i].split("/")
            console.log("fileName", fileName[3]);
            await deleteFileFromPublicSpace(fileName[3]);
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
 *  this  is  product get function
 */
exports.getProduct = async (condition) => {
    return await productModel.find(condition);
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

            var formattedVariants = [];
            for (let [i, option] of variants.entries()) {
                var choice = {};

                if (option.title) {
                    choice['title'] = option.title;
                }
                if (option.VegNonVegProduct) {
                    choice['VegNonVegProduct'] = option.VegNonVegProduct;
                }
                if (option.size) {
                    choice['size'] = option.size;
                }
                if (option.productId) {
                    choice['productId'] = option.productId;
                }
                if (option.productIdType) {
                    choice['productIdType'] = option.productIdType;
                }

                if (option.SKUId) {
                    choice['SKUId'] = option.SKUId;
                }
                if (option.flavour) {
                    choice['flavour'] = option.flavour;
                }
                if (option.expiryDate) {
                    choice['expiryDate'] = option.expiryDate;
                }
                if (option.description) {
                    choice['description'] = option.description;
                }
                if (option.maximumRetailPrice) {
                    choice['maximumRetailPrice'] = option.maximumRetailPrice;
                }
                if (option.yourPrice) {
                    choice['yourPrice'] = option.yourPrice;
                }
                // if (option.offerPrice) {
                //     choice['offerPrice'] = option.offerPrice;
                // }
                // if (option.offerDescription) {
                //     choice['offerDescription'] = option.offerDescription;
                // }
                if (option.stock > 0) {
                    choice['stock'] = option.stock;
                }

                if (option.expiryDate_Img) {
                    choice['expiryDate_Img'] = option.expiryDate_Img;
                }

                if (option.importerMRP_Img) {
                    choice['importerMRP_Img'] = option.importerMRP_Img;
                }

                if (option.productSeal_Img) {
                    choice['productSeal_Img'] = option.productSeal_Img;
                }

                if (option.MainImg) {
                    choice['MainImg'] = option.MainImg;
                }

                if (option.product_Img1) {
                    choice['product_Img1'] = option.product_Img1;
                }



                choice['length'] = option.length;
                choice['breadth'] = option.breadth;
                choice['height'] = option.height;
                choice['weight'] = option.weight;
                choice['source_pin'] = option.source_pin;




                var uniqueId = '';
                do {
                    let id = await generateUniqueProductID(15);
                    let isUnique = await isUniqueId(id);
                    // console.log(id + " " + isUnique);
                    if (isUnique) {
                        uniqueId = id;
                    }
                } while (uniqueId === '');
                choice['daysProductCode'] = uniqueId;
                formattedVariants.push(choice);
            }
            return resolve(formattedVariants);
        } catch (error) {
            return reject(error);
        }
    });
}

// exports.generateDaysProductCode = async (variants = [], files = [], fileIndex = []) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             var uniqueId = '';
//             do {
//                 let id = await generateUniqueProductID(15);
//                 let isUnique = await isUniqueId(id);
//                  console.log(id + " " + isUnique);
//                 if (isUnique) {
//                     uniqueId = id;
//                 }
//             } while (uniqueId === ''){
//                 uniqueId =  uniqueId; 
//             }
//             return resolve(uniqueId);

//         } catch (error) {
//             return reject(error);
//         }
//     });
// }


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
            let filters = { daysProductCode: id };
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
            'manuFacturer': 1,
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
 * This Below's API for change product Status.
 */
exports.updateProduct = async (filters = {}, updateQuery = {}, options = {}) => {
    return await productModel.findOneAndUpdate(filters, updateQuery, options);
}


/**
 * Create a Product Tax Code
 */

exports.createProductTaxCode = async (reqBody = {}) => {
    return await productTaxModel.create(reqBody);
}

/**
 * Checking Existing or Duplicate Tax Code.
 */

exports.checkExistingTaxCode = async (filters = {}, projection = null, options = {}) => {
    return await productTaxModel.findOne(filters, projection, options);
}

/**
 * getting all product Tax Code.
 */
exports.getAllProductTaxCode = async (filters = {}, projection = null, options = {}) => {
    return await productTaxModel.find(filters, projection, options);
}


/**
 * Get product 
 */

exports.getAllProduct = async (filters = {}, projection = null, options = {}) => {
    return await productModel.find(filters, projection, options).sort({ _id: -1 });
}

exports.getUserDetails = async (filters = {}, projection = null, options = {}) => {
    return await userRegisterModel.findOne(filters, projection, options);
}



exports.getAllProductsWithFilters = async (options = {}) => {
    let pipeline = [];
    let filters = {
        status: "Active"
    };
    let sortOptions = {};
    if (options.title) {
        options.title = options.title.replace(/\s+/g, " ").trim().split(" ").join("|");
        filters['$or'] = [
            {
                title: {
                    $regex: options.title,
                    $options: 'i'
                }
            },
            {
                searchTermsArr: {
                    $regex: options.title,
                    $options: 'i'
                }
            }
        ];
    }
    if (options.category) {
        filters['category_path'] = {
            $regex: options.category,
            $options: 'i'
        }
    }
    if (options.brand) {
        filters['brandName'] = {
            $regex: options.brand,
            $options: 'i'
        }
    }
    if (options.sort) {
        if (options.sort.price) {
            sortOptions['productVariant.0.yourPrice'] = options.sort.price;
        }
        else if (options.sort.date) {
            sortOptions['productVariant.0.createdAt'] = options.sort.date;
        }
    }
    sortOptions["_id"] = -1;
    pipeline.push(
        {
            $match: filters
        },
        {
            $sort: sortOptions
        },
        {
            $facet: {
                metadata: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 }
                        }
                    }
                ],
                records: [
                    {
                        $skip: options.page * options.size
                    },
                    {
                        $limit: options.size
                    },
                    {
                        $project: {
                            vendor_id: 1,
                            venderName: 1,
                            reference_id: 1,
                            title: 1,
                            brandName: 1,
                            status: 1,
                            categoryName: 1,
                            createdAt: 1,
                            'productVariant._id': 1,
                            'productVariant.title': 1,
                            'productVariant.size': 1,
                            'productVariant.SKUId': 1,
                            'productVariant.daysProductCode': 1,
                            'productVariant.productId': 1,
                            'productVariant.yourPrice': 1,
                            'productVariant.maximumRetailPrice': 1,
                            'productVariant.stock': 1,
                            'productVariant.MainImg': 1,
                            'productVariant.product_Img1': 1,
                            'productVariant.product_Img2': 1,
                            'productVariant.product_Img3': 1,
                            'productVariant.product_Img4': 1
                        }
                    },
                    {
                        $project: {
                            vendor_id: 1,
                            venderName: 1,
                            reference_id: 1,
                            title: 1,
                            brandName: 1,
                            categoryName: 1,
                            status: 1,
                            createdAt: 1,
                            productVariant: {
                                $slice: ["$productVariant", 1]
                            }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                maxRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] },
                records: 1
            }
        }
    );
    return await productModel.aggregate(pipeline).allowDiskUse(true);
}