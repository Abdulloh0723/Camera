const {Router} = require("express");
const router = Router();
const Category = require('../models/category.js');
const verification = require("../middlewear/verification.js");
// const 
router.get('/'  , verification ,  async(req , res)=>{
    try {
      const user_auth = req.session.tizimgaKirildi;
        const category = await Category.find();
        res.render('add/category',{ user_auth, category , IsCategory:true , } ) 
    } catch (error) {
        console.log(error);
        
    }
    
})
router.post('/add' , verification , async(req ,  res ) =>{
  
try {
    const {nomi} = req.body
  const category = new Category({nomi})

  category.save()
//   console.log(req.body);
  res.redirect('/category')
  
} catch (error) {
    console.log(error);
}


})


router.get("/:id" , verification , async(req , res)=>{
  try {
    const category = await Category.findById(req.params.id);
    
    res.render("add/categoryEdit" , {category , layout:"sub"});
  } catch (error) {
    console.log(error)
  }
});

router.post('/edit' , verification , async(req , res) =>{
  await Category.findByIdAndUpdate(req.body.id , req.body);
  res.redirect("/category");
})


router.post("/delete" , verification , async(req , res)=>{
  try {

      await Category.findByIdAndDelete(req.body.id);
      res.redirect("/category");
  } catch (error) {
      console.log(error);
  }
});


module.exports = router;