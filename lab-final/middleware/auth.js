// Middleware to ensure cart is not empty before checkout
module.exports.checkCartNotEmpty = (req, res, next) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.redirect("/products");
    }
    next();
};

// Middleware to restrict access to Admin Dashboard (admin@shop.com only)
module.exports.adminOnly = (req, res, next) => {
    if (req.session.user && req.session.user.email === "admin@shop.com") {
        next();
    } else {
        // If logged in but not admin, maybe 403 or redirect to login? 
        // Existing checkAuth redirected to login.
        // Requirement: "Allow access only if email equals admin@shop.com"
        if (!req.session.user) {
            res.redirect("/admin/login");
        } else {
            res.status(403).send("Access Denied: Admins Only");
        }
    }
};
