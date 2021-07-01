const {promoterModel} = require('../models/promoterModel');
const {promoCodeModel} = require('../models/promoCodeModel');
const { vendorDetailsModel } = require('../models/vendorDetailsModel');
const { userRegisterModel } = require('../models/userRegister');


/**
 *  unique Id generator
 */

 async function generateUniquePromoCode(count) {
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
 * check id is Unique 
 */

 async function isUniqueId(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let filters = {promoCode: id};
            let result = await promoCodeModel.findOne(filters);
            return resolve(result ? false : true);
        } catch (error) {
            return reject(error);
        }
    });
}

/**
 * getting all promoter list.
 */
 exports.getPromoterList = async (filters = {},projection = null, options = {}) => {
    return await promoterModel.find(filters, projection, options).sort({_id:-1});
}

// get promoter record.
exports.getPromoterRecord = async(filters = {},projection = null, options = {}) =>{
    return await promoterModel.findOne(filters, projection, options);
}

/**
 * This Below's API for Add Bank Details.
 */
 exports.addBankDetails = async (filters = {}, updateQuery = {}, options = {}) => {
    return await promoterModel.findOneAndUpdate(filters, updateQuery, options);
}

exports.generatePromoCode = async (variants = [], files = [], fileIndex = []) => {
    return new Promise(async (resolve, reject) => {
        try {
            var uniqueId = '';
            do {
                let id = await generateUniquePromoCode(6);
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
 * Savig promocode 
 */

 exports.create = async (reqBody = {}) => {
    return await promoCodeModel.create(reqBody);
}

/**
 * getting all getPromoCode List.
 */
 exports.getPromoCodeList = async (filters = {},projection = null, options = {}) => {
    return await promoCodeModel.find(filters, projection, options).sort({_id:-1});
}

/**
 * getting all Seller List.
 */
 exports.getSellerList = async (filters = {},projection = null, options = {}) => {
    // return await vendorDetailsModel.find(filters, projection, options).sort({_id:-1});

    let pipeline = [];
    pipeline.push({
        $match:filters
    }, {
        $lookup: {
            from: "user_registers",
            localField: "vendor_id",
            foreignField: "_id",
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
            'account_status': 1,
            'vendor_id': 1,
            'sellerData.fullname': 1,

        }
    });
    return await vendorDetailsModel.aggregate(pipeline);
}
