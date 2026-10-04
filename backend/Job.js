const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : true
        },

        description : {
            type : String,
            required : true
        },

        salary : {
            type : Number,
            required : true
        },

        location : {
            type : String,
            default : ""
        },

        jobType : {
            type : String,
            enum : [
                "Full Time",
                "Part Time",
                "Internship",
                "Contract"
            ],
            required : true
        },

        experience : {
            type : String,
            default : ""
        },

        skills : {
            type : [String],
            default : []
        },

        company : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Company",
            required : true
        },

        createdBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },

        status : {
            type : String,
            enum : [
                "Open",
                "Closed"
            ],
            default : "Open"
        }
    },
    {
        timestamps : true
    }
);

module.exports = mongoose.model("Job", jobSchema);