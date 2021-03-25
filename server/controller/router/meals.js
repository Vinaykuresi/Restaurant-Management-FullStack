const router = require('express').Router(),
      mealDetails = require('../mealItems/mealDetails'),
      ingredientDetails = require("../mealItems/ingredientDetails");     


router.get("/",mealDetails.mealDetails);
router.post("/mealDetails",ingredientDetails.ingredientDetails);

module.exports = router;