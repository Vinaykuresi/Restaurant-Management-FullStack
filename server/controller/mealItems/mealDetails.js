/**
 * @description Controller used to get meal details
 * @author Vinay Kuresi
 */

 const meals = require("../../DatabaseSchema/mealModel");

//  projecting only required fields to fetch
 exports.mealDetails = (req, res) => {
    try{
        meals.find({},'-_id -dishes', (err, meals)=>{
            if(err) {
                res.status(400).json(err);
            }
            else if(meals.length == 0){
                res.status(400).json("User does not exits. Please register yourself.");
            }else{
                res.status(200).json(meals)
            }
        })
    }catch(error){
        res.status(400).json(error)
    }
 }
