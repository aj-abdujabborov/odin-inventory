const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 1 },
  description: { type: String, minLength: 5 },
  ingredients: { type: [String] },
  price: { type: Number, required: true, min: 0.01 },
  mass: { type: Number, min: 0.01 },
  amountInStock: { type: Number, required: true, min: 0 },
  categories: { type: [mongoose.ObjectId], ref: "Categories" },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
