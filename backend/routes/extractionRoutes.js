const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const extractController = require("../controllers/extractController");

router.post("/extract", upload.single("file"), extractController.processExtraction);

module.exports = router;