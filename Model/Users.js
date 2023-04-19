import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    FirstName:{
        type:String,
        required:true,
    },
    LastName:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
    },
    Password:{
        type:String,
        required:true,
        minlength:6,
    },
    OTP:{
        type:Number
    }
});

const User = mongoose.model("User",userSchema)


const generateAuthToken = (id)=>{
    return jwt.sign({id},process.env.Secret_key)
}
export  {User,generateAuthToken};