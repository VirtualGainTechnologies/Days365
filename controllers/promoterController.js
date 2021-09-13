/*********************************
CORE PACKAGES
**********************************/
const mongoose = require('mongoose');

/*********************************
MODULE PACKAGES
**********************************/

const { validationResult } = require('express-validator');
const promoterService = require('../services/promoterService');
const { ErrorBody } = require('../utils/ErrorBody');
const { verifyPassword, encryptPassword, verifyEmail, sendOTP, isMobileOrEmail, userLogin } = require('../services/commonAccountService');


/**
 * Getting promoter list
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 30/06/2021
 * @usedIn : Admin
 * @apiType : POST
 * @lastModified : 30/06/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : 
 * @version : 1
 */

 exports.getPromoterList = async (req, res, next) => {
    try {
        //req.query;
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }else {

            let options ={};
            if(req.query && req.query.type =="promoter"){
                options._id = mongoose.Types.ObjectId(req.user.id);
            }
           
            let projection ={
                "userName":1,"Email":1,"Name":1,"mobileNumber":1,"Address":1,"BankName":1,"AccountNo":1,"IFSCCode":1
            };
            options.isBlocked =false;
          
            const result = await promoterService.getPromoterList(options,projection, { lean: true });
            if (result && result.length) {
                var response = { message: "Successfully getting Product List", error: false, data:result};
            }else{
                var response = { message: "No Record Found.", error: true, data: [] };
            }
            res.status(201).json(response);
        }
        
    } catch (error) {
        next({});
    }
}

/**
 * Save Bank Details of Promoter.
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 30/06/2021
 * @usedIn : promoter
 * @apiType : PUT
 * @lastModified : 30/06/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : _id,BankName,AccountNo,IFSCCode
 * @version : 1
 */

exports.saveBankDetails =async(req,res,next) => {
    try {

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }else {
            const id = mongoose.Types.ObjectId(req.body.id);
            let filters = {_id: id};
            let updateQuery = {
                BankName: req.body.BankName,
                AccountNo: req.body.AccountNo,
                IFSCCode: req.body.IFSCCode
            }

            let response ={};
            const result = await promoterService.addBankDetails(filters, updateQuery, { lean: true });
            if (result) {
                response = { message: 'Added Bank Details Successfully', error: false, data: {} };
            }else{
                response = { message: 'No Record Found.', error: true, data: {} };
            }
            res.status(200).json(response);
        }
        
    } catch (error) {
        console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",error);
        next({});
    }

}

/**
 * Generate Promocode promoter wise.
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 30/06/2021
 * @usedIn : Admin
 * @apiType : Post
 * @lastModified : 30/06/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : promoterName,sellerName,Brand
 * @version : 1
 */

exports.generatePromocode = async(req,res,next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        } else {
        
            var reqData = req.body;
            let promoterName = reqData.promoterName;
            let promoterId = mongoose.Types.ObjectId(reqData.promoterId);
            let sellerName = reqData.sellerName;
            let sellerId = mongoose.Types.ObjectId(reqData.sellerId);
            let brandName = reqData.brandName;
            let percentageOnBrand = reqData.percentageOnBrand;
        
            const promoterRecord = await promoterService.getPromoterRecord({ _id: promoterId }, null, { lean: true });
            if (promoterRecord && promoterRecord.isBlocked == true) {
                return next(new ErrorBody(400, 'Bad Inputs', []));
            } 
            const promoCodeGen = await promoterService.generatePromoCode(null, null, null);
            var reqBody = {
                promoterName:promoterName,
                promoterId:promoterId,
                sellerName:sellerName,
                sellerId:sellerId,
                brandName:brandName,
                promoCode:promoCodeGen,
                percentageOnBrand:percentageOnBrand
            }
            const result = await promoterService.create(reqBody);
            console.log("Successfully Created");
            res.status(201).json({
                message: 'Successfully Created',
                error: false,
                data: result 
            });
        }
    } catch (error) {
        console.log(error);
        next({});
    }   
}


/**
 * Getting promoCode list
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 30/06/2021
 * @usedIn : seller,promoter
 * @apiType : POST
 * @lastModified : 30/06/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : 
 * @version : 1
 */

 exports.getPromoCodeList = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }else {
            let options ={};
            let projection ={};

            if(req.query && req.query.type == "seller"){
             options = {"sellerId": mongoose.Types.ObjectId(req.user.id)}; 
            }else if(req.query && req.query.type =="promoter"){
                options = {"promoterId": mongoose.Types.ObjectId(req.user.id)}; 
            }else{

            }
            const result = await promoterService.getPromoCodeList(options,projection, { lean: true });
            if (result && result.length) {
                var response = { message: "Successfully getting promoCode List", error: false, data:result};
            }else{
                var response = { message: "No Record Found.", error: true, data: [] };
            }
            res.status(201).json(response);
        }
        
    } catch (error) {
        next({});
    }
}

/**
 * Getting seller list
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 01/07/2021
 * @usedIn : Admin
 * @apiType : POST
 * @lastModified : 01/07/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : 
 * @version : 1
 */

 exports.getSellerList = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }else {
             let options ={};
            if(req.query.type =="Approve"){
                options.account_status = "Approved";
            }
            let projection ={};
            const result = await promoterService.getSellerList(options,projection, { lean: true });
            if (result && result.length) {
                var response = { message: "Successfully getting Seller List", error: false, data:result};
            }else{
                var response = { message: "No Record Found.", error: true, data: [] };
            }
            res.status(201).json(response);
        }
        
    } catch (error) {
        next({});
    }
 }

 /**
 * Getting promoter list
 * @createdBy : VINAY SINGH BAGHEL
 * @createdOn : 30/06/2021
 * @usedIn : Admin
 * @apiType : POST
 * @lastModified : 30/06/2021
 * @modifiedBy : VINAY SINGH BAGHEL
 * @parameters : 
 * @version : 1
 */

  exports.getBankDetails = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ErrorBody(400, 'Bad Inputs', errors.array()));
        }else {
            let options ={};
            let projection ={
                "BankName":1,"AccountNo":1,"IFSCCode":1
            };
            options = {"isBlocked":false,"_id": mongoose.Types.ObjectId(req.user.id)};
            const result = await promoterService.getPromoterRecord(options,projection, { lean: true });
            if (result) {
                var response = { message: "Successfully getting Promoter List", error: false, data:result};
            }else{
                var response = { message: "No Record Found.", error: true, data: [] };
            }
            res.status(201).json(response);
        }
        
    } catch (error) {
        next({});
    }
}