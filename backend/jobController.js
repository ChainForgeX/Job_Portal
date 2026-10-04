const Job = require("./Job");
const Company = require("./Company");
const Application = require("./Application");
const createJob = async(req, res)=>{
    try{
        const {title, description, salary, location, jobType, experience, skills, company} = req.body;
        if(req.user.role != "employer"){
            return res.status(403).json({
                message : "Only Employers can Post Job"
            });
        }
        const companyExists = await Company.findOne({
            _id : company,
            owner : req.user.id
        });
        if(!companyExists){
            return res.status(403).json({
                message : "Company Not Found"
            });
        }
        const job = await Job.create({
            title,
            description,
            salary,
            location,
            jobType,
            experience,
            skills,
            company,
            createdBy : req.user.id
        });
        res.status(201).json({
            message : "Job Created Successfully",
            job
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const getAllJobs = async(req, res)=>{
    try{
        const page = Number(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        const jobs = await Job.find({status : "Open"}).populate("company").skip(skip).limit(limit);
        res.status(200).json(jobs);
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const getMyJobs = async(req, res)=>{
    try{
        const {keyword, location, jobType} = req.query;
        const filter = {status : "Open"};
        if(keyword){
            filter.title = {
                $regex : keyword,
                $options : "i"
            };
        }
        if(location){
            filter.location = {
                $regex : location,
                $options : "i"
            };
        }
        if(jobType){
            filter.jobType = jobType;
        }
        const jobs = await Job.find(filter).populate("company");
        res.status(200).json(jobs);
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const updateJob = async(req, res)=>{
    try{
        const job = await Job.findById(req.params.id);
        if(!job){
            return res.status(404).json({
                message : "Job Not Found"
            });
        }
        if(job.createdBy.toString() != req.user.id){
            return res.status(403).json({
                message : "Access Denied"
            });
        }
        const jobUpdate = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new : true
            }
        );
        res.status(200).json({
            message : "Job Updated Successfully",
            jobUpdate
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const closeJob = async(req, res)=>{
    try{
        const job = await Job.findById(req.params.id);
        if(!job){
            return res.status(404).json({
                message : "Job Not Found"
            });
        }
        if(job.createdBy.toString() != req.user.id){
            return res.status(403).json({
                message : "Access Denied"
            });
        }
        job.status = "Closed";
        await job.save();
        res.status(200).json({
            message : "Job Closed Successfully"
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const deleteJob = async(req, res)=>{
    try{
        const job = await Job.findOne({
            _id : req.params.id,
            owner : req.user.id
        });
        if(!job){
            return res.status(404).json({
                message : "Job Not Found"
            });
        }
        await Application.deleteMany({
            job : req.params.id
        });
        await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message : "Job Deleted Successfully"
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

module.exports = {createJob, getAllJobs, getMyJobs, updateJob, closeJob, deleteJob};