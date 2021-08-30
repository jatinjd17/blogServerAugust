const express = require("express");
const {
  createCategory,
  list,
  remove,
  read,
} = require("../controllers/category");
const router = express.Router();

router.post("/category", createCategory);
router.get("/category", list);
router.get("/category/:slug", read);
router.delete("/category/:slug", remove);

module.exports = router;
