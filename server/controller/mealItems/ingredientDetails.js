/**
 * @description Controller used to get the dishes and ingredients details of specific meal.
 * @author Vinay Kuresi
 */

 const meals = require("../../DatabaseSchema/mealModel"),
       passport = require("passport"),
       mealSpecificDetails = require("../../DatabaseSchema/mealModel");

 exports.ingredientDetails = (req, res, next) => {
     try{
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                res.status(403).json('API key not provided');
            }
            if (info != undefined) {
                res.status(403).json('Token not valid');
            } else {
                mealSpecificDetails.findOne({name:req.body.mealName}).then(details => {
                    res.status(200).json(details);
                })
                .catch(error => {
                    res.status(400).json(error);
                })
            }
          })(req, res, next);
     }catch(error){
        res.status(400).json(error)
     }
 }