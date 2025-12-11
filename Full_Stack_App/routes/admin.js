const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

// Use Admin Layout
router.use((req, res, next) => {
    res.locals.layout = 'admin-layout';
    next();
});

// Middleware to Check Admin Rights
function checkAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/admin/login");
    }
}

// Login GET
router.get("/login", (req, res) => {
    res.render("admin/login", { error: null });
});

// Login POST
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.render("admin/login", { error: "Invalid Email or Password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.render("admin/login", { error: "Invalid Email or Password" });
    }
    req.session.user = user;
    res.redirect("/admin/dashboard");
});

// Register GET
router.get("/register", (req, res) => {
    res.render("admin/register");
});

// Register POST
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).send("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.redirect("/admin/login");
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/admin/login");
});

// Dashboard (Protected)
router.get("/dashboard", checkAuth, (req, res) => {
    res.render("admin/dashboard", { user: req.session.user });
});

// List Products (Protected)
router.get("/products", checkAuth, async (req, res) => {
    try {
        const products = await Product.find();
        res.render("admin/products", { products });
    } catch (err) {
        console.error(err);
        res.send("Error");
    }
});

// Add Product - Form (Protected)
router.get("/products/add", checkAuth, (req, res) => {
    res.render("admin/product-form", { product: {} });
});

// Add Product - Submit (Protected)
router.post("/products/add", checkAuth, async (req, res) => {
    try {
        let product = new Product(req.body);
        await product.save();
        res.redirect("/admin/products");
    } catch (err) {
        res.send("Error saving product");
    }
});

// Edit Product - Form (Protected)
router.get("/products/edit/:id", checkAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render("admin/product-form", { product });
    } catch (err) {
        res.send("Error");
    }
});

// Edit Product - Submit (Protected)
router.post("/products/edit/:id", checkAuth, async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/admin/products");
    } catch (err) {
        res.send("Error updating product");
    }
});

// Delete Product (Protected)
router.get("/products/delete/:id", checkAuth, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect("/admin/products");
    } catch (err) {
        res.send("Error deleting product");
    }
});

module.exports = router;
