const productService = require('../services/productService');
const cartService = require ('../services/cartService');
const checkoutService = require('../services/checkoutService');
const mongoose = require('mongoose');

exports.checkout = async (req,res) =>{
     try{
         console.log("this is checkout",req.user.id);
        const customerID = mongoose.Types.ObjectId(req.user.id);
        const condition = {saveType:'cart', cusotmerId: customerID};
        var cartResult =  await cartService.getAllCartProduct(condition);
      //   console.log("this is produt in cart",cartResult);
         var checkoutAmount;
         var totalPrice = 0;
        if(cartResult != null){
         // var totalPrice = 0;
            await cartResult.forEach(async(cart) => {
                  console.log("there is product id",cart.productId)
                  var conditon = { _id:cart.productId}
                  var productResult = await checkoutService.getProduct(conditon);
                  // console.log("this is product result",productResult.productVariant);
                  productResult.productVariant.forEach(element => {
                        if(element.id == cart.varientId){
                           //   console.log("there versinte find",element.maximumRetailPrice);
                             totalPrice = totalPrice+element.maximumRetailPrice
                        }
                  });
                  console.log("this is toalal amount",totalPrice);
                  // checkoutAmount =totalPrice
             });
        }
        console.log("this is toalal amount------------",totalPrice);
     }catch(error){

     }
}
