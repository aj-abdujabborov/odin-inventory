const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Product = require("../models/product");

exports.readGET = asyncHandler(async (req, res, next) => {
  const [category, products] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ categories: req.params.id }, "name price volume").exec(),
  ]);

  res.render("categoryDetails", { category, products });
});

exports.deleteGET = (req, res, next) => {
  res.send("This is the delete page!");
};

exports.deletePOST = (req, res, next) => {
  res.send("This is the delete post!");
};

exports.createGET = (req, res, next) => {
  res.send("This is the create page!");
};

exports.createPOST = (req, res, next) => {
  res.send("This is the create post!");
};

exports.updateGET = (req, res, next) => {
  res.send("This is the update page!");
};

exports.updatePOST = (req, res, next) => {
  res.send("This is the update post!");
};
