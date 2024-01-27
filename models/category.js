const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({ name: { type: String, minLength: 2 } });

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
