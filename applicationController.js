const Application = require("../models/Application");
const Job = require("../models/Job");
const applyJob = async(req, res)=>{
    try{
        if(req.user.role != "candidate"){
            return res.status(403).json({
                message : "Only Candidates can Apply"
            });
        }
        if(!req.file){
            return res.status(400).json({
                message : "Resume is Required"
            });
        }
        const {coverLetter} = req.body;
        const job = req.params.jobId;
        const resume = req.file.path;
        const jobExists = await Job.findById(job);
        if(!jobExists){
            return res.status(404).json({
                message : "Job Not Found"
            });
        }
        if(jobExists.status == "Closed"){
            return res.status(400).json({
                message : "Job is Closed"
            });
        }
        const applicationExists = await Application.findOne({
            candidate : req.user.id,
            job
        });
        if(applicationExists){
            return res.status(400).json({
                message : "Already Applied"
            });
        }
        const application = await Application.create({
            candidate : req.user.id,
            job,
            resume,
            coverLetter
        });
        res.status(201).json({
            message : "Application Submitted Successfully",
            application
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const getMyApplications = async(req, res)=>{
    try{
        const applications = await Application.find({candidate : req.user.id}).populate({
            path : "job",
            populate : {
                path : "company"
            }
        });
        res.status(200).json(applications);
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const getApplicationsForEmployer = async(req, res)=>{
    try{
        const jobs = await Job.find({
            createdBy : req.user.id
        });
        const jobIds = jobs.map(job => job._id);
        const applications = await Application.find({
            job : {
                $in : jobIds
            }
        }).populate("candidate")
        .populate({
            path : "job",
            populate : {
                path : "company"
            }
        });
        res.status(200).json(applications);
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const updateApplicationStatus = async(req, res)=>{
    try{
        const {status} = req.body;
        const application = await Application.findById(req.params.id).populate("job");
        if(!application){
            return res.status(404).json({
                message : "Application Not Found"
            });
        }
        if(application.job.createdBy != req.user.id){
            return res.status(403).json({
                error : "Access Denied"
            });
        }
        application.status = status;
        await application.save();
        res.status(200).json({
            message : "Application Status Updated",
            application
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const withdrawApplication = async(req, res)=>{
    try{
        const application = await Application.findOne({
            _id : req.params.id,
            candidate : req.user.id
        });
        if(!application){
            return res.status(404).json({
                message : "Application Not Found"
            });
        }
        if(application.status === "Accepted"){
            return res.status(400).json({
                message: "Accepted applications cannot be withdrawn"
            });
        }
        await Application.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message : "Application Withdrawn Successfully"
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

module.exports = {applyJob, getMyApplications, getApplicationsForEmployer, updateApplicationStatus, withdrawApplication};