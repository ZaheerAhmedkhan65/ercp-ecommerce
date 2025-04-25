const express = require('express');
const router = express();
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const authenticate = require("../middleware/authenticate");

router.get("/:user_id/carts", authenticate, async (req, res) => {
    try {
        const { user_id } = req.params;
        
        // Get the cart
        const carts = await Cart.getCartByUserId(user_id);
        if (!carts) return res.status(404).json({ message: "Cart not found" });
         console.log("carts: ",carts)
        res.status(200).render("pages/user_carts", { carts, title: "Cart", user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});


router.get("/:user_id/cart/:cart_id", authenticate, async (req, res) => {
    try {
        const { user_id, cart_id } = req.params;

        // Get the cart
        const cart = await Cart.getCartByUserId(user_id);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        console.log("cart id in items:", cart_id);
        console.log("user id in items:", user_id);

        // Get all cart items
        const cartItems = await CartItem.getCartItemsByCartId(cart_id);

        // Fetch product details including images
        const products = await Promise.all(
            cartItems.map(async (cartItem) => {
                const product = await Product.getProductById(cartItem.product_id);
                return { 
                    ...cartItem,  // Keep existing cartItem properties
                    product_name: product.name,
                    product_image: product.image, // Assuming 'image' field exists in Product model
                    total_price: (cartItem.quantity * product.price).toFixed(2)
                };
            })
        );

        let total = 0;
        for (const product of products) {
            total += (product.total_price.trim() * 1)
        }

        console.log("total:", total);

        console.log("cartItems with products:", products);

        res.status(200).render("pages/cart", { 
            cart, 
            title: "Cart", 
            user: req.user, 
            cartItems: products, // Now cartItems include product details
            total : total.toFixed(2) 
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});



router.post("/:user_id/cart/add", authenticate, async (req, res) => {
    try {
        const { user_id } = req.params;
        const { product_id, quantity } = req.body;

        // Get product details
        const product = await Product.getProductById(product_id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // ✅ Fetch the latest existing cart for the user
        let cart = await Cart.getLatestCartByUserId(user_id);
        
        if (!cart) {
            // ✅ If no cart exists, create a new one
            cart = await Cart.createCart(user_id);
        }

        console.log("Using cart: ", cart);

        // Check if product already exists in cart_items
        let cartItem = await CartItem.getByCartIdAndProductId(cart.id, product_id);
        if (cartItem) {
            // Update quantity
            cartItem.quantity += 1;
            cartItem.price = product.price * cartItem.quantity;
            await CartItem.updateQuantityByCartIdAndProductId(cart.id, product_id, cartItem.quantity);
        } else {
            await CartItem.createCartItem(cart.id, product_id, quantity, product.price * quantity);
        }

        // Update cart total
        const total = await CartItem.getTotalAmount(cart.id);
        await Cart.updateTotalAmount(cart.id, total);

        res.status(200).redirect(`/users/${user_id}/cart/${cart.id}`);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});





router.post("/:user_id/cart/create",async (req,res)=>{
    try{
        const {user_id} = req.params;
        const cart = await Cart.createCart(user_id);
        res.status(201).json(cart);
    } catch(err){
        console.log(err);
    }
});



module.exports = router;