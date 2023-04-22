import express from "express";
import {URL} from "../Model/Url.js"
const router = express.Router();


//router for link

router.get("/:shorturl",async(req,res)=>{
    try{
const shorturl = req.params.shorturl;
console.log(shorturl)
const url = await URL.findOne({shorturl:shorturl});
if(!url){
    res.status(400).json({message:"Invalid URL"});
}else{
    let click = url.click;
    click++;
   let updated = await URL.updateOne({ shorturl: url.shorturl, click: click });
   const longurl = await URL.findOne({shorturl:shorturl});
   res.status(200).redirect(longurl.longurl);;
    
}
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
})


const redirectrouter = router;
export {redirectrouter}