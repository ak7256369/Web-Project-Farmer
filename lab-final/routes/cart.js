const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const Order = require("../models/Order");
const { checkCartNotEmpty } = require("../middleware/auth");

// GET Cart
router.get("/", (req, res) => {
    const cart = req.session.cart || [];
    let total = 0;
    cart.forEach(item => total += item.price);
    res.render("cart", { cart, total });
});

// POST Add to Cart
router.post("/add/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            if (!req.session.cart) req.session.cart = [];

            // Check if product already exists
            const existingItem = req.session.cart.find(item => item._id === product.id);
            if (!existingItem) {
                req.session.cart.push(product);
            } else {
                // Optional: Increment quantity if we were tracking quantity in session, 
                // but current implementation pushes full product objects. 
                // Requirement says "Prevent duplicate products OR increment quantity".
                // Since session cart is array of products, preventing duplicate is safer/easier 
                // without refactoring cart structure to {id, qty}.
                // Let's just prevent duplicates for now as it's one of the options.
            }
        }
        res.redirect("/products?added=true");
    } catch (err) {
        res.redirect("/products");
    }
});

// GET Remove from Cart (Optional but good UX)
router.get("/remove/:index", (req, res) => {
    if (req.session.cart) {
        req.session.cart.splice(req.params.index, 1);
    }
    res.redirect("/cart");
});

// GET Checkout
router.get("/checkout", checkCartNotEmpty, (req, res) => {
    const cart = req.session.cart;
    let total = 0;
    cart.forEach(item => total += item.price);
    res.render("checkout", { cart, total });
});

// POST Checkout: Processes the order securely
// 1. Validates that the cart is not empty via middleware.
// 2. Recalculates total price from the database to prevent client-side manipulation.
// 3. Creates an Order document and saves it to MongoDB.
// 4. Clears the session cart upon success.
router.post("/checkout", checkCartNotEmpty, async (req, res) => {
    const { customerName, email } = req.body;
    const cart = req.session.cart; // Session cart contains products

    try {
        // Recalculate total from DB to ensure integrity
        let total = 0;
        const orderItems = [];

        for (const item of cart) {
            const product = await Product.findById(item._id);
            if (product) {
                total += product.price; // Assuming qty 1 per item in this simple array cart
                orderItems.push({
                    productId: product._id,
                    name: product.name,
                    quantity: 1,
                    price: product.price
                });
            }
        }

        const orderCode = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

        const newOrder = new Order({
            orderCode,
            customerName,
            email,
            items: orderItems,
            totalAmount: total,
        });

        await newOrder.save();
        req.session.cart = [];
        res.render("order-confirmation", { order: newOrder });
    } catch (err) {
        console.error(err);
        res.redirect("/cart/checkout");
    }
});

module.exports = router;
