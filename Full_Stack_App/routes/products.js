const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");

// GET /products - List products with pagination and filtering
router.get("/products", async (req, res) => {
    try {
        let { page, limit, category, minPrice, maxPrice } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        let query = {};
        if (category) query.category = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const totalProducts = await Product.countDocuments(query);
        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPages = Math.ceil(totalProducts / limit);

        // Get unique categories for filter
        const categories = await Product.distinct("category");

        res.render("shop", {
            products,
            categories,
            currentPage: page,
            totalPages,
            query: req.query
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// GET /products/:id - Single product details
router.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send("Product not found");
        // Reuse shop layout or create a detail view? For now let's reuse/simple render
        // Or maybe just send it? The requirement didn't explicitly ask for a detail view page but "routes for all pages".
        // Let's assume shop view handles the listing.
        res.send(product); // Or render a detail view
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;
