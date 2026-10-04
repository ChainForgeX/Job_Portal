const Company = require("./Company");
const cloudinary = require("./cloudinary");
const createCompany = async(req, res)=>{
    try{
        const {companyname, description, website, location} = req.body;
        const exisitingUser = await Company.findOne({
            companyname,
            owner : req.user.id
        });
        if(exisitingUser){
            return res.status(400).json({
                message : "Company Already Exists"
            });
        }
        if(req.user.role != "employer"){
            return res.status(403).json({
                message : "Only Employers can create Company"
            });
        }
        const company = await Company.create({
            companyname,
            description,
            website,
            location,
            owner : req.user.id
        });
        res.status(201).json({
            message : "Company Created Successfully",
            company
        })
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const getMyCompanies = async(req, res)=>{
    try{
        const companies = await Company.find({owner : req.user.id});
        res.status(200).json(companies);
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const updateCompany = async(req, res)=>{
    try{
        const {name, description, website, location} = req.body;
        const company = await Company.findOne({
            _id : req.params.id,
            owner : req.user.id
        });
        if(!company){
            return res.status(404).json({
                message : "Company Not Found"
            });
        }
        company.name = name || company.name;
        company.description = description || company.description;
        company.website = website || company.website;
        company.location = location || company.location;
        if(req.file){
            if(company.logoPublicId){
                await cloudinary.uploader.destroy(company.logoPublicId);
            }
            company.logo = req.file.path;
            company.logoPublicId = req.file.filename;
        }
        await company.save();
        res.status(200).json({
            message : "Company Updated Successfully",
            company
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const deleteCompany = async(req, res)=>{
    try{
        const company = await Company.findOne({
            _id : req.params.id,
            owner : req.user.id
        });
        if(!company){
            return res.status(404).json({
                message : "Company Not Found"
            });
        }
        if(company.logoPublicId){
            await cloudinary.uploader.destroy(company.logoPublicId);
        }
        await Company.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message : "Company Deleted Successfully"
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

module.exports = {createCompany, getMyCompanies, updateCompany, deleteCompany};