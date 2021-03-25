const router = require('express').Router(),
      adminRegister = require('../admin/register'),
      adminLogin = require("../admin/login"),
      mealModel = require("../../DatabaseSchema/mealModel"),
      passport = require("passport"),
      deleteMeal = require("../mealItems/deleteMeal"),
      addMeal = require("../mealItems/addMeal"),
      updateMeal = require("../mealItems/updateMeal");

router.post("/register",adminRegister.adminRegister);
router.post("/login",adminLogin.adminLogin);
router.post("/deletemeal",deleteMeal.deleteMeal);
router.post("/addmeal",addMeal.addMeal);
router.post("/updatemeal",updateMeal.mealUpdate);
router.post("/mealDetails",(req, res, next)=>{
    try{
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                res.status(403).json('API key not provided');
            }
            if (info != undefined) {
                res.status(403).json('Token not valid');
            } else {
                if(user[1] === 2){
                    mealModel.find({}, (err, meals)=>{
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
        res.status(400).json(err)
    }
});

module.exports = router;