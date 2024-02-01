const categoryController = require("../controllers/category");

const express = require("express");
const router = express.Router();

// Create
router.get("/create", categoryController.createGET);
router.post("/create", categoryController.createPOST);
// Update
router.get("/edit/:id", categoryController.updateGET);
router.post("/edit/:id", categoryController.updatePOST);
// Delete
router.get("/delete/:id", categoryController.deleteGET);
router.post("/delete/:id", categoryController.deletePOST);
// Read
router.get("/:id", categoryController.readGET);
router.get("/", categoryController.readAllGET);

module.exports = router;
