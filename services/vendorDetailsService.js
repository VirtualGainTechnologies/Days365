const { vendorDetailsModel } = require('../models/vendorDetailsModel');
const { deleteFileFromPrivateSpace } = require('../utils/fileUpload');





exports.createVendorDetailsRecord = async (reqBody = {}) => {
    return await vendorDetailsModel.create(reqBody);
}

exports.getVendorDetailsRecord = async (filters = {}, projection = null, options = {}) => {
    return await vendorDetailsModel.findOne(filters, projection, options);
}

exports.updateVendorDetails = async (filters = {}, updateQuery = {}, options = {}) => {
    return await vendorDetailsModel.findOneAndUpdate(filters, updateQuery, options);
}


/**
 * Bulk delete uploded private files
 */

exports.privateFilesBulkDelete = async (files = []) => {
    const length = files.length;
    var i = 0;
    while (i < length) {
        try {
            let fileName = files[i].key;
            await deleteFileFromPrivateSpace(fileName);
        } catch (error) {
            //Nothing to do
        }
        i++;
    }
}
