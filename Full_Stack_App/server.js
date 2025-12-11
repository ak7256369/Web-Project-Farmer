
const express = require("express");
const mongoose = require("mongoose");
const app = express();
var expressLayouts = require("express-ejs-layouts");
var ProductModel = require("./models/product.model");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/electiveg3", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(cookieParser());
app.use(session({
  secret: "mysecretkey", // Change this in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Global Middleware to pass user info to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});
app.set('layout', 'layout'); // Default layout
// Global Middleware to pass user info and cart to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.cartCount = req.session.cart ? req.session.cart.length : 0;
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// --- Route Mounting ---
const productsRouter = require("./routes/products");
const adminRouter = require("./routes/admin");
const cartRouter = require("./routes/cart");

app.use("/", productsRouter);
app.use("/admin", adminRouter);
app.use("/cart", cartRouter);

// Seed Route (Temporary)
app.get("/seed-products", async (req, res) => {
  const ProductModel = require("./models/product.model");
  await ProductModel.deleteMany({});
  const sampleProducts = [
    { name: "Fresh Apple", price: 100, category: "Fruits", description: "Fresh red apples from the farm.", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb" },
    { name: "Organic Carrot", price: 50, category: "Vegetables", description: "Crunchy organic carrots.", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37" },
    { name: "Banana", price: 60, category: "Fruits", description: "Yellow sweet bananas.", image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224" },
    { name: "Broccoli", price: 120, category: "Vegetables", description: "Green healthy broccoli.", image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc" },
    { name: "Potatoes", price: 40, category: "Vegetables", description: "Farm fresh potatoes.", image: "https://images.unsplash.com/photo-1518977676601-b53f82a6b696" }
  ];
  await ProductModel.insertMany(sampleProducts);
  res.send("Database seeded!");
});

app.get("/contact-us", (req, res) => {
  res.render("contactus");
});

app.get("/", (req, res) => {
  //   res.send("Hello World!");
  res.render("homepage");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
