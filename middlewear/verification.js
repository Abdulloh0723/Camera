module.exports = function(req , res , next){
    if(!req.session.tizimgaKirildi){
        res.redirect('/login')
    }
    next()
}