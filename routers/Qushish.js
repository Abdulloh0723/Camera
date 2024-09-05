const {Router} = require('express')
const router = Router();
const bcrypt = require('bcryptjs')
const flash = require('connect-flash')
const Foydalanuvchi = require('../models/foydalanuvchi');
const verification = require('../middlewear/verification');

router.get('/' , verification, async(req , res)=>{
 
    const error = req.flash("error")
    const success = req.flash("success");
    try {
        const foydalanuvchi = await Foydalanuvchi.find();
        const user_auth = req.session.tizimgaKirildi;
        res.render('add/foydalanuvchi' , {error , success, foydalanuvchi, user_auth , IsFoydalanuvchi:true})
        
    } catch (error) {
        console.log(error);
    }
})

router.post('/add' , verification,  async(req  , res) =>{
    try {
    const {login , parol } = req.body;
    const alreadyUser = await Foydalanuvchi.findOne({login});
    if(alreadyUser){

        req.flash("error" , "Foydalanuvchi mavjud");
        res.redirect("/qushish");
    } else{
        const hashPassword = await bcrypt.hash(parol , 10)
        const foydalanuvchi = new Foydalanuvchi({
            login:login,
            parol:hashPassword
        })
        await foydalanuvchi.save();
        req.flash("success" , "Foydalanuvchi qo'shildi");
        res.redirect("/qushish"); 
     

    }
   
} catch (error) {
    console.log("error");
}
});


router.get("/:id" , verification, async(req , res)=>{
    try {
      const foydalanuvchi = await Foydalanuvchi.findById(req.params.id);
      res.render("add/foydalanuvchiEdit" , { foydalanuvchi ,  layout:"sub"});
    } catch (error) {
      console.log(error)
    }
});
router.post("/edit" , verification, async(req , res)=>{
  try {
    const {login , parol} = req.body;
      if(parol==''){
        res.redirect("/qushish");
      }
      else{
        const hashPass = await bcrypt.hash(parol , 10);
        req.body.parol = hashPass;
        console.log(req.body.parol)
        await Foydalanuvchi.findByIdAndUpdate(req.body.id , req.body);
        res.redirect("/qushish");
      }
  } catch (error) {
    console.log(error)
  }
});

router.post("/delete" , verification, async(req, res)=>{
    try {
        // if(req.session.user._id == req.body.id){
        //    req.flash("error" , "O'chirib bo'lmadi");
        //    res.redirect("/admin/register");
        // } else{
           await Foydalanuvchi.findByIdAndDelete(req.body.id);
           req.flash("succes" , "Foydalanuvchi o'chirildi");
           res.redirect("/qushish");
        // }
   } catch (error) {
       console.log("error");
   }
});

module.exports = router;