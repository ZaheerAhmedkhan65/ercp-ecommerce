const express = require("express");
const router = express();
const authenticate = require("../middleware/authenticate")
const authAdmin = require("../middleware/authAdmin");
const Product = require("../models/Product");
const Category = require('../models/Category');
const adminController = require("../controllers/adminController");


router.get("/dashboard",authenticate,authAdmin,adminController.showDashboard);

router.get("/dashboard/products",authenticate,authAdmin,adminController.showProducts);

router.get("/orders",authenticate,authAdmin,adminController.showOrders)

module.exports = router;