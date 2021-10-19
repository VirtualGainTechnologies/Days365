const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
        productId:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'product_documents',
            
          },
          cusotmerId:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'user_registers',
            
          },
          varientId:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'product_documents',
            
          },
          quantity:{
            type: Number,
            required: true,
            default:1
         },
         price:{
            type:Number,
            default:0
         },
         isDeleted:{
            type:Boolean,
            default:false
         },
         orderId:{
             type: Number
         },
         shippingAddress:{
             type:String,
             defualt:null
         },
         contactNo:{
             type:Number
         },
         city:{
             type:String
         },
         state:{
             type:String
         }

    },{
        timestamps: true, _id: true   
})

const orderModel = mongoose.model('order_document',orderSchema);
module.exports = {
    orderModel
}