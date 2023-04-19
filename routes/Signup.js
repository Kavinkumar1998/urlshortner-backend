import express from "express";
import bcrypt from "bcrypt";
import { User, generateAuthToken } from "../Model/Users.js";




const router = express.Router();

router.post("/Signup",async (req,res)=>{
    try{
const{FirstName,LastName,Email,Password}=req.body;
let user =  await User.findOne({Email:Email});
if(user){
res.status(400).json({message:"User Already Exists"});
}else if(Password.length < 6){
    res.status(400).json({message:"Password must be 8 characters"});
} else{
    const salt = await bcrypt.genSalt(10);
    const Hassedpassword = await bcrypt.hash(Password,salt);
    user = await User({
        FirstName:FirstName,
        LastName:LastName,
        Email:Email,
        Password:Hassedpassword
    }).save();
    const token = generateAuthToken(user._id);
    res.status(200).json({message:"SignedUp Sucessfully",token});
}
    }catch(error){
        console.log(error);
res.status(500).json({message:"Internal Server Error"});
    }
});


export const signupRouter = router;