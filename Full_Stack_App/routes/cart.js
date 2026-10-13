const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");

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
            req.session.cart.push(product);
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
router.get("/checkout", (req, res) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.redirect("/products");
    }
    res.render("checkout");
});

// POST Checkout (Success)
router.post("/checkout", (req, res) => {
    req.session.cart = []; // Clear cart
    res.render("order-success");
});

module.exports = router;
