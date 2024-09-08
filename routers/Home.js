const {Router} = require("express");
const verification = require("../middlewear/verification");
const router = Router();
const Mahsulot = require('../models/mahsulot')
const Category = require('../models/category')
const Cart  = require('../models/cart')
router.get('/' , verification , async(req , res)=>{

    try {
        const mahsulot = await Mahsulot.find().populate("category");;
        const category = await Category.find()
        const cart = await Cart.find().populate("items.product")
        // console.log(mahsulot);
        
        // const menu = await Menu.find();
        const user_auth = req.session.tizimgaKirildi;
        res.render('index' , {user_auth , mahsulot , category ,cart ,   IsHome:true} )
    } catch (error) {
        console.log(error)  
    }



    
})





module.exports = router;