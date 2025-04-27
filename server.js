const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const { title } = require('process');
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/products", productRoutes);
app.use("/users", cartRoutes);
app.use("/categories", categoryRoutes);

const Product = require("./models/Product");
let user = null;
app.get('/', async (req, res) => {
    try {
        const products = await Product.getAllProducts();
        
        if (req.cookies.token) {
            const token = req.cookies.token;
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).redirect('/auth/signin');
                }
                user = decoded;
                return res.render("pages/home", { products, title: "home", user });
            });
        } else {
            // No token case
            return res.render("pages/home", { products, title: "home", user: null });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


app.listen(PORT||3000, () => {
    console.log(`Server running on port ${PORT}`);
});