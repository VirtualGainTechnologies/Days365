const productService = require('../services/productService');
const cartService = require('../services/cartService');
const checkoutService = require('../services/checkoutService');
const mongoose = require('mongoose');
const querystring = require("querystring");
  ccav = require("../utils/ccavutil"),
  workingKey = "49A91DFE5E7F1E9633631C7CFB6CFF99", //Put in the 32-Bit key shared by CCAvenues.
  accessCode = "AVPA17II14AH62APHA",
  merchant_id = 459896,
  currency = "INR",
  redirect_url = "http://127.0.0.1:3001/checkout/ccavResponseHandler"; 
  cancel_url ='http://127.0.0.1:3001/checkout/ccavResponseHandler'; 

exports.checkout = async (req, res) => {
     try {
          console.log("this is checkout", req.user.id);
          req.body.merchant_id = merchant_id;
          req.body.currency = currency;
          req.body.redirect_url = redirect_url;
          req.body.cancel_url = cancel_url;
          req.body.language = "en"
          req.body.billing_name = "ankur";
          const customerID = mongoose.Types.ObjectId(req.user.id);
          const condition = { saveType: 'cart', cusotmerId: customerID };
          var cartResult = await cartService.getAllCartProduct(condition);
          //   console.log("this is produt in cart",cartResult);
          var totalPrice = 0;
          var productInfo = []
          if (cartResult != null) {
             

               for (const element of cartResult) {
                    var productObj ={}
                    var conditon = { _id:element.productId}
                    productObj.productId = element.productId;
                    productObj.varientId = element.varientId;
                       var productResult = await checkoutService.getProduct(conditon)

                       for (const element2 of productResult.productVariant) {
                       
                         if(element2.id == element.varientId){
                              productObj.perPrice = parseInt(element2.maximumRetailPrice);
                              console.log("this is rate",element2.maximumRetailPrice)
                              totalPrice = totalPrice + parseInt(element2.maximumRetailPrice)

                         }
                    }
                    // console.log("this is totalprice",totalPrice)
                    productInfo.push(productObj)

                  }
                  
          }
                  console.log("this is toalal amount yo..........",totalPrice,productInfo);
                  req.body.seachmaInfo = productInfo;
                 req.body.amount = totalPrice;
                 req.body.order_id = new Date().getUTCMilliseconds();
                console.log("this req.body&&&&&&&&&&&&&&&&&&&&&&",req.body)
                encRequest = await ccav.encrypt(
                    querystring.stringify(req.body),
                    workingKey
                  );
                  formbody =
                    '<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' +
                    encRequest +
                    '"><input type="hidden" name="access_code" id="access_code" value="' +
                    accessCode +
                    '"><script language="javascript">document.redirect.submit();</script></form>';
                
                    // res.writeHeader(200, { "Content-Type": "text/html" });
                    // res.write(formbody);
                    // res.end();
                    console.log("this is decr----------------++++++++++",encRequest,await ccav.decrypt(
                         encRequest,
                         workingKey
                    ))
                    var  response = { message: "Successfully product added into cart.", error: false, data: encRequest };
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response); 
     } catch (error) {

     }
}

exports.doneCheckout = async(req,res) =>{
     console.log("this is response")
     ccavEncResponse += querystring.stringify(request.body);
     ccavPOST = qs.parse(ccavEncResponse);
     var encryption = ccavPOST.encResp;
     ccavResponse = await ccav.decrypt(encryption, workingKey);
   
     console.log("this is json info",JSON.parse(ccavResponse));

}