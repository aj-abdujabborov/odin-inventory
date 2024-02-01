const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Product = require("../models/product");
const { body, validationResult, matchedData } = require("express-validator");
const mongoose = require("mongoose");

const formValidations = [
  body("name", "Name is required").trim().isLength({ min: 1 }).escape(),
];

exports.readAllGET = asyncHandler(async (req, res, next) => {
  const products = await Product.find({}, "name price volume").exec();

  res.render("categoryDetails", { products, title: "All products" });
});

exports.readGET = asyncHandler(async (req, res, next) => {
  const [category, products] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ categories: req.params.id }, "name price volume").exec(),
  ]);

  res.render("categoryDetails", { category, products });
});

exports.deleteGET = asyncHandler(async (req, res, next) => {
  const [category, products] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ categories: req.params.id }).exec(),
  ]);
  res.render("categoryDelete", { category, products });
});

exports.deletePOST = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [category, products] = await Promise.all([
      Category.findByIdAndDelete(req.params.id).exec(),
      Product.updateMany(
        { categories: req.params.id },
        { $pull: { categories: req.params.id } }
      ),
    ]);
    session.commitTransaction();
    res.redirect("/");
  } catch (err) {
    await session.abortTransaction();
    throw new Error("Deletion failed");
  } finally {
    session.endSession();
  }
});

exports.createGET = (req, res, next) => {
  res.render("categoryForm", {});
};

exports.createPOST = [
  ...formValidations,
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

exports.updateGET = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  if (!category) {
    throw new Error("Category doesn't exist");
  }
  res.render("categoryForm", category);
});

exports.updatePOST = [
  ...formValidations,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const data = matchedData(req);

    const categObj = { name: data.name };

    if (!errors.isEmpty()) {
      res.render("categoryForm", { ...categObj, errors: errors.array() });
      return;
    }

    const doc = await Category.findById(req.params.id).exec();
    doc.name = categObj.name;
    await doc.save();
    res.redirect(doc.url);
  }),
];
