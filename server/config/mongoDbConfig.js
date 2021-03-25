/**
* @fileoverview mongoDB configuration
*/
var mongoose = require("mongoose");
var chalk = require("chalk");
const MONGOURL = "mongodb://localhost:27017/RestaurantManagement";

function Connection(){
  mongoose.connect(MONGOURL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
  mongoose.connection.on("error", (err)=>{
    console.log("%s Unable to connect to MongoDB", chalk.red("✗"));
    process.exit();
  });
}

module.exports = {
  connect: Connection,
  mongoUrl: MONGOURL
}