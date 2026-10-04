require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./User");
const Company = require("./Company");
const Job = require("./Job");

const seedDemo = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const password = await bcrypt.hash("TalvoraDemo123!", 10);
    const employer = await User.findOneAndUpdate(
        { email: "employer@talvora.demo" },
        { name: "Talvora Hiring Team", email: "employer@talvora.demo", password, role: "employer" },
        { upsert: true, new: true }
    );
    await User.findOneAndUpdate(
        { email: "candidate@talvora.demo" },
        { name: "Demo Candidate", email: "candidate@talvora.demo", password, role: "candidate" },
        { upsert: true, new: true }
    );

    const company = await Company.findOneAndUpdate(
        { companyname: "Lumen Works", owner: employer._id },
        {
            companyname: "Lumen Works",
            description: "A product studio building useful tools for modern teams.",
            website: "https://example.com",
            location: "Remote",
            owner: employer._id
        },
        { upsert: true, new: true }
    );

    const jobs = [
        {
            title: "Product Designer",
            description: "Shape clear, human-centered experiences for a growing product team.",
            salary: 115000,
            location: "Remote",
            jobType: "Full Time",
            experience: "3+ years",
            skills: ["Figma", "Research", "Prototyping"],
            company: company._id,
            createdBy: employer._id,
            status: "Open"
        },
        {
            title: "Full Stack Engineer",
            description: "Build reliable product surfaces across the stack with a thoughtful team.",
            salary: 135000,
            location: "New York or Remote",
            jobType: "Full Time",
            experience: "2+ years",
            skills: ["Node.js", "React", "MongoDB"],
            company: company._id,
            createdBy: employer._id,
            status: "Open"
        }
    ];

    for (const job of jobs) {
        await Job.findOneAndUpdate(
            { title: job.title, company: company._id },
            job,
            { upsert: true, new: true }
        );
    }

    console.log("Demo data ready.");
    console.log("Candidate: candidate@talvora.demo / TalvoraDemo123!");
    console.log("Employer: employer@talvora.demo / TalvoraDemo123!");
    await mongoose.disconnect();
};

seedDemo().catch(async (error) => {
    console.error(error.message);
    await mongoose.disconnect();
    process.exit(1);
});
