const mongoose = require("mongoose");
const Company = require("./Company");
const Job = require("./Job");
const Application = require("./Application");
const getEmployerDashboard = async(req, res)=>{
    try{
        const totalCompanies = await Company.countDocuments({owner : req.user.id});
        const jobStats = await Job.aggregate([
            {
                $match : {
                    createdBy : new mongoose.Types.ObjectId(req.user.id)
                }
            },
            {
                $group : {
                    _id : "$status",
                    total : {
                        $sum : 1
                    }
                }
            }
        ]);
        let totalJobs = 0;
        let openJobs = 0;
        let closedJobs = 0;
        jobStats.forEach(item =>{
            totalJobs += item.total;
            if(item._id === "Open"){
                openJobs = item.total;
            }
            if(item._id === "Closed"){
                closedJobs = item.total;
            }
        });
        const jobs = await Job.find({createdBy: req.user.id});
        const jobIds = jobs.map(job => job._id);
        const applicationStats = await Application.aggregate([
            {
                $match : {
                    job : {
                        $in : jobIds
                    }
                }
            },
            {
                $group : {
                    _id : "$status",
                    total : {
                        $sum : 1
                    }
                }
            }
        ]);
        let totalApplications = 0;
        let accepted = 0;
        let rejected = 0;
        let interview = 0;
        let reviewed = 0;

        applicationStats.forEach(item =>{
            totalApplications += item.total;
            if(item._id === "Accepted"){
                accepted = item.total
            }
            if(item._id === "Rejected"){
                rejected = item.total
            }
            if(item._id === "Interview"){
                interview = item.total
            }
            if(item._id === "Reviewed"){
                reviewed = item.total
            }
        });
        res.status(200).json({
            totalCompanies,
            totalJobs,
            openJobs,
            closedJobs,
            totalApplications,
            accepted,
            rejected,
            interview,
            reviewed
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const getCandidateDashboard = async(req, res)=>{
    try{
        const stats = await Application.aggregate([
            {
                $match : {
                    candidate : new mongoose.Types.ObjectId(req.user.id)
                }
            },
            {
                $group : {
                    _id : "$status",
                    total : {
                        $sum : 1
                    }
                }
            }
        ]);
        let totalApplications = 0;
        let applied = 0;
        let reviewed = 0;
        let interview = 0;
        let accepted = 0;
        let rejected = 0;
        stats.forEach(item =>{
            totalApplications += item.total;
            if(item._id == "Applied"){
                applied == item.total;
            }
            if(item._id == "Reviewed"){
                reviewed == item.total;
            }
            if(item._id == "Interview"){
                interview = item.total;
            }
            if(item._id == "Accepted"){
                accepted = item.total;
            }
            if(item._id == "Rejected"){
                rejected = item.total;
            }
        });
        res.status(200).json({
            totalApplications,
            applied,
            reviewed,
            interview,
            accepted,
            rejected
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

module.exports = {getEmployerDashboard, getCandidateDashboard};