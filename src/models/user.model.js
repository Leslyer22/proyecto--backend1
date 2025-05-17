import mongoose from "mongoose";

const userCollection = "user";

const userSchema = new mongoose.Schema({
    first_name:{ 
        type: String,
        required: true },
    last_name:{ 
        type: String,
        required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true },
    age: { 
        type: Number, 
        required: true },
    password: { 
        type: String, 
        required: true },
    cartId: {
        type: mongoose.Schema.Types.ObjectId, ref: "cart",
    },
    role: {
        type: String, 
        required: true, 
        default: "user",
        enum: ["user","admin"]
    },

}, { timestamps: true }
);

export const userModel = mongoose.model(userCollection, userSchema);

