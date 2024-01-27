// Modules
const path = require("node:path");
const express = require("express");
const httpCreateError = require("http-errors");
const morgan = require("morgan");
const mongoose = require("mongoose");
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
