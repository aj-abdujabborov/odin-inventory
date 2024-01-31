#! /usr/bin/env node

const mongoose = require("mongoose");
const Category = require("./models/category");
const Product = require("./models/product");

// Func: save provided document and resolve
async function saveDoc(document, saveLocally) {
  await document.save();
  saveLocally(document);
  return;
}

// Add categories to database
const categories = new Map();
["Fruits", "Dessert", "Drinks", "Sauces", "Sweet", "Savory"].forEach((val) => {
  categories.set(val, { name: val });
});

async function saveCategories() {
  const categoriesPromises = [];

  categories.forEach((val, key, map) => {
    const doc = new Category(val);
    categoriesPromises.push(saveDoc(doc, (docum) => map.set(key, docum)));
  });
  await Promise.all(categoriesPromises);
}

// Add products to database
const productFieldNames = [
  "name",
  "description",
  "ingredients",
  "price",
  "volume",
  "amountInStock",
  "categories",
];
const products = [
  [
    "Blueberries",
    "Yummy blueberries from South Africa",
    null,
    4.99,
    null,
    7,
    ["Fruits", "Sweet"],
  ],
  [
    "Apple",
    "Crisp and juicy apple",
    null,
    1.99,
    "500g",
    10,
    ["Fruits", "Sweet"],
  ],
  [
    "Banana",
    "Ripe and potassium-rich banana",
    null,
    0.79,
    "per piece",
    20,
    ["Fruits", "Sweet"],
  ],
  [
    "Grapes",
    "Sweet and seedless grapes",
    null,
    3.49,
    "1lb",
    15,
    ["Fruits", "Sweet"],
  ],
  [
    "Strawberries",
    "Fresh and succulent strawberries",
    null,
    4.99,
    "250g",
    8,
    ["Fruits", "Sweet"],
  ],
  [
    "Mango",
    "Tropical and juicy mango",
    null,
    2.99,
    "each",
    12,
    ["Fruits", "Sweet"],
  ],
  [
    "Pineapple",
    "Sweet and tangy pineapple",
    null,
    3.99,
    "whole",
    10,
    ["Fruits", "Sweet"],
  ],
  [
    "Chocolate Cake",
    "Rich and indulgent chocolate cake",
    ["Chocolate", "Flour", "Sugar", "Eggs"],
    12.99,
    "1kg",
    5,
    ["Dessert", "Sweet"],
  ],
  [
    "Vanilla Ice Cream",
    "Creamy vanilla-flavored ice cream",
    ["Milk", "Cream", "Sugar", "Vanilla"],
    5.49,
    "500ml",
    8,
    ["Dessert", "Sweet"],
  ],
  [
    "Cheesecake",
    "Classic creamy cheesecake",
    ["Cream Cheese", "Graham Cracker Crust"],
    18.99,
    "800g",
    6,
    ["Dessert", "Sweet"],
  ],
  [
    "Fruit Tart",
    "Colorful and fruity tart",
    ["Pastry", "Custard", "Mixed Fruits"],
    8.49,
    "300g",
    10,
    ["Dessert", "Sweet"],
  ],
  [
    "Orange Juice",
    "Freshly squeezed orange juice",
    ["Oranges"],
    2.99,
    "1L",
    12,
    ["Drinks", "Sweet"],
  ],
  [
    "Green Tea",
    "Refreshing green tea",
    ["Green Tea Leaves"],
    4.49,
    "200g",
    15,
    ["Drinks"],
  ],
  [
    "Iced Coffee",
    "Chilled and smooth iced coffee",
    ["Coffee", "Milk", "Sugar"],
    3.99,
    "500ml",
    10,
    ["Drinks"],
  ],
  [
    "Tomato Sauce",
    "Classic tomato sauce",
    ["Tomatoes", "Garlic", "Onion"],
    1.79,
    "500g",
    18,
    ["Sauces"],
  ],
  [
    "BBQ Sauce",
    "Smoky and tangy BBQ sauce",
    ["Tomato", "Molasses", "Vinegar"],
    3.29,
    "250ml",
    10,
    ["Sauces", "Savory"],
  ],
  [
    "Pesto Sauce",
    "Basil and pine nut pesto sauce",
    ["Basil", "Pine Nuts", "Parmesan"],
    5.99,
    "200g",
    12,
    ["Sauces", "Savory"],
  ],
  [
    "Chocolate Chip Cookies",
    "Homemade chocolate chip cookies",
    ["Flour", "Chocolate Chips", "Butter"],
    4.99,
    "300g",
    15,
    ["Sweet"],
  ],
  [
    "Cheese Crackers",
    "Crunchy and cheesy crackers",
    ["Flour", "Cheese", "Butter"],
    2.49,
    "150g",
    18,
    ["Savory"],
  ],
  [
    "Mixed Nuts",
    "Roasted and salted mixed nuts",
    ["Almonds", "Cashews", "Peanuts"],
    6.99,
    "300g",
    10,
    ["Savory"],
  ],
  [
    "Chips",
    "Crispy potato chips",
    ["Potatoes", "Salt", "Vegetable Oil"],
    1.49,
    "200g",
    25,
    ["Savory"],
  ],
].map((prod) => {
  const obj = {};
  productFieldNames.forEach((field, ind) => {
    if (prod[ind]) obj[field] = prod[ind];
  });
  return obj;
});

async function saveProducts() {
  const productPromises = products.map((prod, ind) => {
    prod.categories = prod.categories.map((cat) => categories.get(cat));
    const doc = new Product(prod);
    return saveDoc(doc, (docum) => (products[ind] = docum));
  });

  await Promise.all(productPromises);
}

// Launch
const userArgs = process.argv.slice(2); // get arguments passed on command line
const mongoDB = userArgs[0];
mongoose.set("strictQuery", false);

async function main() {
  try {
    await mongoose.connect(mongoDB);
    await saveCategories();
    await saveProducts();
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    await mongoose.connection.close();
  }
}
main();
