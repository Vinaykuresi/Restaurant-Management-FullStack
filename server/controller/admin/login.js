/**
 * @fileoverview This file generates a new JWT for new user, if authenticated
 * and verifies an existing JWT.
 * @author Vinay Kuresi
 */

const JWTCertifier = require("../../helpers/JWTCertifier"),
passport = require('passport');
 
 
 exports.adminLogin = (req, res, next) => {
     try{
        passport.authenticate('login', (err, user, info) => {
            if (err) {
                res.status(403).json(err);
            }
            if (info != undefined) {
                res.status(403).json(info);
            } else{
                let token = JWTCertifier.generateJWT(user)
                res.status(200).json({
                    token,
                    name:user.name,
                    status: true
                })
            }
        })(req, res, next);
     }catch(error){
         res.status(400).json(error)
     }
}

