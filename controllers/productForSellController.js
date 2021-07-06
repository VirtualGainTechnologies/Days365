/*********************************
CORE PACKAGES
**********************************/
const mongoose = require('mongoose');

/*********************************
MODULE PACKAGES
**********************************/
const productService = require('../services/productForSellService');
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
    const result = await productService.getAllProduct(options,null, { lean: true });
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

    const brandList = await productService.getBrandList(options,null, { lean: true });
    console.log("@@@@@@@@@@@@@@@@@@@@@",brandList);
}