const { validationResult } = require('express-validator');
const vendorDetailsService = require('../services/vendorDetailsService');
const { ErrorBody } = require('../utils/ErrorBody');




exports.getStatus = async (req, res, next) => {
    try {
        var vendorId = req.user.id;
        var filters = { vendor_id: vendorId };
        const record = await vendorDetailsService.getVendorDetailsRecord(filters);
        

    } catch (error) {
        next({});
    }
}