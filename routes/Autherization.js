import jwt from "jsonwebtoken";
import {User} from  "../Model/Users.js"
import dotenv from "dotenv";
dotenv.config();

const isSignedIn=async(req,res,next)=>{
    let token =  req.headers["x-auth-token"];
    if(token){
        try{
            const decode = jwt.verify(token,process.env.Secret_key);
            req.user= await User.findById(decode.id).select("-Password");
            next();
                }catch(error){
                    console.log(error);
                    return res.status(500).json({message:"Internal Server Error"});    }
            }
else{
    return res.status(400).json({message:"Access Denied"})
}
    }
    export {isSignedIn};