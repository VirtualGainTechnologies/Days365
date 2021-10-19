const mongoose = require('mongoose');
const MpathPlugin = require('mongoose-mpath');
const Schema = mongoose.Schema;


const delivaryTable = new Schema(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            required: true
        },

        quentiy: {
            type: Number,
            required: true,
            default: 1
        },
        price: {
            type: Number,
            default: 0
        },

        isDelete: {
            type: Boolean,
            default: false
        },


        deliveryStatus: {
            type: Boolean,
            default: false
        },


        shippingcharge: {
            type: Number,
            default: true
        },

       delivaryTrakingId:{
           type:String,
           default:null
       },

        tarkingId: {
            type: Number,
            default: null
        },
        paymentMode:{
            type: String,
            default:null
        },

        customerInfo: [
            {
                name: {
                    type: String,
                    default: null
                },
        
            
                email: {
                    type: String,
                    default: null
                },
            
            
                phone: {
                    type: Number,
                    default: null
                },
            
            
                pincode: {
                    type: Number,
                    default: null
                },
            }
        ],
        shippingDetails: [
            {
                name: {
                    type: String,
                    default: null
                },
                phoneNo: {
                    type: Number,
                    default: null
                },
                address: {
                    type: String,
                    default: null
                },
                city: {
                    type: String,
                    default: null
                },
                states: {
                    type: String,
                    default: null
                },
                pincode: {
                    type: Number,
                    default: null
                }
            }
        ],
    },
    {
        timestamps: true, _id: true
    }
)


const delivaryModel = mongoose.model('delivarymodel_documents', delivaryTable);
module.exports = {
    delivaryModel
};