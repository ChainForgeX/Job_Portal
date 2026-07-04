const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema(
    {
        candidate : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },

        job : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Job",
            required : true
        },

        status : {
            type : String,
            enum : [
                "Applied",
                "Reviewed",
                "Interview",
                "Accepted",
                "Rejected"
            ],
            default : "Applied",
            required : true
        },

        resume : {
            type : String,
            default : ""
        },

        coverLetter : {
            type : String
        }
    },
    {
        timestamps : true
    }
);

module.exports = mongoose.model("Application", applicationSchema);