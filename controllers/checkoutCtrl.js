const productService = require('../services/productService');
const cartService = require('../services/cartService');
const checkoutService = require('../services/checkoutService');
const userService = require('../services/signinService');
const mongoose = require('mongoose');


const querystring = require("querystring");
var http = require("http"),
     fs = require("fs"),
     ccav = require("../utils/ccavutil.js"),
     qs = require("querystring");
const { parse } = require('path');


workingKey = "49A91DFE5E7F1E9633631C7CFB6CFF99", //Put in the 32-Bit key shared by CCAvenues.
     accessCode = "AVPA17II14AH62APHA",
     merchant_id = 459896,
     currency = "INR",
     redirect_url = "http://192.168.1.2:3001/checkout/ccavResponseHandler";
cancel_url = 'http://192.168.1.2:3001/checkout/ccavResponseHandler';
axios = require('axios');
exports.checkout = async (req, res) => {
     try {
          // // // // // // // console.log("this is checkout ---------------++++++++++++++++", req.user.id);
          req.body.merchant_id = merchant_id;
          req.body.currency = currency;
          req.body.redirect_url = redirect_url;
          req.body.cancel_url = cancel_url;
          req.body.language = "en"
          const customerID = mongoose.Types.ObjectId(req.user.id);
          const condition = { saveType: 'cart', cusotmerId: customerID };
          var cartResult = await cartService.getAllCartProduct(condition);

          // // // // // // // console.log("this is checkout ", req.user.id);
          //order save method
          var delivaryObj = {
               customerId: customerID,
               quentiy: req.body.quantity,
               price: req.body.total_amount,
               shippingcharge: req.body.shipping_charges,
               customerInfo: [
                    {
                         name: req.body.customer_name,
                         email: req.body.customer_email,
                         phone: parseInt(req.body.customer_mobile),
                    }
               ],
               shippingDetails: [
                    {
                         name: req.body.delivery_name,
                         phoneNo: parseInt(req.body.delivery_mobile),
                         address: req.body.delivery_address,
                         city: req.body.delivery_city,
                         states: req.body.delivery_state,
                         pincode: parseInt(req.body.delivery_pin)
                    }
               ]
          }

          // // // // // // // console.log("this is delivary",delivaryObj)
          var deilvaryResutl = await checkoutService.savedevliary(delivaryObj);

          //  // // // // // // console.log("this is delivary",deilvaryResutl,cartResult)










          // // // // // // // console.log("this is produt in cart", cartResult);
          if (cartResult != null) {
               var totalPrice = 0
               // // // // // // console.log("this is cart chekc",cartResult)

               for (const element of cartResult) {
                    var conditon = { _id: element.productId }

                    var productResult = await checkoutService.getProduct(conditon)



                    for (const element2 of productResult.productVariant) {


                         // // // // // // console.log("this is rate1",(element2.id == element.varientId))
                         if (element2.id == element.varientId) {
                              // // // // // // console.log("ture",element2)// this line is not wokring check your logic
                              // productObj.perPrice = element2.maximumRetailPrice;
                              // // // // // // console.log("this is rate", element2.maximumRetailPrice)
                              totalPrice = totalPrice + element2.maximumRetailPrice
                              orderObj = {
                                   orderId: deilvaryResutl._id,
                                   productId: element.productId,
                                   varientId: element2.id
                              }


                              // // // // // // console.log('this is is order', orderObj, req.body);
                              var newOrderResult = await checkoutService.saveNewOrder(orderObj)
                              // // // // // // console.log("this is checkout service\\\\\\\\\\\\\\\\\\\\", newOrderResult)
                         }





                    }
                    // // // // // // console.log("this is totalprice",totalPrice)
                    // productInfo.push(productObj)

               }



          }
          // // // // // // console.log("this is toalal amount yo..........", totalPrice);
          // req.body.seachmaInfo = productInfo;
          //  req.body.amount = req.body.total_amount;
          req.body.amount = 1;

          req.body.order_id = deilvaryResutl._id.toString()
          // // // // // console.log("this req.body&&&&&&&&&&&&&&&&&&&&&&", req.body)
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
          var response = { message: "Successfully product added into cart.", error: false, data: encRequest };
          // // // // // console.log("this is decr----------------++++++++++",response)
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(response);
     } catch (error) {

     }
}

exports.doneCheckout = async (request, response) => {

     // // // // // // console.log("inside call",request.body)

     var ccavEncResponse = "";

     ccavEncResponse += querystring.stringify(request.body);

     const ccavPOST = qs.parse(ccavEncResponse);

     var encryption = ccavPOST.encResp;

     ccavResponse = querystring.decode(await ccav.decrypt(encryption, workingKey))

     console.log("this is json info ---------------",ccavResponse);
       if(ccavResponse.order_status == 'Success'){

     var condition = { _id: mongoose.Types.ObjectId(ccavResponse.order_id) };
     var updateObj = { deliveryStatus: true, tarkingId: ccavResponse.tracking_id, paymentMode:'perpaid' };
     var updateDelivary = await checkoutService.updatedelivaryData(condition, updateObj)


     if (updateDelivary) {

     //     let delivaryCondition = { _id: }
         var devilaryData = await  checkoutService.getOrder(condition);
         var additionInfo = {
          quantity:devilaryData[0].quentiy,
          price : devilaryData[0].price,
          shippingcharge: devilaryData[0].shippingcharge
         }
     //     console.log("this is devilary-------",devilaryData);

     //     return false;
          var dispachResult = await createDeliveryOrder(devilaryData[0].customerInfo,devilaryData[0].shippingDetails,additionInfo)
          console.log("thsi is ", dispachResult);
          if(dispachResult.available_logistic[0]){
               console.log(dispachResult.orderStatus)
               var updateDelivaryData ={delivaryTrakingId:dispachResult.ewaybill_number};
               var finalData = await checkoutService.updatedelivaryData(condition,updateDelivaryData);
               // console.log("this is findal result",finalData);
                response.redirect('http://localhost:3001/order-confirmation');
          }

          // response.redirect('http://localhost:3001/order-confirmation');
     }
       }else{
     response.redirect('http://localhost:3001/order-failed');
       }





}

createDeliveryOrder = async (deliveryObj,shippingObj,additionInfo) => {
     // console.log("this is  devliary",deliveryObj,shippingObj,additionInfo)
     let delivaryName = deliveryObj[0].name.split(' ');
     let shippingName = shippingObj[0].name.split(' ');

     var delivaryFistName=delivaryName[0];
     var delivaryLastName = delivaryName[1];
     var shippingFirstName = shippingName[0];
     var shippingLastName = shippingName[1];
     // console.log(deliveryObj[0].email,shippingObj[0].address,shippingObj[0].city);
     // return false;
     var url = "https://api.yolojet.com/api/v1/core-api/create";
     var requestParms = {
          "payment_method": "cod",
          "first_name": delivaryFistName,
          "last_name": delivaryLastName,
          "email": deliveryObj[0].email,
          "mobile_number":deliveryObj[0].phone,
          "pickup_address": {
               "line1": "RZ G-26",
               "line2": "Mahavir Enclave",
               "country": "india",
               "state": "delhi",
               "city": "new delhi",
               "postcode": 110037,
               "email": "test@gmail.com",
               "mobile_number": "7896541230"
          },
          "drop_address": {
               "line1": shippingObj[0].address,
               "line2": shippingObj[0].address,
               "country": "india",
               "state": shippingObj[0].states,
               "city": shippingObj[0].city,
               // "postcode": shippingObj.pincode
               "postcode": 110037
          },
          "billing_address": {
               "line1": shippingObj[0].address,
               "line2": shippingObj[0].address,
               "country": "india",
               "state": shippingObj[0].states,
               "city": shippingObj[0].city,
               // "postcode": shippingObj.pincode
               "postcode": 110037
          },
          "rto_address": {
               "line1": shippingObj[0].address,
               "line2": shippingObj[0].address,
               "country": "india",
               "state": shippingObj[0].states,
               "city": shippingObj[0].city,
               // "postcode": shippingObj.pincode
               "postcode": 110037
          },
          "product_details": {
               "master_sku": "master sku",
               "product_name": "M1",
               "quantity": additionInfo.quantity,
               "selling_price": additionInfo.price,
               "length": "10",
               "breadth": "10",
               "height": "10",
               "weight": "1"
          }

     }

     let config = {
          headers: {
               "Content-Type": "application/json",
               'api-key': 'f6f89a3d-5a72-468b-b659-1cc6b6316a51',
          }
     }
     // // // // // // console.log("there is delivary mehtod",requestParms)
     // return false


      var newvar ="";

    await axios.post(url, requestParms, config)
          .then(function (response) {
               // console.log("this is resposnassdfdsfdsade", response.data);
                newvar = response.data
             
          })
          .catch(function (error) {
               console.log("this is ", error);
               return "it's error"

          });

// console.log("calling done",newvar)

return newvar




}

exports.getOrders = async (req, res) => {
     let condition = { customerId: mongoose.Types.ObjectId(req.user.id), deliveryStatus: true }
     // // // // // // console.log("this is condition",condition)
     var orderResult = await checkoutService.getOrder(condition);
     // console.log("this is result",orderResult)
     var response = { message: "Order is empty.", error: true, data: {} };
     if (orderResult) {
          response = { message: "Successfully retrieved from order.", error: false, data: orderResult };
     }
     res.statusCode = 200;
     res.setHeader('Content-Type', 'application/json');
     res.json(response);
}

exports.orderDetails = async (req, res) => {
     // // // // // // console.log(req.body)
     let orderCondition = { _id: mongoose.Types.ObjectId(req.body.id) };

     var orderResult = await checkoutService.getOrder(orderCondition);
     // // // // // // console.log("this is order result", orderResult)
     // return false;
     if (orderResult !== null) {
          let productCondition = { orderId: orderResult[0]._id };
          var productResult = await checkoutService.getOrderWithPopultate(productCondition);
          // // // // // // console.log("thisis order detalis",productResult)
          // return false;
          var fullDetails = {
               delivaryInfo: orderResult[0],
               orderInfo: productResult
          }
          var response = { message: "Successfully retrieved from order.", error: false, data: fullDetails };
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(response);
     } else {
          var response = { message: "enter correct order id.", error: true, data: {} };
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.json(response);
     }
}

exports.checkDelivery = async (req, res) => {
     var headers = {
          'api-key': '8163dbee-5169-4ed8-a533-553af9c56cf6'
     }
     console.log("this is req.body",req.body)
     let pincode = parseInt(req.body.pincode)
     var queryString = "http://116.68.244.131/api/v1/core-api/pin-serviceable?payment_method=cod&selling_price=100&source_pin=110037&destination_pin="+pincode+"&length=10&breadth=10&height=10&weight=1"
     axios.get(queryString, { headers: { 'api-key': '8163dbee-5169-4ed8-a533-553af9c56cf6' } })
          .then(function (response) {
               console.log(response.data);
               var response = { message: "Successfully retrieved from order.", error: false, data: response.data };
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(response);
          })
          .catch(function (error) {
               // // // // // // console.log(error);
          });
}

exports.getTackingStatus = async (req, res) => {
     var TrackId = req.body.TrackId;
     console.log("this is ",TrackId,req.body)
     var queryString = "http://116.68.244.131/api/v1/core-api/track?ewaybill_number=CC0001328255"
     console.log("this is query",queryString)
     axios.get(queryString)
          .then(function (response) {
               console.log(response.data);
               var response = { message: "Successfully retrieved from order.", error: false, data: response.data };
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(response);
          })
          .catch(function (error) {
               // // // // // // console.log(error);
          });
}