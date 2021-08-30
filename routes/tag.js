const express = require("express");
const { createTag, list, read, remove } = require("../controllers/tag");

const router = express.Router();

router.post("/tag", createTag);
router.get("/tag", list);
router.get("/tag/:slug", read);
router.delete("/tag/:slug", remove);

module.exports = router;
