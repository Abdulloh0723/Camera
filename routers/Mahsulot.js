const {Router} = require("express");
const router = Router();
const path = require('path')
const fs = require('fs')
const fileCame = require('../middlewear/fileCame')
const Mahsulot = require('../models/mahsulot');
const Category = require('../models/category')
const verification = require('../middlewear/verification.js')
// const 
router.get('/'  , verification , async(req , res)=>{
    try {
        
    
        
        const mahsulot = await Mahsulot.find().populate("category");
        // res.json(mahsulot);
        // console.log(mahsulot)
        const category = await Category.find()
        const user_auth = req.session.tizimgaKirildi;
        // console.log(mahsulot)
        res.render('add/mahsulot' , {mahsulot , IsMahsulot:true , category , layout:"main" , user_auth})
    } catch (error) {
        console.log(error);
    }
    
})
router.post('/add' , fileCame , verification , async(req ,  res ) =>{
    try {
        const {nomi , turi , narxi, category } = req.body
        // console.log(req.body)
        const mahsulot = new Mahsulot({nomi , turi , narxi, img: req.file.filename , category })
    
        await mahsulot.save();
        // console.log(mahsulot);
        // console.log(req.body);
        res.redirect("/mahsulot");
    } catch (error) {   
        console.log(error); 
    }
   
})

router.get("/:id" , verification , async(req , res)=>{
    try {
      const mahsulot = await Mahsulot.findById(req.params.id);
      
      res.render("add/mahsulotEdit" , {mahsulot ,  layout:"sub" });
    } catch (error) {
      console.log(error)
    }
});

router.post('/edit' , verification , fileCame, async(req , res) =>{

    // await Mahsulot.findByIdAndUpdate(req.body.id , req.body);
    // res.redirect("/mahsulot");

    try {
        if(req.file){
            const EskiImg = path.join(__dirname, "../images/cameralar", req.body.EskiImg);
            fs.unlink(`${EskiImg}` , (err)=>{
                if(err){
                    console.error(err);
                }
            });
            req.body.img = req.file.filename
        };
        await Mahsulot.findByIdAndUpdate(req.body.id , req.body);
        // console.log(req.file);
        res.redirect("/mahsulot" );
    } catch (error) {
        console.log(error);
    }
})


router.post("/delete" , verification , async(req , res)=>{
    try {
        await Mahsulot.findByIdAndDelete(req.body.id);
        res.redirect("/mahsulot");
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;