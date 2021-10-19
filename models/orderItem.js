const mongoose = require('mongoose');
const MpathPlugin = require('mongoose-mpath');
const Schema = mongoose.Schema;
const orderItem = new Schema(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            required: true,
            
        },
        productId: {
            type: Schema.Types.ObjectId,
            required: true,
            
        },
        varientId: {
            type: Schema.Types.ObjectId,
            required: true,
            
        }

    },
    {
        timestamps: true, _id: true
    }
)
const orderModel = mongoose.model('orderModel_documents', orderItem);
module.exports = {
    orderModel
};
