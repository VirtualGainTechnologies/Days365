  const {productModel} = require('../models/productModel');
// const { orderModel } = require('../models/orderModel');
const  { delivaryModel } = require('../models/newOrderModel');
const { orderModel } = require('../models/orderItem')
/**
 *  get the product data
 */
 exports.getProduct = async (filters = {}, projection = null, options = {}) => {
    return await productModel.findOne(filters, projection, options);
}

/**
 * save the order 
 */
exports.saveOrder = async (orderData) =>{
    return await orderModel.create(orderData);
}

/**
 * save the  delivery info
 */
 exports.savedevliary = async (orderData) =>{
    //  console.log("thsi si deiliyy",orderData)
    return await delivaryModel.create(orderData);
}

/**
* save order
 */
exports.saveNewOrder = async (orderData) =>{
    //  console.log("thsi si deiliyy",orderData)
    return await orderModel.create(orderData);
}
/**
 * find the oders
 */
exports.getOrder =async (customerId) =>{
    return await delivaryModel.find(customerId).sort( { "createdAt": -1 } )
}
/***
 * update the delivary table
 */
 exports.updatedelivaryData = async (id, updateQuery = {}, options = {}) => {
    return await delivaryModel.findByIdAndUpdate(id, updateQuery, options);
}

/**
 *  get the product from  delivary table
 */
 exports.getProduct = async (filters = {}, projection = null, options = {}) => {
    return await productModel.findOne(filters, projection, options);
}


exports.getOrderWithPopultate = async(condition) => {
    return await orderModel.aggregate(
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