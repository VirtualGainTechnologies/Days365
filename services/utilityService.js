const { utilityModel } = require('../models/utilityModel');




/**
 * Create Uility document
 */

exports.createUtilityRecord = async (reqBody = {}) => {
    return await utilityModel.create(reqBody);
}


/**
 * Get utility document
 */

exports.getUtilityRecord = async (filters = {}, projection = null, options = {}) => {
    return await utilityModel.findOne(filters, projection, options);
}