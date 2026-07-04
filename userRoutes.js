const express = require("express");
const router = express.Router();
const {getProfile, updateProfile, updateProfilePicture, forgotPassword, resetPassword} = require("../controllers/userController");
const protect = require("../middleware/protect");
const createUpload = require("../middleware/uploadFactory");
const profileUpload = createUpload(
    "job-portal/profile-pictures",
    ["jpg", "jpeg", "png", "webp"],
    "image"
);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/profile-picture", protect, profileUpload.single("profilePicture"), updateProfilePicture);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;