const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const extractController = require("../controllers/extractController");
const historyController = require("../controllers/historyController");

router.post("/extract", upload.single("file"), extractController.processExtraction);
router.get("/history/:id", historyController.getHistory);

module.exports = router;