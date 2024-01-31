const asyncHandler = require("express-async-handler");
const Product = require("../models/product");

exports.readGET = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("categories")
    .exec();
  // TODO: handle error being thrown when req.params.id is not a valid ID

  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  res.render("productDetails", product);
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
