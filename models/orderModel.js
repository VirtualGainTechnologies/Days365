const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    productId:{
        productId:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'product_documents',
            index: true
          },
          cusotmerId:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'user_registers',
            index: true
          },
          varientId:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'product_documents',
            index: true
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
             type:Number
         },
         state:{
             type:String
         }

    }
})