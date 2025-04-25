const express = require('express');
const router = express();
const Product = require("../models/Product");
const authAdmin = require("../middleware/authAdmin");
const authenticate = require("../middleware/authenticate");


router.get("/:id",async (req,res)=>{
    try{
        const product = await Product.getProductById(req.params.id);
        res.render("pages/view_product",{product,title:product.name,user:req.user});
    } catch(err){
        console.log(err);
    }
}

);
module.exports = router;