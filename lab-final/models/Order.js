const mongoose = require("mongoose");

let orderSchema = new mongoose.Schema({
    orderCode: { type: String, required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            name: String,
            quantity: Number,
            price: Number,
        },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending", enum: ["Pending", "Confirmed", "Cancelled"] },
    orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
