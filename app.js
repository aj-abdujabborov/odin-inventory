// Modules
const path = require("node:path");
const express = require("express");
const httpCreateError = require("http-errors");
const morgan = require("morgan");
const mongoose = require("mongoose");
// Models
const categoryModel = require("./models/category");
const productModel = require("./models/product");
// Routers
const indexRouter = require("./routes");
const productRouter = require("./routes/product");
const categoryRouter = require("./routes/category");

// Connect to MongoDB
async function mongoConnect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.error(err);
  }
}
mongoConnect();

// App
const app = express();

// Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Development logger
app.use(morgan("dev"));

// Retrieve objects made with POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Supply static files
app.use(express.static("./public"));

// Pass data to layout
const cachedCategories = (function cachedCategories() {
  let categories;
  let firstCallMade = false;

  async function downloadCategories() {
    categories = await categoryModel.find().sort({ name: 1 }).exec();
  }

  async function getCategories() {
    if (!firstCallMade) {
      await downloadCategories();
      setInterval(downloadCategories, 10000);
      firstCallMade = true;
    }
    return categories;
  }

  return getCategories;
})();

app.use(async (req, res, next) => {
  app.locals.loCategories = await cachedCategories();
  app.locals.loProductCreateUrl = productModel.getCreateUrl();
  app.locals.loCategoryCreateUrl = categoryModel.getCreateUrl();
  next();
});

// Routes
app.use("/", indexRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);

// Error-handling
app.use(function (req, res, next) {
  next(httpCreateError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // how does locals get used?

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Export
module.exports = app;
