import type { NextFunction, Request, Response } from "express";
import { UserStatus, type Role } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import { AppError } from "../errorHelplers/appError";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../../config/env";
import type { JwtPayload } from "jsonwebtoken";

export const checkAuth=(...AuthRole:Role[])=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        try{
        const sessionToken=await cookieUtils.getCookie(req,'better-auth.session_token');
        if(!sessionToken){
            throw new Error('Unauthorized access! No session token provided.');
        }
        if(sessionToken){
        const sessionExistUser=await prisma.session.findFirst({
          where:{token:sessionToken,expiresAt:{gt:new Date()}},
          include:{user:true}
          
        })
        if(sessionExistUser && sessionExistUser?.user){

            const expireTime=new Date(sessionExistUser?.expiresAt).getTime();
            const createTime=new Date(sessionExistUser?.createdAt).getTime();
            const now=new Date().getTime();

            const sessionLifeTime=(expireTime-createTime);
            const sessionRemainTime=(expireTime-now);
            const percentageTime=(sessionRemainTime/sessionLifeTime)*100;

            if(percentageTime<20){
                res.setHeader('X-Session-Refresh','true');
                res.setHeader('X-Session-Expires-At',expireTime.toString());
                res.setHeader('X-Session-Remaining-Time',sessionRemainTime.toString());


            }
            if(!sessionRemainTime){
                throw new AppError(status.UNAUTHORIZED,'Session time has been expired')
            }

            if(sessionExistUser?.user?.status === (UserStatus.BLOCKED|| UserStatus.DELETED)){
                throw new AppError(status.UNAUTHORIZED,'Unauthorized Access. User is not active')
            }
            if(sessionExistUser?.user?.isDeleted){
                throw new AppError(status.UNAUTHORIZED,'Unauthorized Access. User is deleted')
            }
            if(AuthRole.length>0 && !AuthRole.includes(sessionExistUser?.user?.role)){
                throw new AppError(status.FORBIDDEN,'Forbidden User. You do not have permission to access this resources')
            }

        }
    }
        const accessToken=await cookieUtils.getCookie(req,'accessToken');
        if(!accessToken){
            throw new AppError(status.UNAUTHORIZED,'Unauthorized Access. No access token provided here')
        }
        const accessTokenPayload= await jwtUtils.verifyToken(accessToken,envVars.ACCESS_TOKEN_SECRET);
       if(!accessTokenPayload?.success){
       throw new AppError(status.UNAUTHORIZED,accessTokenPayload?.message)
       }
       req.user=accessTokenPayload.data as JwtPayload;

        next();
    }
    catch(error){
        next(error);
    }
    }
}