const Category = require("../models/category");

exports.readGET = (req, res, next) => {
  res.send("You're viewing a category!");
};

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
