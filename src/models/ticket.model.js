import mongoose from "mongoose";

const ticketCollection = "ticket";

const ticketSchema = new mongoose.Schema({
    //id generado por MongoDB
    code:{
        type:String,
        unique:true,
        required:true
    }, 

    amount:{
        //total de la compra
        type:Number,
        required:true
    },

    //email del usuario asociado al carrito
    purchaser:String,
},
{ /*según argumento del Schema genera el campo
     purchase_datetime automaticamente */
    timestamps: { createdAt: 'purchase_datetime', updatedAt: false }
  }

);

export const ticketModel = mongoose.model(ticketCollection,ticketSchema);