/**
 * @description Controller used to register Admin
 * @author Vinay Kuresi
 */
 const passport = require('passport');


 exports.adminRegister = (req, res, next) => {
     try{
        passport.authenticate('register', (err, user, info) => {
            if (err) {
                res.status(400).json(err)
            }
            if (info != undefined) {
                res.status(400).send(info);
            } else {
                res.status(200).json({status:true, message:"customer registered"})
            }
        })(req, res, next);
     }catch(error){
        res.status(400).json(error)
     }
 }