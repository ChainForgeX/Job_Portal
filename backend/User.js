const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },
        email : {
            type : String,
            unique : true,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        role : {
            type : String,
            enum : [
                "candidate",
                "employer",
                "admin"
            ],
            default : "candidate"
        },
        company : {
            type : String,
            default : ""
        },
        resume : {
            type : String,
            default : ""
        },
        skills : [
            {
                type : String,
                default : []
            }
        ],
        experience : {
            type : String,
            default : ""
        },

        profilePicture : {
            type : String,
            default : ""
        },

        profilePicturePublicId : {
            type : String,
            default : ""
        },

        resetPasswordToken : {
            type : String,
            default : ""
        },

        resetPasswordExpire : {
            type : Date
        }
    },
    {
        timestamps : true
    }
);

module.exports = mongoose.model("User", userSchema);