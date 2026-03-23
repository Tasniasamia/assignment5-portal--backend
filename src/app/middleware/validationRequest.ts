import type { NextFunction, Request, Response } from "express";
import type z from "zod";

export const validationRequest=(zodSchema:z.ZodObject)=>{
    return  async(req:Request,res:Response,next:NextFunction)=>{
        if(req?.body?.data){
            req.body=JSON.parse(req?.body?.data)
        }
        // console.log("req?.body",req?.body);
          const parsedSchema=await zodSchema.safeParse(req.body);
          if(!parsedSchema?.success){
           return next(parsedSchema?.error);
          }
          req.body=parsedSchema.data;
          return next();

    }
}