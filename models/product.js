const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 1 },
  description: { type: String, minLength: 5 },
  ingredients: { type: [String] },
  price: { type: Number, required: true, min: 0.01 },
  volume: { type: String, minLength: 2 },
  amountInStock: { type: Number, required: true, min: 0 },
  categories: [{ type: mongoose.ObjectId, ref: "Category" }],
});

ProductSchema.virtual("url").get(function () {
  return `/product/${this._id}`;
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
