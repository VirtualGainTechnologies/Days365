const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
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
      saveType:{
          type:String,
          require:true,
          enum:['cart','wislist']
      },
      quantity:{
          type: Number,
          required: true,
          default:1
      },
      cartPrice:{
         type:Number,
         default:0
      },
      isDeleted:{
         type:Boolean,
         default:false
      }

},
{
    timestamps: true, _id: true 
})

const cartModel = mongoose.model('cart_documents', cartSchema);
module.exports = {
    cartModel
}