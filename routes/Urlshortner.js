import express from "express";
import validurl from "valid-url";
import {URL} from "../Model/Url.js"
import shortid from "shortid";
const router = express.Router();


//roouter for post
router.post("/shorten",async(req,res)=>{
    try{
        const {longurl}= req.body;
const Validurl= validurl.isUri(longurl);
if(!Validurl){
    res.status(400).json({message:"Invalid URL"})
}else{
   let url = await URL.findOne({longurl:longurl});
    if(url){
        res.status(400).json({message:"URL akready exists"})
    }else{
        const shorturl= shortid.generate();
        url = await new URL({
            longurl :longurl,
            shorturl :shorturl,
            click:0,
            date: new Date()
        }).save();

        return res.status(200).send({ data: url.shorturl });
    }
}

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"})
    }
})


//router for getting url data

router.get("/alldata",async(req,res)=>{
   try{
    const Urls= await URL.find();
    res.status(200).json(Urls)
   }catch(error){
    console.log(error);
    res.status(500).json({message:"Internal Server Error"})
   } 
})


const ShortnerRouter =  router;

export{ShortnerRouter};