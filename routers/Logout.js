const {Router} = require("express");
const router = Router();
const verification = require("../middlewear/verification");


router.get('/' , verification , async(req ,res)=>{
    try {
        req.session.destroy(()=>{
            res.redirect('/')
            
        })
    } catch (error) {
        
    }
    })



    module.exports = router;
