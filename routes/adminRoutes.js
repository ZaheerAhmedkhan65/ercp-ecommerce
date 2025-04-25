const express = require("express");
const router = express();
const authenticate = require("../middleware/authenticate")
const authAdmin = require("../middleware/authAdmin");
const Product = require("../models/Product");
const Category = require('../models/Category');
const upload = require('../middleware/upload');


router.get("/dashboard",authenticate,authAdmin,(req,res)=>{
    res.render("admin/index",{title:"dashboard",user:req.user});
});

router.get("/products",authenticate,authAdmin, async (req,res)=>{
    try{
        const categories = await Category.getAllCategories();
        console.log(categories);
        res.render("admin/products",{title:"Products",user:req.user,categories});
    } catch(err){
        console.log(err);
    }
});

router.get("/orders",authenticate,authAdmin,(req,res)=>{
    res.render("admin/orders",{title:"Orders",user:req.user});
});

router.post("/products/create",upload.single('image'),authenticate,authAdmin, async (req,res)=>{
    try{
        const {name,description,price,category_id} = req.body;

        const imagePath = req.file ? '/uploads/' + req.file.filename : null;

        console.log('Storing image path:', imagePath); // Add this

        Product.createProduct(name,description,price,category_id,imagePath);
        res.redirect("/admin/products");
    }catch(err){
        console.log(err);
    }
});

router.post("/products/category/create",authenticate,authAdmin,(req,res)=>{
    const {name} = req.body;
    Category.createCategory(name);
    res.redirect("/admin/products");
});

module.exports = router;