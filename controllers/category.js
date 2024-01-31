const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Product = require("../models/product");
const { body, validationResult, matchedData } = require("express-validator");

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

exports.createGET = asyncHandler((req, res, next) => {
  res.render("categoryForm", {});
});

exports.createPOST = [
  body("name", "Name is required").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const data = matchedData(req);

    const categObj = { name: data.name };

    if (!errors.isEmpty()) {
      res.render("categoryForm", { ...categObj, errors: errors.array() });
      return;
    }

    const doc = new Category(categObj);
    await doc.save();
    res.redirect(doc.url);
  }),
];

exports.updateGET = (req, res, next) => {
  res.send("This is the update page!");
};

exports.updatePOST = (req, res, next) => {
  res.send("This is the update post!");
};
