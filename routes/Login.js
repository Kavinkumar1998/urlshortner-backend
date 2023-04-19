import express from "express";
import {User,generateAuthToken} from "../Model/Users.js"
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";


const router = express.Router();
dotenv.config();

//router for login
router.post("/Login",async(req,res)=>{
    try{
const{Email,Password}=req.body;
const user = await User.findOne({Email:Email});
if(!user){
    res.status(400).json({message:"User not Found"});
}
   const ValidatePassword = await bcrypt.compare(Password,user.Password);
   if(!ValidatePassword){
    res.status(400).json({message:"Invalid Password"});
   }
   else{
    const token =  generateAuthToken(user._id);
    let Id=user._id
    res.status(200).json({message:"Logged in successfully",token,Id})
   }

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
})



///router for forget password
router.post("/Forgetpassword",async(req,res)=>{
    try{
const {Email}= req.body;
const user = await User.findOne({Email:Email});
if(!user){
    res.status(400).json({message: "User not found"});
}else{

    const randomnumber= Math.floor(100000 + Math.random()*900000);
    const setotp= await User.updateOne({Email:Email},{$set:{OTP:randomnumber}});
    const sender =  nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.email,
            pass:process.env.password,
        }
    });
    const composemail = {
        from:process.env.email,
        to:Email,
        subject:"OTP for Password Reset",
        text:`${randomnumber}`,
    };
    sender.sendMail(composemail,(error,info)=>{
        if(error){
            console.log(error);
            return res.status(400).json({message:"sending error"});
        }
        else{
            res.status(200).json({message:"Email sent"});
        }
    });

}
res.status(200).json({message:"Mail sent to your Email"})
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
});


//router for verifying otp

router.post("/verifyotp",async(req,res)=>{
    try{
const {OTP}=req.body;
const otp = +OTP;
const verifyotp = await User.findOne({OTP:otp});
console.log(verifyotp);
if(!verifyotp){
    return res.status(400).json({message:"Invalid OTP"});
}else{
    const deleteotp = await User.updateOne({OTP:otp},{$unset:{OTP:otp}});
    return res.status(200).json({message:"Sucessfully verified"});
}
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
});

//route with setpassword
router.post("/setPassword",async (req,res)=>{
    try{
const {Email,Password}=req.body;
let user = await User.findOne({Email:Email});
if(!user){
    res.status(400).json({message:"Email not exists"});
}
else if(Password.length<8){
    return res.status(400).json({message:"Password must be at least 8 charcters"});
}
else{
    const salt = await bcrypt.genSalt(10);
    const hassedPassword = await bcrypt.hash(Password,salt);
    const updated={
        Email:Email,Password:hassedPassword
    }
    const update = await User.findOneAndUpdate({Email:Email},{$set:updated});
    res.status(200).json({message:"Password updated successfully"});
}
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
})



export const loginRouter= router;