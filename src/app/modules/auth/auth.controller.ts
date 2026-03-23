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


const registerPatient = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await AuthService.registerPatient(payload);

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
      data: result,
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

export const AuthController = {
  registerPatient,
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
};
