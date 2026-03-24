import type { Request } from "express";
import { deleteFileFromCloudinary } from "../../config/cloude.config";

export const deleteUploadedFilesFromGlobalErrorHandler=async(req:Request)=>{
    try{
        let filesToDeleteList:string[]=[];
        if(req?.file && req?.file?.path){
          filesToDeleteList?.push(req?.file?.path);
          // await deleteFileFromCloudinary(req.file.path)
      }
      else if(req?.files && typeof req?.files === "object" && !Array.isArray(req?.files)){
        Object.values(req?.files)?.forEach((files)=>{
          files?.forEach((file)=>{
            if(file?.path){
              filesToDeleteList.push(file?.path);
    
            }
          })
        })
    
      }
      else if(req.files && Array.isArray(req.files) && req.files.length > 0){
        const imageUrls = req.files.forEach((file) => {
          if(file?.path){
            filesToDeleteList.push(file.path);
          }
        });
    
      }
    
      if(filesToDeleteList?.length>0){
        await Promise.all((filesToDeleteList)?.map((i)=>deleteFileFromCloudinary(i)))
      }
      console.log(`files of ${filesToDeleteList.join(',')} are deleted`)
    }
    catch(error){
        console.log(error)
    }
}