const {model, Schema} = require("mongoose");
 const category = new Schema({
    nomi:{ 
        type:String,
        required:true
    },
    // cameraTuri:{
    //     type:String,
    //     required:true
    // },
    // nvr:{
    //     type:String,
    //     required:true
    // },
    // monitor:{
    //     type:String,
    //     required:true
    // },
    // IshlashTuri:{
    //     type:String,
    //     required:true
    // },

  
 });

module.exports = model("Category" , category);