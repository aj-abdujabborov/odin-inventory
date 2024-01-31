const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({ name: { type: String, minLength: 2 } });

CategorySchema.virtual("url").get(function () {
  return `/category/${this._id}`;
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
