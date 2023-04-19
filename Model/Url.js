import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    longurl: { type: String,
         required: true },
    shorturl: { type: String,
        required: true },

        click: { type: Number,
             required: true, 
             default: 0 },

    date: { type: String, 
        required: true, 
        default: Date.now },
})

const URL = mongoose.model("URl",urlSchema);
export {URL}