const express = require("express");

const router = express.Router();
const {
  createblog,
  list,
  read,
  photo,
  delete1,
} = require("../controllers/blogs.js");
const { requireSignin, authMiddleware } = require("../middlewares/auth.js");

router.post("/blog", requireSignin, authMiddleware, createblog);
router.get("/blogs", list);
router.get("/blog/:slug", read);
router.get("/blog/photo/:slug", photo);
router.delete("/blog/edit/:slug", requireSignin, authMiddleware, delete1);

module.exports = router;
