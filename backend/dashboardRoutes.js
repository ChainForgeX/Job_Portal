const express = require("express");
const router = express.Router();
const protect = require("./protect");
const {getEmployerDashboard, getCandidateDashboard} = require("./dashboardController");

router.get("/employer", protect, getEmployerDashboard);
router.get("/candidate", protect, getCandidateDashboard);

module.exports = router;