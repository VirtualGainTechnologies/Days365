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
            var category = data.category;
            var registrationNo = data.registrationNo;
            var brandWebsite = data.brandWebsite; 
            var imageLocation = req.file ? req.file.location : null;
            const brand = await brandService.isBrandExists({brandName: brandName}, null, { lean: true });
            if (brand) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ message: "Similar brand already exists.", error: true, data: {} });
            }else{
            var reqBody = {
                brandName: brandName,
                registrationNo: registrationNo,
                brandWebsite: brandWebsite,
                category: category,
                image: imageLocation, 
                status: 'Pending'
            }
            const result = await brandService.createBrand(reqBody);
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: 'Successfully added product', error: false, data: result });
        }
    } catch (error) {
        console.log(error);
        next({});
    }
}

exports.getPendingBrand = async(req, res, next) => {
    try{
        const result = await brandService.getPendingBrand();

        var response = { message: "No record found.", error: true, data: {} };
        if(result){
            response = { message: "Successfully retrieved products.", error: false, data: result};
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);



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
            response = { message: "Successfully changed brand status", error: false, data: result};
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);


    }catch(error){
        console.log(error)
        next({});
    }
}

exports.uploadFile = async(req, res, next) => {
    try{

        /*let brandFileNames=[];
        for(let file of req.files)
        {
            brandFileNames.push(file.location)
        }
        let reqBody = {
            images: brandFileNames    
        }
        */
        let imageLocation = req.file ? req.file.location : null;
        let reqBody = {
            
        }
        if (imageLocation) {
            reqBody['image_URL'] = imageLocation;
        }
        
        console.log(reqBody);
        /*await categoryService.createCategory(reqBody);
            var response = {
                message: 'Root successfully created.',
                error: false,
                data: {}
            };
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);   */

        const result = await brandService.uploadFile(reqBody);
        res.json(result)

        


    }catch(error){
        next({});
    }

}

