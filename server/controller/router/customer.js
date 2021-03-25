const router = require('express').Router(),
      customerRegister = require('../customer/register'),
      customerLogin = require("../customer/login");   

router.post("/register",customerRegister.customerRegister);
router.post("/login",customerLogin.customerLogin);

module.exports = router;