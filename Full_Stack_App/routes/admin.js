const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");

// Use Admin Layout
router.use((req, res, next) => {
    res.locals.layout = 'admin-layout';
    next();
});

// Dashboard
router.get("/dashboard", (req, res) => {
    res.render("admin/dashboard");
});

// List Products
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.render("admin/products", { products });
    } catch (err) {
        console.error(err);
        res.send("Error");
    }
});

// Add Product - Form
router.get("/products/add", (req, res) => {
    res.render("admin/product-form", { product: {} });
});

// Add Product - Submit
router.post("/products/add", async (req, res) => {
    try {
        let product = new Product(req.body);
        await product.save();
        res.redirect("/admin/products");
    } catch (err) {
        res.send("Error saving product");
    }
});

// Edit Product - Form
router.get("/products/edit/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render("admin/product-form", { product });
    } catch (err) {
        res.send("Error");
    }
});

// Edit Product - Submit
router.post("/products/edit/:id", async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/admin/products");
    } catch (err) {
        res.send("Error updating product");
    }
});

// Delete Product
router.get("/products/delete/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect("/admin/products");
    } catch (err) {
        res.send("Error deleting product");
    }
});

module.exports = router;
