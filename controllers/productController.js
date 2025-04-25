const Product = require('../models/Product');
const Category = require('../models/Category');

const getAllProducts = async (req, res) => {
    const products = await Product.getAllProducts();
    const categories = await Category.getAllCategories();
    res.render("pages/index", { products, title: "home",categories });
};


module.exports = { getAllProducts };