const {model, Schema} = require("mongoose");
const bcrypt = require('bcryptjs')
 const foydalanuvchi = new Schema({
    login:{ 
        type:String,
        required:true
    },
    parol:{
        type:String,
        required:true
    }
  
 });


 foydalanuvchi.methods.parolTekshirish = async function(parol){
    return await bcrypt.compare(parol , this.parol)
}
module.exports = model("Foydalanuvchi" , foydalanuvchi);