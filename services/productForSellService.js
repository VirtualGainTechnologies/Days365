const {productModel} = require('../models/productModel');
const {brandModel} = require('../models/brandModel');
const {productTaxModel} = require('../models/productTaxModel');
const {vendorDetailsModel} = require('../models/vendorDetailsModel');
const {categoryModel} = require('../models/categoryModel');
const {deleteFileFromPublicSpace} = require('../utils/fileUpload');
const mongoose = require('mongoose');

/**
 * Get All Product List for Approval
 */

 exports.getAllProduct = async (filters = {},projection = null, options = {}) => {
    return await productModel.find(filters, projection, options).sort({_id:-1});
}

//Retrieing brand filter.

exports.brandModel =async(filters = {}, projection = null, options = {}) =>{
    let pipeline = [];
    pipeline.push({
        $match: {
            _id: id
        }
    })
}

exports.getProductVariants = async(filters = {}, projection = null, options = {}) =>{
    console.log("#########################3333",filters);
    let pipeline = [];
    pipeline.push({
        $match:{_id:filters._id}
    },{
        $unwind:{
            path:"$productVariant",
            preserveNullAndEmptyArrays:true
        }
    },{
        $project:{
            _id:0,
            createdAt:0,
            updatedAt:0          
        }
    },{
        $group:{
            _id:"$productVariant.flavour",
            size: {$push: "$productVariant.size"},
            stock:{$push:"$productVariant.stock"},
            MRP:{$push:"$productVariant.maximumRetailPrice"},
            yourPrice:{$push:"$productVariant.yourPrice"},
            expiryDate:{$push:"$productVariant.expiryDate"},
            MainImg:{$push:"$productVariant.MainImg"},
            expiryDateImg:{$push:"$productVariant.expiryDate_Img"},
            importerMRPImg:{$push:"$productVariant.importerMRP_Img"},
            productSealImg:{$push:"$productVariant.productSeal_Img"},
            backImg:{$push:"$productVariant.product_Img1"},
            minRecommendedAge:{$first:"$minRecommendedAge"},
            title:{$first:"$title"},
            brandName:{$first:"$brandName"},
            manuFacturer:{$first:"$manuFacturer"},
            handlingPeriod:{$first:"$handlingPeriod"},
            percentageOnBrand:{$first:"$percentageOnBrand"},
            productDescription:{$first:"$productDescription"}
        }
    },{
        $project:{
            _id:1,
            size:1,
            stock:1,
            MRP:1,
            yourPrice:1,
            expiryDate:1,
            MainImg:1,
            expiryDateImg:1,
            importerMRPImg:1,
            productSealImg:1,
            backImg:1,
            minRecommendedAge:1,
            title:1,
            brandName:1,
            handlingPeriod:1,
            percentageOnBrand:1,
            manuFacturer:1,
            productDescription:1 
        }
    });

    return await productModel.aggregate(pipeline);

}

exports.getProductSizeVariants = async(filters = {}, projection = null, options = {}) =>{
    console.log("#########################3333",filters);
    let pipeline = [];
    pipeline.push({
        $match:{"title":filters.title}
    },{
        $unwind:{
            path:"$productVariant",
            preserveNullAndEmptyArrays:true
        }
    },{
        $match:{
            "productVariant.title":filters.title,
            "productVariant.flavour":filters.flavour,
            "productVariant.size":filters.size
        }
    },{
        $project:{
            _id:0,
            createdAt:0,
            updatedAt:0          
        }
    },{
        $group:{
            _id:"$productVariant.size" ,
            stock:{$first:"$productVariant.stock"},
            maximumRetailPrice:{$first:"$productVariant.maximumRetailPrice"},
            yourPrice:{$first:"$productVariant.yourPrice"},
            expiryDate_Img:{$first:"$productVariant.expiryDate_Img"},
            importerMRPImg:{$first:"$productVariant.importerMRP_Img"},
            productSealImg:{$first:"$productVariant.productSeal_Img"},
            backImg:{$first:"$productVariant.product_Img1"},
            MainImg:{$first:"$productVariant.MainImg"},
            expiryDate:{$first:"$productVariant.expiryDate"},
        }
    });

    return await productModel.aggregate(pipeline);

}