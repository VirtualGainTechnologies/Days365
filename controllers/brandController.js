const brandService = require('../services/brandService');
const productService = require('../services/productService');
const { validationResult } = require('express-validator');
const { ErrorBody } = require('../utils/ErrorBody');
const mongoose = require('mongoose');
const { response } = require('../app');

exports.addBrand = async (req, res, next) => {
    try {
      
            var data = req.body;
            var brandName = data.brandName;
            var Percentage = data.Percentage;
            var category = data.category;
            var registrationNo = data.registrationNo;
            var brandWebsite = data.brandWebsite; 
            var imageLocation = req.file ? req.file.location : null;
            const brand = await brandService.isBrandExists({brandName: brandName}, null, { lean: true });
            if (brand) {
                return res.status(200).json({
                    message: 'Similar brand already exists.',
                    error: false,
                    data: brand 
                });
            }else{
            var reqBody = {
                brandName: brandName,
                registrationNo: registrationNo,
                brandWebsite: brandWebsite,
                category: category,
                Percentage:Percentage,
                image: imageLocation, 
                status: 'Pending'
            }
            const result = await brandService.createBrand(reqBody);
            res.status(201).json({
                message: 'Successfully Added Brand',
                error: false,
                data: result 
            });
        }
    } catch (error) {
        console.log(error);
        next({});
    }
}

exports.getBrands = async(req, res, next) => {
    try{
        console.log("#################3333",req.body);
        let options = {"status":{ $in: req.body}}
        const result = await brandService.getBrand(options,null, { lean: true });

        var response = { message: "No Record Found.", error: true, data: [] };
        if(result){
            response = { message: "Successfully retrieved products.", error: false, data: result};
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);

    }catch (error) {
        console.log(error);
        next({});
    }
}

exports.changeStatus = async(req, res, next) => {
    try{
        var id = req.body.id;
        var status = req.body.status;

        const result = await brandService.changeStatus({_id: id}, {$set : {status:status}}, {lean: true});
        
        var response = { message: "No record found.", error: true, data: {} };
        if(result){
            response = { message: "Successfully Changed Brand Status", error: false, data: result};
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);


    }catch(error){
        console.log(error)
        next({});
    }
}
