const express = require("express");

const router = express.Router();

const {
  signUp,
  signIn,
  signOut,
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/auth");

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/signout", signOut);

module.exports = router;
