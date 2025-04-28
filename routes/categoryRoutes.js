const express = require('express');
const router = express();
const Product = require("../models/Product");
const Category = require('../models/Category');
const authAdmin = require("../middleware/authAdmin");
const authenticate = require("../middleware/authenticate");

router.get("/new",authenticate,authAdmin,async (req,res)=>{
    try{
        const categories = await Category.getAllCategories();
        res.render("admin/categories/new",{title:"New Category",user:req.user ,categories});
    } catch(err){
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});


router.get("/all",authenticate,authAdmin,async (req,res)=>{
    try{
        const categories = await Category.getAllCategories();
        res.json(categories);
    } catch(err){
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/create",authenticate,authAdmin, async(req,res)=>{
    try{
        const {name} = req.body;
        console.log("name",name);
        await Category.createCategory(name);
        res.redirect("/categories/new");
    } catch(err){
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;