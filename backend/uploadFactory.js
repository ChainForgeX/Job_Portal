const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");
const createUpload = (
    folder,
    allowedFormats,
    resourceType
)=>{
    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET &&
        !process.env.CLOUDINARY_CLOUD_NAME.startsWith("your-");
    if(!hasCloudinary){
        const uploadDirectory = path.join(__dirname, "uploads", folder.split("/").pop());
        fs.mkdirSync(uploadDirectory, {recursive : true});
        const storage = multer.diskStorage({
            destination : uploadDirectory,
            filename : (req, file, callback) => {
                callback(null, `${Date.now()}-${file.originalname}`);
            }
        });
        return multer({storage});
    }
    const storage = new CloudinaryStorage({
        cloudinary,
        params:{
            folder,
            allowed_formats:allowedFormats,
            resource_type:resourceType
        }
    });
    return multer({storage});
};

module.exports = createUpload;