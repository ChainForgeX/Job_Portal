const mongoose = require("mongoose");
const companySchema = new mongoose.Schema(
    {
        companyname : {
            type : String,
            required : true
        },
        
        description : {
            type : String,
            default : ""
        },

        website : {
            type : String,
            default : ""
        },

        location : {
            type : String,
            default : ""
        },

        logo : {
            type : String,
            default : ""
        },

        logoPublicId : {
            type : String,
            default : ""
        },

        owner : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        }
    },
    {
        timestamps : true
    }
);

module.exports = mongoose.model("Company", companySchema);