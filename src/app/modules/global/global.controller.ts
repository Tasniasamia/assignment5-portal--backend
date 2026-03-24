import type { Request, Response } from "express";
import { deleteFileFromCloudinary } from "../../../config/cloude.config";
import { sendResponse } from "../../shared/sendResponse";

export const deleteFile=async(req:Request,res:Response)=>{
const { filePath } = req.body;
const result=await deleteFileFromCloudinary(filePath);
if(result){
    sendResponse(res,{
        success:true,
        message:'File deleted successfully',
        httpStatusCode:200,
        data:[]
    })
}
}