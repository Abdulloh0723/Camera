const {Router} = require('express');
const router = Router()
const flash = require('connect-flash')
// const User = require('../models/user')
const Foydalanuvchi = require('../models/foydalanuvchi')

router.get('/' , async(req , res)=>{
    const error = req.flash("error")
    const PasswordError = req.flash("PasswordError");
    try {
        const foydalanuvchi = await Foydalanuvchi.find();
        res.render('login' , {PasswordError, error , foydalanuvchi , IsFoydalanuvchi:true})
    } catch (error) {
        console.log(error)
    }
})


router.post("/" , async(req , res)=>{
    try {
        const {login , parol} = req.body;
        // console.log(parol);
        const bazaUser = await Foydalanuvchi.findOne({login});
        if(bazaUser){
            if(await bazaUser.parolTekshirish(parol)){
                req.session.foydalanuvchi = bazaUser;
                req.session.tizimgaKirildi = true;
                req.session.save((err)=>{
                    if(err) throw err;  
                    res.redirect('/')
                    console.log('Kirildi');

                })
                
            }else{
                console.log('Parol xato');
                req.flash("PasswordError" , "Parol noto'g'ri");
                res.redirect('/login')
            }
           
        } else{
            console.log('Foydalanuvchi topilmadi');
            req.flash("error" , "Foydalanuvchi topilmadi");
            res.redirect('/login')
        }
        
    } catch (error) {
        
    }
})

module.exports = router;
