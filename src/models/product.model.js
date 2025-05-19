import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2";
const productCollection = "product";

const productSchema = new mongoose.Schema ({
    //id autogenerado por MongoDB
    title :{
        type: String, required : true
    },
    description: {
        type: String, required : true
    },
    code:{
        type:String,
         unique:true,
    },
    price:{
        type: Number, 
        required: true
    },
    status:{
        type:Boolean,
        default: true
    },
    stock:{
        type: Number,
        required: true
    },

        category:{
            type: String,
        },

        thumbnails:{
            type:[String],
             default:[]
        }
})

productSchema.plugin(mongoosePaginate);

export const  productModel = mongoose.model(productCollection,productSchema);