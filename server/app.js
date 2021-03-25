const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require('cors'),
      path = require("path"),
      mongoDbConfig = require("./config/mongoDbConfig")

global.__root = __dirname + '/';
let app = express();

require('dotenv').config({path: global.__root + '/.env'})

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy({ setTo:"PHP 4.2.2" }));
try{
    mongoDbConfig.connect()
}catch(error){
    console.log("error occured")
}

app.use(express.static(path.join(global.__root, "./public/")))

require("./helpers/passport")

var customerController = require(__root + "controller/router/customer");
app.use('/api/auth/customer', customerController);

var adminController = require(__root + "controller/router/admin");
app.use('/api/auth/admin', adminController);

var logoutController = require(__root + "controller/router/logout");
app.use('/api/auth/logout', logoutController);

var mealController = require(__root + "controller/router/meals");
app.use('/api/meals', mealController);

app.use(function(err, req, res, next) {
    return res.status(500).send({ error: err });
});

app.use("*", (req,res)=> {
    res.status(404).json("The route you requested has not been found");
});

module.exports = app;