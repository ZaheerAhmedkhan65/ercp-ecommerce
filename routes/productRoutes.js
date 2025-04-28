const express = require('express');
const router = express();
const Product = require("../models/Product");
const Category = require('../models/Category');
const ProductImage = require("../models/ProductImage");
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

// productRoutes.js
router.get('/filter', async (req, res) => {
    try {
        const { category, price, sort } = req.query;
        console.log('Filter params:', { category, price, sort });
        
        const products = await Product.getFilteredProducts(category, price, sort);
        
        if (!products || products.length === 0) {
            return res.status(404).json({ 
                error: 'No products found', 
                message: 'No products match your filters' 
            });
        }
        
        res.json(products);
    } catch (err) {
        console.error('Filter error:', err);
        res.status(500).json({ 
            error: 'Server Error',
            message: 'Failed to process your request' 
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.render("pages/viewProduct",{ product, title: product.name, user: req.user });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});


router.get("/:id/edit",authenticate,authAdmin, async (req, res) => {
    try {
        const product = await Product.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        const categories = await Category.getAllCategories();
        res.render("admin/products/edit",{ product, title: product.name, user: req.user, categories });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/:id/update", upload.single('image'), authenticate, authAdmin, async (req, res) => {
    try {
        const { name, description, price, category_id } = req.body;
        const id = req.params.id;
        let imagePath = null;

        if (req.file) {
            imagePath = '/uploads/' + req.file.filename;
        } else {
            // If no new image uploaded, get the old image path from the database
            const product = await Product.getProductById(id);
            imagePath = product.image;
        }

        await Product.updateProduct(id, name, description, price, category_id, imagePath);

        res.redirect("/admin/dashboard/products"); // or wherever your products list is
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating product");
    }
});


router.delete("/:id/delete", authenticate, authAdmin, async (req, res) => {
    try {
        const { id } = req.body;

        await Product.deleteProduct(id);

        res.json({ status: "success", message: "Product is deleted." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting product" });
    }
});


router.post("/create", upload.single('image'), authenticate, authAdmin, async (req, res) => {
    try {
        const {name, description, price, category_id} = req.body;
        await Product.createProduct(name, description, price, category_id, '/uploads/'+req.file.filename);

        res.redirect("/admin/dashboard/products");
    } catch(err) {
        console.log(err);
        res.status(500).send("Error creating product");
    }
});

router.post("/:id/add-to-slides", authenticate, authAdmin, async (req, res) => {
    try {
        const { title, description, link, display_order } = req.body;
        await Product.addToSlides(
            req.params.id, 
            title, 
            description, 
            link, 
            display_order
        );
        res.redirect("/admin/dashboard/products?success=Product added to slides");
    } catch(err) {
        console.log(err);
        res.redirect("/admin/dashboard/products?error=Error adding to slides");
    }
});

// Remove from slides
router.post("/:id/remove-from-slides", authenticate, authAdmin, async (req, res) => {
    try {
        await db.query(`
            DELETE FROM slides 
            WHERE image = (SELECT image FROM products WHERE id = ?)
        `, [req.params.id]);
        res.redirect("/admin/dashboard/products?success=Product removed from slides");
    } catch(err) {
        console.log(err);
        res.redirect("/admin/dashboard/products?error=Error removing from slides");
    }
});
module.exports = router;