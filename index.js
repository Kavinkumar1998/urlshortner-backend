import express from "express";
import dotenv from  "dotenv";
import cors from "cors";
import { DatabaseConnection } from "./DatabaseConnection.js";
import { signupRouter } from "./routes/Signup.js";
import { loginRouter } from "./routes/Login.js";
import { ShortnerRouter } from "./routes/Urlshortner.js";
import { isSignedIn } from "./routes/Autherization.js";





dotenv.config();
DatabaseConnection();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

app.get("/",(req,res)=>{
    try{
res.send("Welcome To App Server")
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"},error)
    }
});

app.use("/",signupRouter)
app.use("/",loginRouter)
app.use("/",isSignedIn ,ShortnerRouter)
app.listen(PORT,()=>console.log(`Server Started at ${PORT}`));