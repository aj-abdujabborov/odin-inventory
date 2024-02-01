const express = require("express");
const router = express.Router();

router.get("", (req, res) => {
  res.redirect("/category");
});

module.exports = router;
