const User = require("./User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async(req, res)=>{
    try{
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message : "User Already Exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            role
        });
        res.status(201).json({
            message : "Registration Successful",
            user
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

const loginUser = async(req, res)=>{
    try{
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message : "Invalid User"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                message : "Invalid"
            });
        }
        const token = jwt.sign(
            {
                id : user._id,
                role : user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn : "7d"
            }
        );
        res.status(200).json({
            message : "Login Successful",
            token,
            role : user.role
        });
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

module.exports = {registerUser, loginUser};