/*********************************
CORE PACKAGES
**********************************/
const mongoose = require('mongoose');

/*********************************
MODULE PACKAGES
**********************************/
const productForSellService = require('../services/productForSellService');
const { validationResult } = require('express-validator');
const { ErrorBody } = require('../utils/ErrorBody');

/*********************************
GLOBAL FUNCTIONS
**********************************/

/*********************************
MODULE FUNCTION
**********************************/

/**
 * get All product in customer dashboard.
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 18/06/2021
 * @usedIn : User Dashboard 
 * @apiType : GET
 * @lastModified : 18/06/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : 
 * @version : 1
 */
 exports.getProducts = async(req, res, next)=>{
    let options = {"status":"Active"};
    const result = await productForSellService.getAllProduct(options,null, { lean: true });
    if (result && result.length) {
        var response = { message: "Successfully getting Product List", error: false, data:result};
    }else{
        var response = { message: "No Record Found.", error: true, data: [] };
    }
    res.status(201).json(response);
}

/**
 * Filter Product Brand,Seller wise.
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 12/06/2021
 * @usedIn : User Dashboard 
 * @apiType : GET
 * @lastModified : 12/06/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : 
 * @version : 1
 */

 exports.getFiltersList = async (req, res, next) =>{

    const brandList = await productForSellService.getBrandList(options,null, { lean: true });
    console.log("@@@@@@@@@@@@@@@@@@@@@",brandList);
}

/**
 * get product variants Flaour wise.
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 13/07/2021
 * @usedIn : User Dashboard 
 * @apiType : POST
 * @lastModified : 13/07/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : 
 * @version : 1
 */
exports.getProductVariants = async(req,res,next)=>{
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        } else {
            var id = mongoose.Types.ObjectId(req.body.id);
            let options = {
                _id: id
            };
            const result = await productForSellService.getProductVariants(options,null, { lean: true });
            var response = { message: "No Record Found.", error: true, data: {} };
            if (result) {
                response = { message: "Successfully Retrieved Product Variants.", error: false, data: result };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        console.log("error...........",error);
        next({});
    }

}


/**
 * get product  variants size wise.
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 13/07/2021
 * @usedIn : User Dashboard 
 * @apiType : POST
 * @lastModified : 13/07/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : 
 * @version : 1
 */
 exports.getProductSizeVariants = async(req,res,next)=>{
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        } else {
            let options = {
                title: req.body.title,
                flavour:req.body.flavour, 
                size:req.body.size 
            };
            const result = await productForSellService.getProductSizeVariants(options,null, { lean: true });
            var response = { message: "No Record Found.", error: true, data: {} };
            if (result) {
                response = { message: "Successfully Retrieved Product Variants.", error: false, data: result };
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    } catch (error) {
        console.log("error...........",error);
        next({});
    }

}


