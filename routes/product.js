const productController = require("../controllers/product");

const express = require("express");
const router = express.Router();

// Create
router.get("/create", productController.createGET);
router.post("/create", productController.createPOST);
// Update
router.get("/edit/:id", productController.updateGET);
router.post("/edit/:id", productController.updatePOST);
// Delete
router.get("/delete/:id", productController.deleteGET);
router.post("/delete/:id", productController.deletePOST);
// Read
router.get("/:id", productController.readGET);

module.exports = router;
