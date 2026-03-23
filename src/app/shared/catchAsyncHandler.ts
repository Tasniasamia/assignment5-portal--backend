import type { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsyncHandler=(functionHandler:RequestHandler)=>{

    return async(req:Request,res:Response,next:NextFunction)=>{
        try{
          await functionHandler(req,res,next);
        }
        catch(error:any){
          console.log("error",error)
          next(error);
        }
    }

  }  


