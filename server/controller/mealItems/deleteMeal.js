/**
 * @description Controller used to delete the meal item.
 * @author Vinay Kuresi
 */

 const meals = require("../../DatabaseSchema/mealModel"),
       passport = require("passport");

exports.deleteMeal = (req, res, next) => {
    try{
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                res.status(403).json('API key not provided');
            }
            if (info != undefined) {
                res.status(403).json('Token not valid');
            } else {
                if(user[1] === 2){
                    meals.deleteOne({name:req.body.mealItem}, (err, meals)=>{
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
        res.status(400).json(error)
    }
}