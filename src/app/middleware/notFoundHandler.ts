import type { Request, Response } from "express";
import status from "http-status";

export const NotfoundHandler=async(req:Request,res:Response)=>{
  
    return  res.status(status.NOT_FOUND).json({
        success:false,
        message:`Route ${req.originalUrl} not found`,
        // error:`Route ${req.originalUrl} not found`
    })
}