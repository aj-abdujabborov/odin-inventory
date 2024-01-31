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

ProductSchema.virtual("deleteUrl").get(function () {
  return `/product/delete/${this._id}`;
});

ProductSchema.virtual("editUrl").get(function () {
  return `/product/edit/${this._id}`;
});

ProductSchema.statics.getCreateUrl = function () {
  return `/product/create`;
};

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
