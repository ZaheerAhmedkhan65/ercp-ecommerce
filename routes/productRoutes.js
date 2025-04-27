const express = require('express');
const router = express();
const Product = require("../models/Product");
const Category = require('../models/Category');
const authAdmin = require("../middleware/authAdmin");
const authenticate = require("../middleware/authenticate");
const upload = require('../middleware/upload');


router.get("/new",authenticate,authAdmin,async (req,res)=>{
    try{
        const categories = await Category.getAllCategories();
        res.render("admin/products/new",{title:"New Product",user:req.user, categories});
    } catch(err){
        console.log(err);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ product, title: product.name, user: req.user });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/create",upload.single('image'),authenticate,authAdmin, async (req,res)=>{
    try{
        const {name,description,price,category_id} = req.body;

        const imagePath = req.file ? '/uploads/' + req.file.filename : null;

        console.log('Storing image path:', imagePath); // Add this

        Product.createProduct(name,description,price,category_id,imagePath);
        res.redirect("/admin/dashboard/products");
    }catch(err){
        console.log(err);
    }
});

router.post("/category/create",authenticate,authAdmin,(req,res)=>{
    const {name} = req.body;
    Category.createCategory(name);
    res.redirect("/admin/products");
});

module.exports = router;