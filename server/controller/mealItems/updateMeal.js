const meals = require("../../DatabaseSchema/mealModel"),
    passport = require("passport"),
    path = require("path"),
    uniqueIdGenerator = require("../../helpers/generateId"),
    multer = require('multer'),
    AWS = require("aws-sdk"),
    fs = require("fs");

const storage = multer.diskStorage({
    destination: "images",
    filename: function(req, file, cb){
        cb(null, "IMAGE"+ "-" +uniqueIdGenerator.generateUniqueId() + "-" + Date.now() + path.extname(file.originalname));
    }
});
    
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
}).single('photo');

exports.mealUpdate = (req, res, next) => {
    try{
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                res.status(403).json('API key not provided');
            }
            if (info != undefined) {
                res.status(403).json('Token not valid');
            } else {
                if(user[1] === 2){
                    meals.updateOne({"name":req.body.name},req.body,{upsert: true}, (err)=>{
                        if(err) {
                            res.status(400).json(err);
                        }
                        else if(meals.length == 0){
                            res.status(400).json({status:false,message:"out of time to order."});
                        }else{
                            res.status(200).json(meals)
                        }
                    })
                }else res.status(403).json('Token not valid');
            }
           })(req, res, next);
    }catch(error){
        res.status(400).json('eeror occured while updating')
    }
}