const { vendorDetailsModel } = require('../models/vendorDetailsModel');
const { deleteFileFromPrivateSpace } = require('../utils/fileUpload');





exports.createVendorDetailsRecord = async (reqBody) => {
    return await vendorDetailsModel.create(reqBody);
}

exports.getVendorDetailsRecord = async (filters) => {
    return await vendorDetailsModel.findOne(filters);
}

exports.updateVendorDetails = async (filters, updateQuery) => {
    return await vendorDetailsModel.findOneAndUpdate(filters, updateQuery, { new: true });
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
