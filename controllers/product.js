const asyncHandler = require("express-async-handler");
const {
  body,
  validationResult,
  matchedData,
  validationsArray,
} = require("./productValidator");
const Product = require("../models/product");
const Category = require("../models/category");

function getProductObjectFromData(data) {
  return {
    name: data.name,
    description: data.description,
    ingredients: data.ingredients,
    price: +data.price,
    volume: data.volume,
    amountInStock: +data.amountInStock,
    categories: data.category,
  };
}

function markAsChecked(set, selected) {
  return set.map((obj) => {
    if (selected.includes(obj._id)) obj.checked = true;
    return obj;
  });
}

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

exports.createGET = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().exec();

  res.render("productForm", { categories });
});

exports.createPOST = [
  ...validationsArray,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const data = matchedData(req);
    const categories = await Category.find().exec();

    const doc = new Product(getProductObjectFromData(data));
    const checkedCategories = markAsChecked(categories, doc.categories);

    if (!errors.isEmpty()) {
      res.render("productForm", {
        product: doc,
        categories: checkedCategories,
        errors: errors.array(),
      });
      return;
    }

    await doc.save();
    res.redirect(doc.url);
  }),
];

exports.updateGET = asyncHandler(async (req, res, next) => {
  const [product, categories] = await Promise.all([
    Product.findById(req.params.id),
    Category.find().exec(),
  ]);

  const checkedCategories = markAsChecked(categories, product.categories);

  res.render("productForm", { product, categories: checkedCategories });
});

exports.updatePOST = [
  ...validationsArray,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const data = matchedData(req);
    const [product, categories] = await Promise.all([
      Product.findById(req.params.id),
      Category.find().exec(),
    ]);

    const doc = Object.assign(product, getProductObjectFromData(data));
    const checkedCategories = markAsChecked(categories, doc.categories);

    if (!errors.isEmpty()) {
      res.render("productForm", {
        product: doc,
        categories: checkedCategories,
        errors: errors.array(),
      });
      return;
    }

    await doc.save();
    res.redirect(doc.url);
  }),
];

exports.deleteGET = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).exec();
  res.render("productDelete", { product });
});

exports.deletePOST = asyncHandler(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id).exec();
  res.redirect("/");
});
