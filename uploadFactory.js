const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const createUpload = (
    folder,
    allowedFormats,
    resourceType
)=>{
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