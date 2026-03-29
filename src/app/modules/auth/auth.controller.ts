import type { NextFunction, Request, Response } from "express";
import { catchAsyncHandler } from "../../shared/catchAsyncHandler";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { cookieUtils } from "../../utils/cookie";
import { envVars } from "../../../config/env";
import { tokenUtils } from "../../utils/token";
import type { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errorHelplers/appError";
import type { TChangePasswordPayload } from "./auth.interface";
import ejs from 'ejs';
import path from "path";
import { auth } from "../../lib/auth";


const register = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await AuthService.register(payload);

    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Patient registered successfully",
      data: result,
    });
  }
);

const loginUser = catchAsyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  const { data, accessToken, refreshToken, token } =
    await AuthService.loginUser(payload);

  tokenUtils.setGenerateAccessTokenCookie(res, accessToken);
  tokenUtils.setGenerateRereshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);

  return await sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: {accessToken,refreshToken,token,user:data?.user},
  });
});

const getProfile = catchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await req.user;
    const result = await AuthService.getProfile(user as JwtPayload);
    return await sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Get profile successfully",
      data: result,
    });
  }
);

const getNewToken = catchAsyncHandler(async (req: Request, res: Response) => {
  const getSessionToken = await cookieUtils.getCookie(
    req,
    "better-auth.session_token"
  );
  const getRefreshToken = await cookieUtils.getCookie(req, "refreshToken");

  if (!getRefreshToken) {
    throw new AppError(status.UNAUTHORIZED, "Refreshtoken is missing");
  }
  const result = await AuthService.getNewToken(
    getRefreshToken,
    getSessionToken
  );
  if (!result) {
    throw new Error("Failed to generate access token by refresh token");
  }
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setGenerateAccessTokenCookie(res, accessToken);
  tokenUtils.setGenerateRereshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken,
      sessionToken: token,
    },
  });
});

const changePassword = catchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = (await req?.body) as TChangePasswordPayload;
    const getSessionToken = await cookieUtils.getCookie(
      req,
      "better-auth.session_token"
    );

    const { data, accessToken, refreshToken, token } =
      await AuthService.changePassword(payload, getSessionToken);

    tokenUtils.setGenerateAccessTokenCookie(res, accessToken);
    tokenUtils.setGenerateRereshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string);
    if (data) {
      return sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "password changed successfully",
        data: data,
      });
    }
  }
);

const logOut = catchAsyncHandler(async (req: Request, res: Response) => {
  const sessionToken = await cookieUtils.getCookie(
    req,
    "better-auth.session_token"
  );
  const result = await AuthService.logOut(res, sessionToken);
  return await sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged out successfully",
    data: result,
  });
});

const verifyEmail = catchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = (await req?.body) as { email: string; otp: string };
    const result = await AuthService.verifyEmail(payload);
    return sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Email verified successfully",
      data: result,
    });
  }
);

const requestPasswordReset = catchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = (await req?.body) as { email: string };
    const result = await AuthService.requestPasswordReset(email);
    if (result) {
      return await sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Please eheck your OTP into your email",
        data: result,
      });
    }
  }
);

const resetPasswordReset = catchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = (await req?.body) as {
      email: string;
      otp: string;
      password: string;
    };
    const result = await AuthService.resetPassword(payload);
    await sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "password reset Successfully",
      data: null,
    });
  }
);

const googleLogin = catchAsyncHandler(
  async (req: Request, res: Response) => {

    const redirectURLPath =
      (req.query["redirectURLPath"] as string) || "/dashboard";
      const filterRedirectURLPath = encodeURIComponent(redirectURLPath as string);

    const callbackURL =
      `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirectURLPath=${(filterRedirectURLPath)}`;

      const pathURL = path.join(
        process.cwd(),
        `src/app/template/googleRedirect.ejs`
      )
      
      res.render(pathURL, {
      betterAuthURL: envVars.BETTER_AUTH_URL,
      callbackURL,
    });
  }
);

const googleSuccess = catchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
  
  const redirectURLPath = req?.query["redirectURLPath"];
  // const filterRedirectURLPath = encodeURIComponent(redirectURLPath as string);
 const sessionToken=await cookieUtils.getCookie(req,'better-auth.session_token');
    console.log("sessionToken",sessionToken);
    if(!sessionToken){
      res.redirect(`${envVars.FRONTEND_URL}/login?error=oAuth_failed`);

    }

    // const session = await auth.api.getSession({
    //   headers: new Headers({
    //     Authorization: `Bearer ${sessionToken}`,
    //   }),
    // });
    // const session = await auth.api.getSession({
    
      // headers: new Headers({
      //   cookie: req.headers.cookie || "",
      // }),
    // });
    const session = await auth.api.getSession({
      headers:{
        "Cookie":`better-auth.session_token=${sessionToken}`
      }
   
    });
    
  console.log('session',session)
    if (!session) {
    return  res.redirect(`${envVars.FRONTEND_URL}/login?error=session_not_found`)
    } 

    if(session && !session?.user){
    return  res.redirect(`${envVars.FRONTEND_URL}/login?error=user_not_found`)

    }

    // if(session && session?.user){
      const createPatient=await AuthService.googleSuccess(session?.user);
      if(createPatient){
        tokenUtils.setGenerateAccessTokenCookie(res, createPatient?.accessToken);
        tokenUtils.setGenerateRereshTokenCookie(res, createPatient?.refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
      
      return  res.redirect(`${envVars.FRONTEND_URL}${redirectURLPath}`)

      }

    // }







  }
);

const handlerOauthError = catchAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const error=req?.query['error'] || 'oAuth_failed';
    res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`)

  }
);


const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email, type } = req.body;
    // type = "email-verification" or "forget-password"

    if (!email || !type) {
      return res.status(400).json({success:false, message: "Email and type are required" });
    }

    // BetterAuth এর internal handler কে call করো
    const response = await auth.api.sendVerificationOTP({
      body: {
        email,
        type,
      },
    });
    console.log("resend otp response",response);
    if(response?.success){
    return res.status(200).json({ success:true,data:[],message: "OTP resent successfully" });

    }

  } catch (error:any) {
    return res.status(500).json({ message: error?.message,success:false});
  }
};


//  const updateProfile= (catchAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
//   const data=await req.body;
//   const payload={...req.body,image:req?.file?.path}
//   const response=await AuthService.updateProfile(payload,req?.user);
//   if(response){
//   return await sendResponse(res,{
//     success:true,
//     message:'Profile Updated Successfully',
//     data:response,
//     httpStatusCode:201
//     });
//   }
//  }))
const updateProfile = catchAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const parseData = typeof req.body.data === "string"
      ? JSON.parse(req.body.data)
      : req.body.data;

  const payload = { ...parseData, image: req?.file?.path };

  const response = await AuthService.updateProfile(payload, req?.user);

  return sendResponse(res, {
    success: true,
    message: "Profile Updated Successfully",
    data: response,
    httpStatusCode: 200,
  });
});


export const deleteAuthFile=catchAsyncHandler(async(req:Request,res:Response)=>{
  const {filePath}=req.body;
  const user=await req.user;
  const result=await AuthService.deleteAuthFile(filePath,user as JwtPayload);
  if(result){
    sendResponse(res,{
      success:true,
      message:'File deleted successfully',
      httpStatusCode:200,
      data:[]
    })
  }
})



export const AuthController = {
  register,
  loginUser,
  getProfile,
  getNewToken,
  changePassword,
  logOut,
  verifyEmail,
  requestPasswordReset,
  resetPasswordReset,
  googleLogin,
  googleSuccess,
  resendOtp,
  updateProfile,
  deleteAuthFile
};
