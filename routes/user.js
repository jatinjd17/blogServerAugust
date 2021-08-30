const express = require("express");
const {
  read,
  publicProfile,
  update,
  photo,
  userDetails,
} = require("../controllers/user");
const {
  authMiddleware,
  requireSignin,
  adminMiddleware,
} = require("../middlewares/auth");

const router = express.Router();

router.get("/user/profile", requireSignin, authMiddleware, read);
router.get("/user/:username", publicProfile);
router.put("/user/update", update);
router.get("/user/photo/:username", photo);
// router.get("/user/details/:username", userDetails);

module.exports = router;
