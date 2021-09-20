const productService = require('../services/productService');
// const cartService = require ('../services/cartService');
const mongoose = require('mongoose');

exports.checkout = async (req,res) =>{
     try{
        //  console.log("this is checkout",req.;
        const customerID = mongoose.Types.ObjectId(req.user.id);
     }catch(error){

     }
}
