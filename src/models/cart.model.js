import mongoose from "mongoose";

const cartCollection ="cart";

/*products: es un  array de objeto (va a recebir muchos)
product: una ref al id del producto de la coleccion product.model
quantity: la cantidad del producto */

const cartSchema = new mongoose.Schema({
    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId, ref : "product", required: true
            },

             quantity:{
                type:Number,
                 default:1
            },
        },
    ]

});

export const cartModel = mongoose.model(cartCollection,cartSchema);