const productService = require('../services/productService');
const cartService = require ('../services/cartService');
const mongoose = require('mongoose');


// exports.createCart = async (req,res,next) =>{
//      try {
       
//         const proudctID = mongoose.Types.ObjectId(req.body.productId);
//         const customerID = mongoose.Types.ObjectId(req.user.id);
//         var condition = {_id:proudctID};
        
//         var product=   await productService.getProduct(condition)
//         // console.log("this is product for cart", product);
//         var option  ={ cusotmerId: customerID}
//         var cartResult =  await cartService.getCart(option);
        
//         if(product && cartResult == null ) {
//             var cartObj ={
//                 productId:proudctID,
//                 cusotmerId:customerID,
//                 saveType:'cart',
//                 quantity: 1
//             }
        
  
//         var cart = await  cartService.createCart(cartObj);
//           if(cart){
//             response = { message: "Successfully product added in cart.", error: false, data: cart };
//           } 
//           res.statusCode = 200;
//           res.setHeader('Content-Type', 'application/json');
//           res.json(response);  
//         }else{
//             var updateCart ={
//                 quantity: cartResult.quantity+1
//             }

//             let id = mongoose.Types.ObjectId(cartResult._id)
           
//              await cartService.updateCartData(id,updateCart);
            
//             response = { message: "cart is updated successfully." }; 
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(response);  
//         }
//     }catch (error){
//         next({})
//     }
// }

exports.createCart = async (req,res,next) =>{
    try {
        console.log("this is variantId")
       const proudctID = mongoose.Types.ObjectId(req.body.productId);
       const customerID = mongoose.Types.ObjectId(req.user.id);
       var condition = {_id:proudctID};
       var product=   await productService.getProduct(condition)
       var option  ={ cusotmerId: customerID}
       if(req.body.saveType == 'cart'){
               option.saveType = 'cart'
         }else{
               option.saveType = 'wislist'
        }
       var cartResult =  await cartService.getCart(condition);
       if(product && cartResult == null ) {
           
           var cartObj ={
               productId:proudctID,
               cusotmerId:customerID,
               quantity: 1,
               cartPrice:product.price,
               varientId:req.body.variantId
           }
       
           if(req.body.saveType == 'cart'){
                 cartObj.saveType='cart'
           }else{
                 cartObj.saveType='wislist'
           }
 
       var cart = await  cartService.createCart(cartObj);
         if(cart){
            if(req.body.saveType == 'cart'){
                response = { message: "Successfully product added into cart.", error: false, data: cart };
               }else{
                response = { message: "Successfully product added into wishlist.", error: false, data: cart };
               }
          
         } 
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(response);  
       }else{
           console.log("this is product",cartResult.cartPrice,product.price)
           var updateCart ={
               quantity: cartResult.quantity+1,
            //    cartPrice:cartResult.cartPrice+product.price
           }

           let id = mongoose.Types.ObjectId(cartResult._id)
          
            await cartService.updateCartData(id,updateCart);
           if(req.body.saveType == 'cart'){
            response = { message: "cart is updated successfully." }; 
           }else{
            response = { message: "wishList is updated successfully." }; 
           }
          
           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           res.json(response);  
       }
   }catch (error){
       next({})
   }
}



exports.getCartData = async (req,res,next) =>{
    const customerID = mongoose.Types.ObjectId(req.user.id);
    var condition ={ cusotmerId: customerID,saveType: req.body.saveType,isDeleted: false};

    var cartList = await cartService.getCartWithPopultate(condition);
    if(req.body.saveType == 'cart'){
        var response = { message: "Cart is empty.",error: false, data: {} };
    }else{
        var response = { message: "Wishlist is empty.",error: false, data: {} };
    }
   
    if(cartList){
        if(req.body.saveType == 'cart'){
            response = { message: "Successfully retrieved from cart.",error: false, data: cartList };;
        }else{
            response = { message: "Successfully retrieved from  wishlist.",error: false, data: cartList };
        }
       
    } 
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response); 
}

exports.clearCartData = async (req,res,next) =>{
    console.log("this is rea.body",req.body,req.user.id)
    const customerID = mongoose.Types.ObjectId(req.user.id);  
    var condition ={ cusotmerId: customerID,saveType: req.body.saveType};
    var updateData = { isDeleted: true };

    var updateCart = await cartService.updatallCartData(condition,updateData);
    console.log("this is cart data",updateCart)
    var response = { message: "Cart is empty.",error: true, data: {} };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response); 
}
