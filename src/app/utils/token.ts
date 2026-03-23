import type {  JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVars } from "../../config/env";
import { cookieUtils } from "./cookie";
import type { Response } from "express";
import type { IJwtUserPayload } from "../interfaces/token.interface";

const generateAccessToken = (payload: JwtPayload) => {
  console.log("payload",payload)
  return jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET, {
    expiresIn:  60 * 60 * 24 ,
  } as SignOptions);
};

const generateRefreshToken = (payload: JwtPayload) => {
    return jwtUtils.createToken(payload, envVars.REFRESH_TOKEN_SECRET, {
      expiresIn:  60 * 60 * 24 * 7
    });
  };

const setGenerateAccessTokenCookie=async(res:Response,accessToken:string)=>{
 return await cookieUtils.setCookie(res, "accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none",
    path: "/",
    secure:true,
    maxAge: 60 * 60 * 24
  });
}

const setGenerateRereshTokenCookie=async(res:Response,refreshToken:string)=>{
return  await cookieUtils.setCookie(res, "refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    path: "/",
    secure:true,
    maxAge: 60 * 60 * 24 * 7
  });
}

const setBetterAuthSessionCookie=async(res:Response,token:string)=>{
  await cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    sameSite: "none",
    path: "/",
    secure:true,
    maxAge: 60 * 60 * 24
  });
}
export const tokenUtils={
    generateAccessToken,generateRefreshToken,setGenerateAccessTokenCookie,setGenerateRereshTokenCookie,setBetterAuthSessionCookie
}



