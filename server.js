const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const slideRoutes = require('./routes/slideRoutes');


const { title } = require('process');
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/products", productRoutes);
app.use("/users", cartRoutes);
app.use("/categories", categoryRoutes);
app.use('/admin/slides', slideRoutes);

const Product = require("./models/Product");
const Category = require("./models/Category");
const Slide = require("./models/Slide"); // Add this at the top with other requires


app.get('/', async (req, res) => {
    try {
        const products = await Product.getAllProducts();
        const categories = await Category.getAllCategories();
        const featuredProducts = await Product.getFeaturedProducts();
        const featuredSlides = await Slide.getAllSlides();

        if (req.cookies.token) {
            const token = req.cookies.token;
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).redirect('/auth/signin');
                }
                let user = decoded;
                return res.render("pages/home", {
                    products,
                    featuredProducts,
                    featuredSlides,
                    categories,
                    title: "home",
                    user
                });
            });
        } else {
            return res.render("pages/home", {
                products,
                featuredProducts,
                featuredSlides,
                categories,
                title: "home",
                user: null
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


app.listen(PORT || 3000, () => {
    console.log(`Server running on port ${PORT}`);
});