/**
 * @fileoverview Mongoose model for adding meal data.
 */
 const mongoose = require('mongoose');

 const mealSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    price: {
        type: String,
        required:true,
    },
    cusine: {
        type: String,
        required:true,
    },
    photo:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    time:{
        type: String,
        required: true,
    },
    dishes:[
        {
            name:{
                type: String,
                required: true,
            },
            type:{
                type: String,
                required: true,
            },
            ingredients:[
                {
                   name:{
                    type: String,
                    required: true,
                   },
                   quantity:{
                    type: String,
                    required: true,
                   },
                   units:{
                    type: String,
                    required: true,
                   }
                }
            ]
        }
    ]
 })

mealSchema.set("collection","mealDetails");
module.exports = mongoose.model('mealDetails', mealSchema); 