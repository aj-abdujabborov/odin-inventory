const { ExpressValidator } = require("express-validator");

const { body, validationResult, matchedData } = new ExpressValidator({
  forceIntoArray: (value) => {
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
  },
});

const validationsArray = [
  body("name", "Name is required").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must be longer than 3 characters")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("ingredients")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .customSanitizer((value) => {
      if (!value.length) return [];
      const ingredients = value.split(",");
      return ingredients.map((ingr) => ingr.trim());
    }),
  body("price", "Price is required").trim().isFloat({ min: 0.001 }).escape(),
  body("volume")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("amountInStock", "Quantity-in-stock is a required field").isInt({
    min: 0,
  }),
  body("category").forceIntoArray(),
  body("category.*").escape(),
  body("password", "Password is incorrect")
    .equals(process.env.ADMIN_PASSWORD)
    .escape(),
];

module.exports = { body, validationResult, matchedData, validationsArray };
