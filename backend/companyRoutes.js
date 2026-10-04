const express = require("express");
const router = express.Router();
const {createCompany, getMyCompanies, updateCompany, deleteCompany} = require("./companyController");
const protect = require("./protect");
const createUpload = require("./uploadFactory");
const logoUpload = createUpload(
    "job-portal/logos",
    ["jpg", "jpeg", "png", "webp"],
    "image"
);

router.post("/", protect, createCompany);
router.get("/", protect, getMyCompanies);
router.put("/:id", protect, logoUpload.single("logo"), updateCompany);
router.delete("/:id", protect, deleteCompany);

module.exports = router;