const express = require("express");
const router = express.Router();

router.get("", (req, res) => {
  res.render("layout", { text: "This is some random text" });
});

module.exports = router;
