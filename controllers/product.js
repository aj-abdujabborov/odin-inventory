const asyncHandler = require("express-async-handler");
const {
  body,
  validationResult,
  matchedData,
  validationsArray,
} = require("./productValidator");
const Product = require("../models/product");
const Category = require("../models/category");

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

    const doc = new Product({
      name: data.name,
      description: data.description,
      ingredients: data.ingredients,
      price: +data.price,
      volume: data.volume,
      amountInStock: +data.amountInStock,
      categories: data.category,
    });

    categories.forEach((cat) => {
      if (doc.categories.includes(cat._id)) cat.checked = true;
    });

    if (!errors.isEmpty()) {
      res.render("productForm", {
        product: doc,
        categories,
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

  categories.forEach((cat) => {
    if (product.categories.includes(cat._id)) cat.checked = true;
  });

  res.render("productForm", { product, categories });
});

exports.updatePOST = (req, res, next) => {
  res.send("This is the update post!");
};

exports.deleteGET = (req, res, next) => {
  res.send("This is the delete page!");
};

exports.deletePOST = (req, res, next) => {
  res.send("This is the delete post!");
};
