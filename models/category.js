const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({ name: { type: String, minLength: 2 } });

CategorySchema.virtual("url").get(function () {
  return `/category/${this._id}`;
});

CategorySchema.virtual("deleteUrl").get(function () {
  return `/category/delete/${this._id}`;
});

CategorySchema.virtual("editUrl").get(function () {
  return `/category/edit/${this._id}`;
});

CategorySchema.statics.getCreateUrl = function () {
  return `/category/create`;
};

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
