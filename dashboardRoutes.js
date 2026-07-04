const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const {getEmployerDashboard, getCandidateDashboard} = require("../controllers/dashboardController");

router.get("/employer", protect, getEmployerDashboard);
router.get("/candidate", protect, getCandidateDashboard);

module.exports = router;