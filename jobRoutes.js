const express = require("express");
const router = express.Router();
const {createJob, getAllJobs, getMyJobs, updateJob, closeJob, deleteJob} = require("../controllers/jobController");
const protect = require("../middleware/protect");

router.post("/", protect, createJob);
router.get("/", getAllJobs);
router.get("/my-jobs", protect, getMyJobs);
router.put("/:id", protect, updateJob);
router.put("/close/:id", protect, closeJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;