const User = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const getProfile = async(req, res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({
                message : "User Not Found"
            });
        }
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const updateProfile = async(req, res)=>{
    try{
        const {name, skills, experience}  = req.body;
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({
                message : "User Not Found"
            });
        }
        user.name = name || user.name;
        user.skills = skills || user.skills;
        user.experience = experience || user.experience;
        await user.save();
        res.status(200).json({
            message : "Profile Updated Successfully",
            user
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const updateProfilePicture = async(req, res)=>{
    try{
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({
                message : "User Not Found"
            });
        }
        if(!req.file){
            return res.status(400).json({
                message : "Profile Picture is required"
            });
        }
        if(user.profilePicturePublicId){
            await cloudinary.uploader.destroy(user.profilePicturePublicId);
        }
        user.profilePicture = req.file.path;
        user.profilePicturePublicId = req.file.filename;
        await user.save();
        res.status(200).json({
            message : "Profile Picture Updated Successfully",
            user
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const forgotPassword = async(req, res)=>{
    try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message : "User Not Found"
            });
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save();
        res.status(200).json({
            message : "Reset Token Generated",
            resetToken
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const resetPassword = async(req, res)=>{
    try{
        const {token, password} = req.body;
        const user = await User.findOne({
            resetPasswordToken : token,
            resetPasswordExpire : {
                $gt : Date.now()
            }
        });
        if(!user){
            return res.status(404).json({
                message : "Invalid or Expired Token"
            });
        }
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = "";
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({
            message : "Password Reset Successfully"
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

module.exports = {getProfile, updateProfile, updateProfilePicture, forgotPassword, resetPassword};