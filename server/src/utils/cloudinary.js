import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (buffer, cloudinaryFolderPath = "") => {
    try {
        if (!buffer) return null;

        // Upload file to Cloudinary from buffer
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: "Vibrogram/Dev/" + cloudinaryFolderPath
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary Upload Error:", error);
                        reject(null);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(buffer); // Send buffer to Cloudinary
        });

    } catch (err) {
        console.error("Upload to Cloudinary failed:", err);
        return null;
    }
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        if (!publicId) {
            console.log("No publicId provided, skipping deletion.");
            return { success: false, message: "No deletion needed (default URL or no file)." };
        }
        // Delete the file from Cloudinary
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        return { success: true, message: "File deleted successfully." };
    } catch (error) {
        console.error("Error while deleting file from Cloudinary: ", error);
        return { success: false, message: error.message || "File deletion failed." };
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };