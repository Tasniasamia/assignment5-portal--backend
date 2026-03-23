import type { CookieOptions, Request, Response } from "express";

const setCookie=async(res:Response,key:string,value:string,options:CookieOptions)=>{
return await res.cookie(key,value,options);
}

const getCookie=async(req:Request,key:string)=>{
    return await req.cookies[key];
}

const clearCookie=async(res:Response,key:string,options:CookieOptions)=>{
    return await res.clearCookie(key,options);
}

export const cookieUtils={setCookie,getCookie,clearCookie}