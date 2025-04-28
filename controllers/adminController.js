const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require("../models/Order");
const db = require("../config/db")

const getAllProducts = async (req, res) => {
    const products = await Product.getAllProducts();
    const categories = await Category.getAllCategories();
    res.render("pages/index", { products, title: "home",categories });
};

const showDashboard = async (req, res) =>{
    try{
        const products = await Product.getAllProducts();
        res.render("admin/index",{title:"dashboard",user:req.user, products});
    } catch(err){
        console.log(err);
    }
}

const showProducts = async (req, res) =>{
    try{
        const products = await Product.getAllProducts();
        
        // Check which products are in slides
        const [slides] = await db.query('SELECT image FROM slides');
        const slideImages = slides.map(slide => slide.image);
        
        const productsWithSlideStatus = products.map(product => ({
            ...product,
            is_in_slides: slideImages.includes(product.image)
        }));
        res.render("admin/products/index",{
            title:"Products",
            products: productsWithSlideStatus,
            user: req.user,
            success: req.query.success,
            error: req.query.error
        });
    } catch(err){
        console.log(err);
    }
}

const showOrders = async (req, res) =>{
    try{
        const orders = await Order.getAllOrders();
        res.render("admin/products/index",{title:"Products",user:req.user,orders});
    } catch(err){
        console.log(err);
    }
}



module.exports = { showDashboard, showProducts, showOrders };