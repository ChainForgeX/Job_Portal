const express = require("express");
const router = express.Router();
const {applyJob, getMyApplications, getApplicationsForEmployer, updateApplicationStatus, withdrawApplication} = require("./applicationController");
const protect = require("./protect");
const createUpload = require("./uploadFactory");
const resumeUpload = createUpload(
    "job-portal/resumes",
    ["pdf", "doc", "docx"],
    "raw"
);

router.post("/apply/:jobId", protect, resumeUpload.single("resume"), applyJob);
router.get("/my-applications", protect, getMyApplications);
router.delete("/:id", protect, withdrawApplication);
router.get("/employer", protect, getApplicationsForEmployer);
router.put("/:id", protect, updateApplicationStatus);

module.exports = router;