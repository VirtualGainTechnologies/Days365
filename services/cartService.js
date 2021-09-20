const { cartModel } = require('../models/cartModel');

/**
 * Create cart 
 */
 exports.createCart = async (reqBody = {}) => {
    return await cartModel.create(reqBody);
}

/**
 *  get the cart data
 */
exports.getCart = async (filters = {}, projection = null, options = {}) => {
    return await cartModel.findOne(filters, projection, options);
}

/**
 * Update a record
 */

exports.updateCartData = async (id, updateQuery = {}, options = {}) => {
    return await cartModel.findByIdAndUpdate(id, updateQuery, options);
}


exports.getCartWithPopultate = async(condition) => {
       return await cartModel.aggregate(
           [
               {
                   $match: condition
               },
               {
                   $lookup:{
                       from:'product_documents',
                       localField:"productId",
                       foreignField:"_id",
                       as:"cartData"
                   }
               },
               {
                $unwind: {
                    path: "$cartData",
                    preserveNullAndEmptyArrays: true
                }
             },
            
           ]
       )
}
  