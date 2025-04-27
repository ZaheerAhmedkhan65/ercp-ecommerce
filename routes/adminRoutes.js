const express = require("express");
const router = express();
const authenticate = require("../middleware/authenticate")
const authAdmin = require("../middleware/authAdmin");
const Product = require("../models/Product");
const Category = require('../models/Category');


router.get("/dashboard",authenticate,authAdmin,(req,res)=>{
    res.render("admin/index",{title:"dashboard",user:req.user});
});

router.get("/dashboard/products",authenticate,authAdmin, async (req,res)=>{
    try{
        const products = await Product.getAllProducts();
        res.render("admin/products/index",{title:"Products",user:req.user,products});
    } catch(err){
        console.log(err);
    }
});



router.get("/orders",authenticate,authAdmin,(req,res)=>{
    res.json({title:"Orders",user:req.user});
});

module.exports = router;