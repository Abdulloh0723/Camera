const {model, Schema} = require("mongoose");
 const mahsulot = new Schema({
    nomi:{ 
        type:String,
        required:true
    },
    turi:{
        type:String,
        // required:true
    },
    narxi:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },

    category:{
        type: Schema.Types.ObjectId,
        ref: "Category",
        required:true
    }
  
 });

module.exports = model("Mahsulot" , mahsulot);