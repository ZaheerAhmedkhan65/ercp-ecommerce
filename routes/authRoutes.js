const express = require('express');
const router = express();
const authController = require("../controllers/authCotroller");
let user = null;
router.get("/signin",(req,res)=>{
      res.render("auth/signin",{title:"sign in",user})
});

router.get("/signup",(req,res)=>{
    res.render("auth/signup",{title:"sign up",user})
});

router.post("/signup",authController.signup);
router.post("/signin",authController.signin);
router.get("/signout",authController.signout);

module.exports = router;