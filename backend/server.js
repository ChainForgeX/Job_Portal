const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./db");
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const authRoutes = require("./authRoutes");
const companyRoutes = require("./companyRoutes");
const jobRoutes = require("./jobRoutes");
const applicationRoutes = require("./applicationRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const userRoutes = require("./userRoutes");

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res)=>{
    res.send("Job Portal API Running");
});

const PORT = 5005;

app.listen(PORT, ()=>{
    console.log(`Server Running on Port ${PORT}`);
});