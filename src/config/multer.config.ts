import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloude.config";

const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: async (req, file) => {
        console.log("filename",file.originalname);
      const originalName=file.originalname;
      const extension=originalName.split(".").pop();
      const fileNameWithoutExtension=originalName.split(".").slice(0,-1).join("-").toLowerCase().replace(/[^a-z0-9\-]/g, "");
         const uniqueName =
            Math.random().toString(36).substring(2)+
            "-"+
            Date.now()+
            "-"+
            fileNameWithoutExtension;

        const folder = extension === "pdf" ? "pdfs" : "images";


        return {
            folder : `ph-healthcare/${folder}`,
            public_id: uniqueName,
            format:extension
            
    }
}

})

export const multerUpload = multer({storage})