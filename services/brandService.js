const { brandModel } = require('../models/brandModel');
const { vendorDetailsModel } = require('../models/vendorDetailsModel');
const { categoryModel } = require('../models/categoryModel');
const { deleteFileFromPublicSpace } = require('../utils/fileUpload');
const mongoose = require('mongoose');
const { options } = require('../app');



exports.createBrand = async (reqBody = {}) => {
    return await brandModel.create(reqBody);
}

exports.getBrand = async (filters = {}, updateQuery = {}, options = {}) => {
    return await brandModel.find(filters, updateQuery, options).sort({ _id: -1 });
}

exports.changeStatus = async (filters = {}, updateQuery = {}, options = {}) => {
    return await brandModel.findByIdAndUpdate(filters, updateQuery, options);
}

exports.isBrandExists = async (filters = {}, projection = null, options = {}) => {
    return await brandModel.findOne(filters, projection, options)
}

exports.getAllCat = async (filters = {}, projection = null, options = {}) => {
    return await categoryModel.find(filters, projection, options)
}



exports.getDistinctActiveBrands = async () => {
    return await brandModel.distinct('brandName', { status: "Active" });
}


exports.getSellerBrands = async (sellerId) => {
    let pipeline = [
        {
            $match: {
                sellerId: sellerId
            }
        },
        {
            $lookup: {
                from: 'category_documents',
                let: { id: { $toObjectId: "$categoryId" } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$$id", "$_id"]
                            }
                        }
                    },
                    {
                        $project: {
                            category_name: 1
                        }
                    }
                ],
                as: "categoryData"
            }
        },
        {
            $unwind: {
                path: "$categoryData",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                brandName: 1,
                registrationNo: 1,
                brandWebsite: 1,
                sellerId: 1,
                Percentage: 1,
                image: 1,
                status: 1,
                categoryId: 1,
                categoryName: "$categoryData.category_name"
            }
        }
    ];
    return await brandModel.aggregate(pipeline).allowDiskUse(true);
}